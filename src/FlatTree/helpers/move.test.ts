import { TreeNode } from '../index.interface';
import {
  moveTreeNodeUpOneStep,
  moveTreeNodeDownOneStep,
  moveTreeNodeUp,
  moveTreeNodeDown
} from './move';

describe('onTreeNodeUp', () => {
  const tree1: TreeNode[] = [
    { id: 1, level: 1, content: '1' },
    { id: 2, level: 2, content: '2' }
  ];

  it('同级内的第一个节点不可上移', () =>
    expect(moveTreeNodeUp(tree1, 1)).toEqual(tree1));

  it('index=0的子节点无法上移', () =>
    expect(moveTreeNodeUp(tree1, 2)).toEqual(tree1));

  const tree2: TreeNode[] = [
    { id: 1, level: 1, content: '1' },
    { id: 2, level: 2, content: '2' },
    { id: 3, level: 2, content: '2' }
  ];
  it('index>0的子节点可以上移', () =>
    expect(moveTreeNodeUp(tree2, 3)).toEqual([
      { id: 1, level: 1, content: '1' },
      { id: 3, level: 2, content: '2' },
      { id: 2, level: 2, content: '2' }
    ]));

  const tree3: TreeNode[] = [
    { id: 1, level: 1, content: '1' },
    { id: 2, level: 2, content: '2' },
    { id: 4, level: 3, content: '2' },
    { id: 3, level: 2, content: '2' }
  ];

  it('子节点上移时,会跳过上面兄弟节点的子孙节点', () =>
    expect(moveTreeNodeUp(tree3, 3)).toEqual([
      { id: 1, level: 1, content: '1' },
      { id: 3, level: 2, content: '2' },
      { id: 2, level: 2, content: '2' },
      { id: 4, level: 3, content: '2' }
    ]));

  const tree4: TreeNode[] = [
    { id: 1, level: 1, content: '1' },
    { id: 2, level: 2, content: '2' },
    { id: 3, level: 2, content: '2' },
    { id: 4, level: 3, content: '2' }
  ];

  it('子节点上移时, 会带上自己的子孙节点', () =>
    expect(moveTreeNodeUp(tree4, 3)).toEqual([
      { id: 1, level: 1, content: '1' },
      { id: 3, level: 2, content: '2' },
      { id: 4, level: 3, content: '2' },
      { id: 2, level: 2, content: '2' }
    ]));

  const tree5: TreeNode[] = [
    { id: 1, level: 1, content: '1' },
    { id: 2, level: 2, content: '2' },
    { id: 3, level: 1, content: '2' },
    { id: 4, level: 2, content: '2' }
  ];
  it('当前节点是父节点的第一个节点, 将上移到父的兄节点内', () => {
    expect(moveTreeNodeUp(tree5, 4)).toEqual([
      { id: 1, level: 1, content: '1' },
      { id: 2, level: 2, content: '2' },
      { id: 4, level: 2, content: '2' },
      { id: 3, level: 1, content: '2' }
    ]);
  });
});

