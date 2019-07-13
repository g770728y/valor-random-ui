import * as React from 'react';
import './index.css';
import { TreeNode } from './index.interface';
import { isLeaf, getHiddenIdsForCollapsed } from './helpers/common';

interface FlatTreeNodeProps {
  data: TreeNode;
  isLeaf: boolean;
  isSelected: boolean;
  onSelect: (id: any) => void;
}

const FlatTreeNode_: React.FC<FlatTreeNodeProps> = ({
  data,
  isLeaf,
  isSelected,
  onSelect
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
      {data.content + `${isLeaf ? 'leaf' : ''}`}
    </div>
  );
};

const FlatTreeNode = React.memo(FlatTreeNode_);

interface FlatTreeProps {
  data: { id: any; level: number; content: string }[];
  collapsedIds: any[];
  selectedId?: any;
  onSelect: (id: any) => void;
}
const FlatTree: React.FC<FlatTreeProps> = ({
  data,
  selectedId,
  collapsedIds,
  onSelect
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
        onSelect={onSelect}
        isLeaf={isLeaf(data, item.id)}
      />
    );
  });
  return <div className={'valor-flat-tree'}>{items}</div>;
};

export default FlatTree;
