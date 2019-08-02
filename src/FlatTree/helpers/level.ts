import { min } from 'valor-app-utils';
import { TreeNode } from '../index.interface';
import { getLastDecendantIndex } from './common';

export function moveTreeNodeLeft(data: TreeNode[], id: any) {
  const minLevel = min(data.map(it => it.level));
  const currIndex = data.findIndex(it => it.id === id);
  // 第1个节点不可移动
  if (currIndex <= 0) return data;

  const currNode = data[currIndex];
  if (currNode.level === minLevel) return data;

  const lastDecendantIndex = getLastDecendantIndex(data, currIndex);

  const newCurrentNodeWithDecendants = data
    .slice(currIndex, lastDecendantIndex + 1)
    .map(it => ({
      ...it,
      level: it.level - 1
    }));

  return [
    ...data.slice(0, currIndex),
    ...newCurrentNodeWithDecendants,
    ...data.slice(lastDecendantIndex + 1)
  ];
}

export function moveTreeNodeRight(data: TreeNode[], id: any) {
  const minLevel = min(data.map(it => it.level));
  const currIndex = data.findIndex(it => it.id === id);
  // 第一个节点不能移动
  if (currIndex <= 0) return data;

  // 当前节点是上一节点的第1子节点, 不可移动
  const prevNode = currIndex >= 1 ? data[currIndex - 1] : null;
  if (prevNode && prevNode.level === data[currIndex].level - 1) {
    return data;
  }

  const maxLevel = prevNode ? prevNode.level + 1 : minLevel;
  const currNode = data[currIndex];
  if (currNode.level >= maxLevel) return data;

  const lastDecendantIndex = getLastDecendantIndex(data, currIndex);

  const newCurrentNodeWithDecendants = data
    .slice(currIndex, lastDecendantIndex + 1)
    .map(it => ({
      ...it,
      level: it.level + 1
    }));
  console.log('moveTreeNodeRight:', [
    ...data.slice(0, currIndex),
    ...newCurrentNodeWithDecendants,
    ...data.slice(lastDecendantIndex + 1)
  ]);
  return [
    ...data.slice(0, currIndex),
    ...newCurrentNodeWithDecendants,
    ...data.slice(lastDecendantIndex + 1)
  ];
}