describe('onTreeNodeDown', () => {
  const tree1: TreeNode[] = [
    { id: 1, level: 1, content: '10' },
    { id: 2, level: 2, content: '20' }
  ];

  it('index=同级length-1的节点(最后一个)不可下移', () =>
    expect(moveTreeNodeDown(tree1, 1)).toEqual(tree1));

  const tree2: TreeNode[] = [
    { id: 1, level: 1, content: '1' },
    { id: 2, level: 2, content: '2' },
    { id: 3, level: 2, content: '2' }
  ];
  it('index<同级length-1的子节点可以下移', () =>
    expect(moveTreeNodeDown(tree2, 2)).toEqual([
      { id: 1, level: 1, content: '1' },
      { id: 3, level: 2, content: '2' },
      { id: 2, level: 2, content: '2' }
    ]));

  const tree4: TreeNode[] = [
    { id: 1, level: 1, content: '1' },
    { id: 2, level: 2, content: '2' },
    { id: 4, level: 3, content: '2' },
    { id: 3, level: 2, content: '2' }
  ];

  it('子节点下移时, 会带上自己的子孙节点', () =>
    expect(moveTreeNodeDown(tree4, 2)).toEqual([
      { id: 1, level: 1, content: '1' },
      { id: 3, level: 2, content: '2' },
      { id: 2, level: 2, content: '2' },
      { id: 4, level: 3, content: '2' }
    ]));

  const tree5: TreeNode[] = [
    { id: 1, level: 1, content: '1' },
    { id: 2, level: 2, content: '2' },
    { id: 3, level: 1, content: '2' },
    { id: 4, level: 2, content: '2' }
  ];
  it('当前节点是父节点的末节点, 将下移到父的兄节点内', () => {
    expect(moveTreeNodeDown(tree5, 2)).toEqual([
      { id: 1, level: 1, content: '1' },
      { id: 3, level: 1, content: '2' },
      { id: 2, level: 2, content: '2' },
      { id: 4, level: 2, content: '2' }
    ]);
  });
});

describe('onTreeNodeUpOneStep', () => {
  const tree1: TreeNode[] = [
    { id: 1, level: 1, content: '1' },
    { id: 2, level: 2, content: '2' }
  ];

  it('首节点无法上移', () =>
    expect(moveTreeNodeUpOneStep(tree1, 1)).toEqual(tree1));

  it('第2个节点可上移', () =>
    expect(moveTreeNodeUpOneStep(tree1, 2)).toEqual([
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
    expect(moveTreeNodeUpOneStep(treeWithChidren, 2)).toEqual([
      { id: 2, level: 1, content: '2' },
      { id: 3, level: 2, content: '3' },
      { id: 4, level: 3, content: '4' },
      { id: 1, level: 1, content: '1' },
      { id: 5, level: 2, content: '5' }
    ]));

  const tree2: TreeNode[] = [
    { id: 1, level: 1, content: '1' },
    { id: 2, level: 2, content: '2' },
    { id: 3, level: 2, content: '3' }
  ];

  it('跨2个节点移动', () => {
    expect(moveTreeNodeUpOneStep(tree2, 3, 2)).toEqual([
      { id: 3, level: 1, content: '3' },
      { id: 1, level: 1, content: '1' },
      { id: 2, level: 2, content: '2' }
    ]);
  });
});

describe('onTreeNodeDownOneStep', () => {
  const tree1: TreeNode[] = [
    { id: 1, level: 1, content: '1' },
    { id: 2, level: 2, content: '2' }
  ];

  it('末节点不可下移', () =>
    expect(moveTreeNodeDownOneStep(tree1, 2)).toEqual(tree1));

  const tree2: TreeNode[] = [
    { id: 1, level: 1, content: '1' },
    { id: 2, level: 1, content: '1' }
  ];
  it('非末节点可下移', () =>
    expect(moveTreeNodeDownOneStep(tree2, 1)).toEqual([
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
    expect(moveTreeNodeDownOneStep(tree3, 1)).toEqual([
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
    expect(moveTreeNodeDownOneStep(tree4, 1)).toEqual([
      { id: 4, level: 1, content: '1' },
      { id: 1, level: 1, content: '1' },
      { id: 2, level: 2, content: '1' },
      { id: 5, level: 1, content: '1' }
    ]));

  const tree5: TreeNode[] = [
    { id: 1, level: 1, content: '1' },
    { id: 2, level: 1, content: '2' },
    { id: 3, level: 1, content: '3' }
  ];

  it('节点下移, 跨越2个节点', () =>
    expect(moveTreeNodeDownOneStep(tree5, 1, 2)).toEqual([
      { id: 2, level: 1, content: '2' },
      { id: 3, level: 1, content: '3' },
      { id: 1, level: 1, content: '1' }
    ]));
});
