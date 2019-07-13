import { TreeNode } from '../index.interface';
import { moveTreeNodeUp, moveTreeNodeDown } from './move';

describe('onTreeNodeUp', () => {
  const tree1: TreeNode[] = [
    { id: 1, level: 1, content: '1' },
    { id: 2, level: 2, content: '2' }
  ];

  it('首节点无法上移', () => expect(moveTreeNodeUp(tree1, 1)).toEqual(tree1));

  it('第2个节点可上移', () =>
    expect(moveTreeNodeUp(tree1, 2)).toEqual([
      { id: 2, level: 1, content: '2' },
      { id: 1, level: 1, content: '1' }
    ]));

  const treeWithChidren: TreeNode[] = [
    { id: 1, level: 1, content: '1' },
    { id: 2, level: 2, content: '2' },
    { id: 3, level: 3, content: '3' },
    { id: 4, level: 4, content: '4' },
    { id: 5, level: 2, content: '5' }
  ];

  it('节点上移时, 会带上decendants, 并且level=prevNode.level', () =>
    expect(moveTreeNodeUp(treeWithChidren, 2)).toEqual([
      { id: 2, level: 1, content: '2' },
      { id: 3, level: 2, content: '3' },
      { id: 4, level: 3, content: '4' },
      { id: 1, level: 1, content: '1' },
      { id: 5, level: 2, content: '5' }
    ]));
});

describe('onTreeNodeDown', () => {
  const tree1: TreeNode[] = [
    { id: 1, level: 1, content: '1' },
    { id: 2, level: 2, content: '2' }
  ];

  it('末节点不可下移', () => expect(moveTreeNodeDown(tree1, 2)).toEqual(tree1));

  const tree2: TreeNode[] = [
    { id: 1, level: 1, content: '1' },
    { id: 2, level: 1, content: '1' }
  ];
  it('非末节点可下移', () =>
    expect(moveTreeNodeDown(tree2, 1)).toEqual([
      { id: 2, level: 1, content: '1' },
      { id: 1, level: 1, content: '1' }
    ]));

  const tree3: TreeNode[] = [
    { id: 1, level: 1, content: '1' },
    { id: 2, level: 2, content: '1' },
    { id: 3, level: 3, content: '1' },
    { id: 4, level: 1, content: '1' },
    { id: 5, level: 2, content: '1' }
  ];
  it('节点可下移, 但会带子节点整体移动. 移动后成为nextNode的第1个子节点', () =>
    expect(moveTreeNodeDown(tree3, 1)).toEqual([
      { id: 4, level: 1, content: '1' },
      { id: 1, level: 2, content: '1' },
      { id: 2, level: 3, content: '1' },
      { id: 3, level: 4, content: '1' },
      { id: 5, level: 2, content: '1' }
    ]));

  const tree4: TreeNode[] = [
    { id: 1, level: 1, content: '1' },
    { id: 2, level: 2, content: '1' },
    { id: 4, level: 1, content: '1' },
    { id: 5, level: 1, content: '1' }
  ];
  it('节点可下移, 由于id=4节点isLeaf, 所以移动后level=node4.level', () =>
    expect(moveTreeNodeDown(tree4, 1)).toEqual([
      { id: 4, level: 1, content: '1' },
      { id: 1, level: 1, content: '1' },
      { id: 2, level: 2, content: '1' },
      { id: 5, level: 1, content: '1' }
    ]));
});
