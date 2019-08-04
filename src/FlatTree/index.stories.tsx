import * as React from 'react';
import { storiesOf } from '@storybook/react';
import FlatTree from '.';
import { TreeNode } from './index.interface';
import { nextArrayId, reAppend } from 'valor-app-utils';

const tree: TreeNode[] = [
  { id: 1, level: 1, content: '1' },
  { id: 2, level: 2, content: '2' },
  { id: 3, level: 2, content: '3' },
  { id: 4, level: 3, content: '4' },
  { id: 5, level: 4, content: '5' },
  { id: 6, level: 2, content: '6' },
  { id: 7, level: 1, content: '7' },
  { id: 8, level: 2, content: '8' },
  { id: 9, level: 1, content: '9' }
];

const DefaultTree: React.FC = () => {
  const [selectedId, onSelect] = React.useState<number | null>(null);
  const [data, setData] = React.useState(tree);
  const [collapsedIds, setCollapsedIds] = React.useState<number[]>([]);
  // const onUp = () => {
  //   setData(moveTreeNodeUp_array(data, selectedId) as any);
  // };
  // const onDown = () => {
  //   setData(moveTreeNodeDown_array(data, selectedId) as any);
  // };
  // const onLeft = () => {
  //   setData(moveTreeNodeLeft(data, selectedId));
  // };
  // const onRight = () => {
  //   setData(moveTreeNodeRight(data, selectedId));
  // };
  // const onDelete = () => {
  //   if (selectedId && collapsedIds.includes(selectedId)) {
  //     setCollapsedIds(collapsedIds.filter(id => id !== selectedId));
  //   }
  //   const nextNode = getNextNode(data, selectedId, { excludeDecendants: true });
  //   setData(deleteTreeNode(data, selectedId));
  //   onSelect(nextNode && nextNode.id);
  // };
  // const onInsert = () => {
  //   const id = nextArrayId(data);
  //   setData(
  //     createTreeNode(data, { id, content: id + '_content' }, selectedId, {
  //       topLevel: 1
  //     })
  //   );
  // };
  const onCollapse = () => {
    if (selectedId) {
      setCollapsedIds(reAppend<number>(collapsedIds, selectedId));
    }
  };

  const onExpand = () => {
    if (selectedId) {
      setCollapsedIds(collapsedIds.filter(id => selectedId !== id));
    }
  };

  return (
    <div>
      <div>
        {/* <button onClick={onUp}>向上</button>
        <button onClick={onDown}>向下</button>
        <button onClick={onLeft}>向左</button>
        <button onClick={onRight}>向右</button>
        <button onClick={onDelete}>删除</button>
        <button onClick={onInsert}>插入</button> */}
        <button onClick={onExpand}>展开</button>
        <button onClick={onCollapse}>收合</button>
      </div>
      <FlatTree
        data={data}
        selectedId={selectedId}
        onSelect={onSelect}
        collapsedIds={collapsedIds}
      />
    </div>
  );
};

storiesOf('FlatTree', module).add('default', () => <DefaultTree />);
