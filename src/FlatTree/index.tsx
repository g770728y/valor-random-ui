import * as React from "react";
import "./index.css";
import { TreeNode } from "./index.interface";
import { isLeaf, getHiddenIdsForCollapsed } from "./helpers/common";
import { FlatTreeHelper } from "./helpers";
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";
import { Center } from "../layout";
import * as R from "rambdax";
import classnames from "classnames";
import { dissoc } from "valor-app-utils";

type FlatTreeNodeProps = {
  ActionComponent?: React.FC<{ id: any }>;
  data: TreeNode;
  isLeaf: boolean;
  isSelected: boolean;
  isCollapsed: boolean;
  readonly?: boolean;
  onSelect: (id: any) => void;
  onCollapse?: (id: any) => void;
  onExpand?: (id: any) => void;
} & React.HTMLAttributes<HTMLElement>;

const FlatTreeNode_: React.FC<FlatTreeNodeProps> = _props => {
  const {
    ActionComponent,
    data,
    isLeaf,
    isSelected,
    isCollapsed,
    readonly,
    onSelect,
    onCollapse,
    onExpand
  } = _props;
  // console.log('render node');
  const [hovered, setHovered] = React.useState(false);
  const onClick = React.useCallback(() => {
    if (onSelect) {
      onSelect(data.id);
    }
  }, []);
  const isReadonly = !!(readonly || data.readonly);
  const props = {
    style: {
      position: "absolute",
      left: `${data.level - 1}em`,
      cursor: "pointer"
    } as React.CSSProperties,
    width: 16,
    height: "100%",
    inline: true
  };
  let content: any;
  if ((typeof data.content).toLowerCase() === "function") {
    const C = data.content as any;
    content = <C {...dissoc(data, "content")} />;
  } else {
    content = data.content;
  }
  return (
    <div
      id={`catalog_${data.id}`}
      className={`valor-flat-tree-item ${
        isSelected ? "valor-flat-tree-item-selected" : ""
      }`}
      key={data.id}
      style={{
        paddingLeft: `${data.level + 0.3}em`
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {onExpand && !isLeaf && isCollapsed && (
        <Center {...props} onClick={() => onExpand(data.id)}>
          <IoMdArrowDropright />
        </Center>
      )}
      {onCollapse && !isLeaf && !isCollapsed && (
        <Center {...props} onClick={() => onCollapse(data.id)}>
          <IoMdArrowDropdown />
        </Center>
      )}
      <div
        className={classnames("valor-flat-tree-item-content", {
          "flat-tree-item-readonly": isReadonly
        })}
      >
        {content}
      </div>
      {!isReadonly && isSelected && hovered && ActionComponent && (
        <div className={"valor-action-container"}>
          <ActionComponent id={data.id} />
        </div>
      )}
    </div>
  );
};

function compareFn(prevProps: FlatTreeNodeProps, nextProps: FlatTreeNodeProps) {
  const p = R.pick(["data", "isLeaf", "isSelected", "isCollapsed"]);
  return R.equals(p(prevProps), p(nextProps));
}

const FlatTreeNode = React.memo(FlatTreeNode_, compareFn);

interface FlatTreeProps {
  ActionComponent: React.FC<{ id: any }>;
  data: TreeNode[];
  collapsedIds: any[];
  selectedId?: any;
  onSelect: (id: any) => void;
  onCollapse?: (id: any) => void;
  onExpand?: (id: any) => void;
  readonly?: boolean;
}
const FlatTree: React.FC<FlatTreeProps> = ({
  ActionComponent,
  data,
  selectedId,
  collapsedIds,
  readonly,
  onSelect,
  onCollapse,
  onExpand
}) => {
  const hiddenIds = getHiddenIdsForCollapsed(data, collapsedIds);
  const items = data.map(item => {
    const { id } = item;

    if (hiddenIds.includes(id)) return null;

    return (
      <FlatTreeNode
        ActionComponent={ActionComponent}
        key={item.id}
        data={item}
        isSelected={selectedId === id}
        isLeaf={isLeaf(data, item.id)}
        isCollapsed={collapsedIds.includes(id)}
        readonly={readonly}
        onSelect={onSelect}
        onCollapse={onCollapse}
        onExpand={onExpand}
      />
    );
  });
  return <div className={"valor-flat-tree"}>{items}</div>;
};

export default FlatTree;
export { FlatTreeHelper };
