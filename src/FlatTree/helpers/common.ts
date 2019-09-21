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

export function getHiddenIdsForCollapsed(
  data: TreeNode[],
  collapsedIds: any[]
) {
  const allIds = collapsedIds.map(collapsedId => {
    const currIndex = data.findIndex(node => node.id === collapsedId);
    if (currIndex < 0) {
      // 如果节点是:[a [a1 [a11 [a111]]]], 并且a11折叠, 则collapsedIds.includes('a11')
      // 但如果删除 a1, 则a11在data中不存在, 但collapsedIds中仍存在, 则会引发空指针异常
      // 具体报错为: cannot read property 'level' of undefined
      return [];
    } else {
      const lastDecendantIndex = getLastDecendantIndex(data, currIndex);

      return data
        .slice(currIndex + 1, lastDecendantIndex + 1)
        .map(node => node.id);
    }
  });
  return R.flatten(allIds);
}
