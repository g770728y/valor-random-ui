import * as React from 'react';
import './index.css';
import { TreeNode } from './index.interface';
import { isLeaf, getHiddenIdsForCollapsed } from './helpers/common';
import { FlatTreeHelper } from './helpers';
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io';

interface FlatTreeNodeProps {
  data: TreeNode;
  isLeaf: boolean;
  isSelected: boolean;
  isCollapsed: boolean;
  onSelect: (id: any) => void;
  onCollapse?: (id: any) => void;
  onExpand?: (id: any) => void;
}

const FlatTreeNode_: React.FC<FlatTreeNodeProps> = ({
  data,
  isLeaf,
  isSelected,
  isCollapsed,
  onSelect,
  onCollapse,
  onExpand
}) => {
  console.log('render node');
  const onClick = React.useCallback(() => {
    if (onSelect) {
      onSelect(data.id);
    }
  }, []);
  return (
    <div
      className={`valor-flat-tree-item ${
        isSelected ? 'valor-flat-tree-item-selected' : ''
      }`}
      key={data.id}
      style={{ paddingLeft: `${data.level}em` }}
      onClick={onClick}
    >
      {onExpand && !isLeaf && isCollapsed && (
        <span
          style={{
            display: 'inline-block',
            height: 28,
            width: 28,
            marginRight: 15
          }}
          onClick={() => onExpand(data.id)}
        >
          <IoMdArrowDropright />
        </span>
      )}
      {onCollapse && !isLeaf && !isCollapsed && (
        <span
          className="valor-flat-tree-item-container"
          onClick={() => onCollapse(data.id)}
        >
          <IoMdArrowDropdown />
        </span>
      )}
      {data.content}
    </div>
  );
};

const FlatTreeNode = React.memo(FlatTreeNode_);

interface FlatTreeProps {
  data: { id: any; level: number; content: string }[];
  collapsedIds: any[];
  selectedId?: any;
  onSelect: (id: any) => void;
  onCollapse?: (id: any) => void;
  onExpand?: (id: any) => void;
}
const FlatTree: React.FC<FlatTreeProps> = ({
  data,
  selectedId,
  collapsedIds,
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
        key={item.id}
        data={item}
        isSelected={selectedId === id}
        isLeaf={isLeaf(data, item.id)}
        isCollapsed={collapsedIds.includes(id)}
        onSelect={onSelect}
        onCollapse={onCollapse}
        onExpand={onExpand}
      />
    );
  });
  return <div className={'valor-flat-tree'}>{items}</div>;
};

export default FlatTree;
export { FlatTreeHelper };
