import {
  array2idTree_byLevel,
  swapByProp,
  TreeNode as NTreeNode,
  idTree2Array,
  findTreeNode
} from 'app-utils';
import { TreeNode } from '../index.interface';
import { getLastDecendantIndex, isLeaf } from './common';

export function moveTreeNodeUp(tree: NTreeNode, id: any) {
  let needMoveToParentBrother = false;

  function _moveUp(children: NTreeNode[], id: any): NTreeNode[] {
    const index = children.findIndex(node => node.id === id);
    if (index < 0) {
      return children.map(node => ({
        ...node,
        children: _moveUp(node.children, id)
      }));
    } else if (index > 0) {
      const prevNode = children[index - 1];
      return swapByProp(children, 'id', id, prevNode.id);
    } else {
      needMoveToParentBrother = true;
      return children;
    }
  }

  let newTree = { ...tree, children: _moveUp(tree.children, id) };
  return needMoveToParentBrother
    ? moveToParentPrevBrotherEffect(newTree, id)
    : newTree;
}

export function moveTreeNodeDown(tree: NTreeNode, id: any) {
  let needMoveToParentBrother = false;

  function _moveDown(children: NTreeNode[], id: any): NTreeNode[] {
    const index = children.findIndex(node => node.id === id);
    if (index < 0) {
      return children.map(node => ({
        ...node,
        children: _moveDown(node.children, id)
      }));
    } else if (index < children.length - 1) {
      const nextNode = children[index + 1];
      return swapByProp(children, 'id', id, nextNode.id);
    } else {
      needMoveToParentBrother = true;
      return children;
    }
  }
  let newTree = { ...tree, children: _moveDown(tree.children, id) };
  return needMoveToParentBrother
    ? moveToParentNextBrotherEffect(newTree, id)
    : newTree;
}

// 接收数组, 返回数组(用level表示层级)
export function moveTreeNodeUp_array(data: TreeNode[], id: any) {
  const tree = array2idTree_byLevel(data);
  const newTree = moveTreeNodeUp(tree, id);
  return idTree2Array(newTree);
}

// 接收数组, 返回数组(level表示层级)
export function moveTreeNodeDown_array(data: TreeNode[], id: any) {
  const tree = array2idTree_byLevel(data);
  const newTree = moveTreeNodeDown(tree, id);
  return idTree2Array(newTree);
}

// 注意: 这是一个副作用方法!!! 它修改了newTree
function moveToParentNextBrotherEffect(newTree: NTreeNode, id: any) {
  const node = findTreeNode(newTree, node => node.id === id);
  const pNode = findTreeNode(newTree, ({ id }) => id === node!.pid);
  const nodeIndex = pNode
    ? pNode.children.findIndex(n => n.id === node!.id)
    : -1;
  const ppNode = pNode && findTreeNode(newTree, node => node.id === pNode.pid);
  const pIndex =
    pNode && ppNode
      ? ppNode.children.findIndex(node => node.id === pNode.id)
      : -1;
  const pBrotherNode =
    pNode && ppNode && pIndex < ppNode.children.length - 1
      ? ppNode.children[pIndex + 1]
      : null;
  if (pBrotherNode) {
    pBrotherNode.children = [node!, ...pBrotherNode!.children];
    pNode && pNode.children.splice(nodeIndex, 1);
  }
  return newTree;
}

// 注意: 这是一个副作用方法!!! 它修改了newTree
function moveToParentPrevBrotherEffect(newTree: NTreeNode, id: any) {
  const node = findTreeNode(newTree, node => node.id === id);
  const pNode = findTreeNode(newTree, ({ id }) => id === node!.pid);
  const nodeIndex = pNode
    ? pNode.children.findIndex(n => n.id === node!.id)
    : -1;
  const ppNode = pNode && findTreeNode(newTree, node => node.id === pNode.pid);
  const pIndex =
    pNode && ppNode
      ? ppNode.children.findIndex(node => node.id === pNode.id)
      : -1;
  const pBrotherNode =
    pNode && ppNode && pIndex > 0 ? ppNode.children[pIndex - 1] : null;
  if (pBrotherNode) {
    pBrotherNode.children = [...pBrotherNode!.children, node!];
    pNode && pNode.children.splice(nodeIndex, 1);
  }
  return newTree;
}
// 移动后, level与上个节点同级
// span: 跨多少节点
// 非常特殊
export function moveTreeNodeUpOneStep(
  data: TreeNode[],
  id: any,
  span: number = 1
) {
  const currIndex = data.findIndex(it => it.id === id);
  if (currIndex <= 0 || currIndex > data.length - 1) return data;
  const currNode = data[currIndex];

  const lastDecendantIndex = getLastDecendantIndex(data, currIndex);

  const prevNode = data[currIndex - span];
  const newCurrentNodeWithDecendants = data
    .slice(currIndex, lastDecendantIndex + 1)
    .map(it => ({
      ...it,
      level: it.level - (currNode.level - prevNode.level)
    }));

  return [
    ...data.slice(0, currIndex - span < 0 ? 0 : currIndex - span),
    ...newCurrentNodeWithDecendants,
    ...data.slice(currIndex - span, currIndex),
    ...data.slice(lastDecendantIndex + 1)
  ];
}

// 移动后, level默认移动到nextNode之后
// 如果nextNode.isLeaf => level=nextNode.level
// 否则level=nextNode.level + 1 ( 作为下个节点的第1个子节点 )
export function moveTreeNodeDownOneStep(
  data: TreeNode[],
  id: any,
  span: number = 1
) {
  const currIndex = data.findIndex(it => it.id === id);
  if (currIndex < 0 || currIndex >= data.length - 1) return data;

  const currNode = data[currIndex];

  // 当前节点的子孙节点是最后一个节点, 不可移动
  const lastDecendantIndex = getLastDecendantIndex(data, currIndex);

  if (lastDecendantIndex === data.length - 1) return data;

  const nextNode = data[lastDecendantIndex + span];
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
    ...data.slice(lastDecendantIndex + 1, lastDecendantIndex + span + 1),
    ...newCurrentNodeWithDecendants,
    ...data.slice(lastDecendantIndex + span + 1)
  ];
}
