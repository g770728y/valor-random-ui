import { findIndexFrom, min } from 'app-utils';
import { TreeNode } from '../index.interface';
import { getLastDecendantIndex, isLeaf } from './common';

// 移动后, level与上个节点同级
export function moveTreeNodeUp(data: TreeNode[], id: any) {
  const currIndex = data.findIndex(it => it.id === id);
  if (currIndex <= 0 || currIndex > data.length - 1) return data;
  const currNode = data[currIndex];

  // 下一个与curr平级或更高级的node
  const lastDecendantIndex = getLastDecendantIndex(data, currIndex);

  const prevNode = data[currIndex - 1];
  const newCurrentNodeWithDecendants = data
    .slice(currIndex, lastDecendantIndex + 1)
    .map(it => ({
      ...it,
      level: it.level - (currNode.level - prevNode.level)
    }));

  return [
    ...data.slice(0, currIndex - 1 < 0 ? 0 : currIndex - 1),
    ...newCurrentNodeWithDecendants,
    prevNode,
    ...data.slice(lastDecendantIndex + 1)
  ];
}

// 移动后, level默认移动到nextNode之后
// 如果nextNode.isLeaf => level=nextNode.level
// 否则level=nextNode.level + 1 ( 作为下个节点的第1个子节点 )
export function moveTreeNodeDown(data: TreeNode[], id: any) {
  const currIndex = data.findIndex(it => it.id === id);
  if (currIndex < 0 || currIndex >= data.length - 1) return data;
  const currNode = data[currIndex];

  const lastDecendantIndex = getLastDecendantIndex(data, currIndex);

  if (lastDecendantIndex === data.length - 1) return data;

  const nextNode = data[lastDecendantIndex + 1];
  const nextNodeIsLeaf = isLeaf(data, nextNode.id);

  const newCurrentNodeWithDecendants = data
    .slice(currIndex, lastDecendantIndex + 1)
    .map(it => ({
      ...it,
      level: nextNodeIsLeaf
        ? it.level - (currNode.level - nextNode.level)
        : it.level - (currNode.level - nextNode.level) + 1
    }));

  return [
    ...data.slice(0, currIndex),
    nextNode,
    ...newCurrentNodeWithDecendants,
    ...data.slice(lastDecendantIndex + 1 + 1)
  ];
}
