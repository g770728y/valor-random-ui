import * as React from 'react';
import './index.css';
import { TreeNode } from './index.interface';
import { isLeaf, getHiddenIdsForCollapsed } from './helpers/common';
import { FlatTreeHelper } from './helpers';
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io';
import { Center } from '../layout';
import * as R from 'rambda';

type FlatTreeNodeProps = {
  data: TreeNode;
  isLeaf: boolean;
  isSelected: boolean;
  isCollapsed: boolean;
  onSelect: (id: any) => void;
  onCollapse?: (id: any) => void;
  onExpand?: (id: any) => void;
} & React.HTMLAttributes<HTMLElement>;

const FlatTreeNode_: React.FC<FlatTreeNodeProps> = _props => {
  const {
    data,
    isLeaf,
    isSelected,
    isCollapsed,
    onSelect,
    onCollapse,
    onExpand
  } = _props;
  console.log('render node');
  const onClick = React.useCallback(() => {
    if (onSelect) {
      onSelect(data.id);
    }
  }, []);
  const props = {
    style: {
      position: 'absolute',
      left: `${data.level - 1}em`,
      cursor: 'pointer'
    } as React.CSSProperties,
    width: 16,
    height: '100%',
    inline: true
  };
  return (
    <div
      className={`valor-flat-tree-item ${
        isSelected ? 'valor-flat-tree-item-selected' : ''
      }`}
      key={data.id}
      style={{
        position: 'relative',
        cursor: 'pointer',
        paddingLeft: `${data.level + 0.3}em`
      }}
      onClick={onClick}
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
      {data.content}
    </div>
  );
};

function compareFn(prevProps: FlatTreeNodeProps, nextProps: FlatTreeNodeProps) {
  const p = R.pick(['data', 'isLeaf', 'isSelected', 'isCollapsed']);
  return R.equals(p(prevProps), p(nextProps));
}

const FlatTreeNode = React.memo(FlatTreeNode_, compareFn);

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
