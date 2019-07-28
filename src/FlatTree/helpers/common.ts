import * as R from 'rambda';
import { TreeNode } from '../index.interface';
import { findIndexFrom } from 'valor-app-utils';

export function isLeaf(data: TreeNode[], id: any) {
  const idx = data.findIndex(node => node.id === id);
  return idx >= data.length - 1 || data[idx].level >= data[idx + 1].level;
}

// 获取currIndex对应的节点的最后一个子(孙)节点的index
export function getLastDecendantIndex(data: TreeNode[], currIndex: number) {
  const currNode = data[currIndex];
  const nextNodeIndex = findIndexFrom(
    data,
    currIndex + 1,
    it => it.level <= currNode.level
  );
  const lastDecendantIndex =
    nextNodeIndex < 0 ? data.length - 1 : nextNodeIndex - 1;
  return lastDecendantIndex;
}

export function getNextNode(
  data: TreeNode[],
  currId: any,
  options?: { excludeDecendants?: boolean }
) {
  const currIndex = data.findIndex(node => node.id === currId);
  if (options && options.excludeDecendants) {
    const lastDecendantIndex = getLastDecendantIndex(data, currIndex);
    return lastDecendantIndex < data.length - 1
      ? data[lastDecendantIndex + 1]
      : undefined;
  } else {
    return currIndex >= 0 && currIndex < data.length - 1
      ? data[currIndex + 1]
      : undefined;
  }
}
export function getHiddenIdsForCollapsed(
  data: TreeNode[],
  collapsedIds: any[]
) {
  const allIds = collapsedIds.map(collapsedId => {
    const currIndex = data.findIndex(node => node.id === collapsedId);
    const lastDecendantIndex = getLastDecendantIndex(data, currIndex);

    return data
      .slice(currIndex + 1, lastDecendantIndex + 1)
      .map(node => node.id);
  });
  return R.flatten(allIds);
}
