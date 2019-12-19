import * as React from "react";
import { PromisifyModalProps } from "react-promisify-modal";
import { Modal, Table, Button, Divider, Icon } from "antd";
import { download, openFiles, file2DataURL, nextId } from "valor-app-utils";
import * as R from "rambda";
import { dropIndex } from "valor-app-utils/dist/array";

export type IFileUploadItemStatus = "staled" | "added" | "updated" | "deleted";

export interface IFileUploadItem {
  // 如果不传id, 则启用 temp:nextId()
  id?: string | number;
  name: string;
  url: string;
  status?: IFileUploadItemStatus;
  // 保存在数据源中的记录
  // 比如 attachment:IAttachment
  // 如果不提供, 则一律判断为新记录
  data: any;
}

interface Props extends PromisifyModalProps<any> {
  // 对话框标题, 默认"上传管理"
  title?: string;
  uploadButtonText?: string;
  // 静态文件根
  staticRoot?: string;
  // 显示在表格中的内容
  fileItems: IFileUploadItem[];
  // 上传action, 用于最下方的上传按钮, 点击时一次性上传多个文件
  onUpload: (
    dataUris: string[],
    fileNames: string[]
  ) => Promise<IFileUploadItem[]>;
  // 分情况返回数据
  onOk: (
    result: Record<IFileUploadItemStatus, IFileUploadItem[]>
  ) => Promise<any>;
  mode: "view" | "edit";
}

const FileUploadDialog: React.FC<Props> = props => {
  const {
    title = "上传管理",
    staticRoot = "/",
    uploadButtonText = "上传",
    fileItems,
    onUpload,
    onOk,
    onCancel,
    show
  } = props;

  const [items, setItems] = React.useState<IFileUploadItem[]>(
    fileItems.map(it => ({
      ...it,
      id: it.id || `temp:${nextId()}`,
      status: "staled"
    }))
  );

  const renameItem = (id: string | number, newName: string) => {
    const idx = items.findIndex(it => it.id === id);
    setItems(
      R.update(idx, { ...items[idx], name: newName, status: "updated" }, items)
    );
  };

  const markDelete = (
    id: string | number,
    newStatus: IFileUploadItemStatus
  ) => {
    const idx = items.findIndex(it => it.id === id);
    if (!items[idx].data || R.isNil(items[idx].data.id)) {
      setItems(items => dropIndex(items, idx));
    } else {
      setItems(R.update(idx, { ...items[idx], status: newStatus }, items));
    }
  };

  // const deleteItem = (id: string | number) => {
  //   const idx = items.findIndex(it => it.id === id);
  //   setItems(items => dropIndex(items, idx));
  // };

  const openAndUpload = () => {
    let files: File[];
    return openFiles("")
      .then(_files => {
        files = _files;
        return Promise.all(files.map(file2DataURL));
      })
      .then(dataUris => onUpload(dataUris, files.map(it => it.name)))
      .then(_items =>
        _items.map(it => ({ ...it, status: "staled" as IFileUploadItemStatus }))
      );
  };

  const createFiles = () => {
    return openAndUpload().then(_items =>
      setItems(items => [
        ..._items.map(it => ({
          ...it,
          id: `temp:${nextId()}`,
          status: "added" as any
        })),
        ...items
      ])
    );
  };

  const replaceFile = (id: number | string) => {
    return openAndUpload().then(_items =>
      setItems(items => {
        const idx = items.findIndex(it => it.id === id);
        return R.update(
          idx,
          {
            ...items[idx],
            name: _items[0].name,
            url: _items[0].url,
            status: "updated"
          },
          items
        );
      })
    );
  };

  const columns = [
    {
      title: "名称",
      dataIndex: "name",
      width: 300,
      render: (_: string, record: IFileUploadItem) => {
        return (
          <>
            <span>{record.name}</span>
            {props.mode === "edit" && (
              <a
                href="javascript:void(0)"
                style={{ marginLeft: 10 }}
                onClick={() => {
                  const newName = prompt("输入新名称:", record.name);
                  if (newName) {
                    renameItem(record.id!, newName);
                  }
                }}
              >
                <Icon type="edit" />
              </a>
            )}
          </>
        );
      }
    },
    {
      title: "状态",
      dataIndex: "status",
      width: 100,
      render: (_: string, record: IFileUploadItem) => {
        const statusMap = {
          staled: "-",
          updated: "已改动",
          added: "新增",
          deleted: "已删除"
        };
        return statusMap[record.status!];
      }
    },
    {
      title: "操作",
      dataIndex: "operation",
      width: 150,
      render: (_: string, record: IFileUploadItem) => {
        const deleted = record.status === "deleted";
        return deleted ? null : (
          <>
            {props.mode === "edit" && (
              <a
                href="javascript:void(0)"
                style={{ marginRight: 10 }}
                onClick={() => {
                  // deleteItem(record.id!);
                  markDelete(record.id!, "deleted");
                }}
              >
                删除
              </a>
            )}
            {props.mode === "edit" && (
              <a
                href="javascript:void(0)"
                style={{ marginRight: 10 }}
                onClick={() => {
                  replaceFile(record.id!);
                }}
              >
                重传
              </a>
            )}
            {props.mode === "edit" && <Divider type="vertical" />}
            <a
              onClick={() => {
                download(
                  `${staticRoot.endsWith("/") ? staticRoot : staticRoot + "/"}${
                    record.url
                  }`
                );
              }}
            >
              下载
            </a>
          </>
        );
      }
    }
  ];

  // 注意: 规避 先添加 再 修改 ( 本质上是添加 , 但会判断成 修改 找不到id ) 等情形
  const getRealStatus = (item: IFileUploadItem): IFileUploadItemStatus =>
    item.status === "staled"
      ? "staled"
      : !item.data || R.isNil(item.data.id)
      ? "added"
      : item.status === "deleted"
      ? "deleted"
      : "updated";

  const okButton = (
    <Button
      key="ok"
      onClick={() =>
        onOk(R.groupBy(getRealStatus, items) as any).then(onCancel)
      }
    >
      保存
    </Button>
  );

  const cancelButton = (
    <Button key="cancel" onClick={onCancel}>
      取消
    </Button>
  );
  const closeButton = (
    <Button key="cancel" onClick={onCancel}>
      关闭
    </Button>
  );
  return (
    <Modal
      title={title}
      onCancel={onCancel}
      footer={props.mode === "view" ? [closeButton] : [cancelButton, okButton]}
      visible={show}
      width={700}
      destroyOnClose={true}
    >
      {props.mode === "edit" && (
        <Button type="primary" onClick={createFiles}>
          {uploadButtonText}
        </Button>
      )}
      <div style={{ height: 10 }} />
      <Table
        size={"small"}
        rowKey={"id"}
        columns={props.mode === "edit" ? columns : dropIndex(columns, 1)}
        dataSource={items}
        pagination={false}
        scroll={{ y: 500, scrollToFirstRowOnChange: true }}
      />
    </Modal>
  );
};

export default FileUploadDialog;
