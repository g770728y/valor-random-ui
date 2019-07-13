import { TreeNode } from '../index.interface';
import { getLastDecendantIndex } from './common';

export function deleteTreeNode(data: TreeNode[], selectedId: any) {
  if (data.length === 0 || selectedId === undefined || selectedId === null) {
    return data;
  }

  const selectedIndex = data.findIndex(node => node.id === selectedId);
  console.log('selectedIndex', selectedIndex, selectedId);
  const lastDecendantIndex = getLastDecendantIndex(data, selectedIndex);
  return [
    ...data.slice(0, selectedIndex),
    ...data.slice(lastDecendantIndex + 1)
  ];
}
