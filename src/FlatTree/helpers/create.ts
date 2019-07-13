import { TreeNode } from '../index.interface';
import { isLeaf } from './common';

// 在当前selectedId对应的node下方创建新节点:
// 当nextNode.isLeaf, 则创建同级节点
// 否则, 创建为 nextNode.firstNode
export function createTreeNode(
  data: TreeNode[],
  nodeData: Partial<TreeNode>,
  selectedId: any,
  options?: { topLevel: number }
): TreeNode[] {
  if (data.length === 0) {
    return [
      {
        ...nodeData,
        level: options && options.topLevel ? options.topLevel : 1
      } as TreeNode
    ];
  }
  const selectedIndex = data.findIndex(node => node.id === selectedId);
  const selectedNode = data[selectedIndex];
  const isLeafNode = isLeaf(data, selectedId);
  const newNode = isLeafNode
    ? { ...nodeData, level: selectedNode.level }
    : { ...nodeData, level: selectedNode.level + 1 };
  return [
    ...data.slice(0, selectedIndex + 1),
    newNode as TreeNode,
    ...data.slice(selectedIndex + 1)
  ];
}
