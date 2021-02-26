import * as React from "react";
import { storiesOf } from "@storybook/react";
import "antd/dist/antd.css";
import FileUploadDialog from ".";
import { Button } from "antd";
import * as R from "rambdax";
import { nextId } from "valor-app-utils";

const FileUploadDialogTest = () => {
  const [show, setShow] = React.useState(false);
  const onCancel = () => setShow(false);
  const onOk = (result: any) => {
    console.log("result:", result);
    return Promise.resolve();
  };
  const items = R.range(0, 100).map(i => ({
    name: `name${i}`,
    url: `/name${i}`,
    data: { id: i, remark: "相当于备份一下记录, 以便返回时对照" }
  }));

  return (
    <>
      <FileUploadDialog
        mode="view"
        fileItems={items}
        title="上传附件测试"
        uploadButtonText="立即上传!"
        staticRoot="/root"
        onCancel={onCancel}
        show={show}
        onOk={onOk}
        onUpload={() =>
          [
            {
              name: nextId(),
              url: "///",
              data: {}
            }
          ] as any
        }
      />
      <Button onClick={() => setShow(true)}>显示上传对话框</Button>
    </>
  );
};

storiesOf("file-upload-dialog", module).add("default", () => {
  return <FileUploadDialogTest />;
});
