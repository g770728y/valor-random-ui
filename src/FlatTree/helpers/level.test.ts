import { TreeNode } from '../index.interface';
import { moveTreeNodeLeft, moveTreeNodeRight } from './level';

describe('onTreeNodeLeft', () => {
  const tree1: TreeNode[] = [
    { id: 1, level: 1, content: '1' },
    { id: 2, level: 2, content: '1' }
  ];

  it('top node can not move left', () => {
    expect(moveTreeNodeLeft(tree1, 1)).toEqual(tree1);
  });

  it('child node can move left ( without decendants )', () =>
    expect(moveTreeNodeLeft(tree1, 2)).toEqual([
      { id: 1, level: 1, content: '1' },
      { id: 2, level: 1, content: '1' }
    ]));

  const tree2: TreeNode[] = [
    { id: 1, level: 1, content: '1' },
    { id: 2, level: 2, content: '1' },
    { id: 3, level: 3, content: '1' },
    { id: 4, level: 4, content: '1' },
    { id: 5, level: 2, content: '1' }
  ];

  it('child node can move left ( with decendants )', () =>
    expect(moveTreeNodeLeft(tree2, 2)).toEqual([
      { id: 1, level: 1, content: '1' },
      { id: 2, level: 1, content: '1' },
      { id: 3, level: 2, content: '1' },
      { id: 4, level: 3, content: '1' },
      { id: 5, level: 2, content: '1' }
    ]));
});

describe('onTreeNodeRight', () => {
  const tree1: TreeNode[] = [
    { id: 1, level: 1, content: '1' },
    { id: 2, level: 1, content: '1' }
  ];

  it('first node can not move right', () => {
    expect(moveTreeNodeRight(tree1, 1)).toEqual(tree1);
  });

  it('top node can move right ( without decendants )', () =>
    expect(moveTreeNodeRight(tree1, 2)).toEqual([
      { id: 1, level: 1, content: '1' },
      { id: 2, level: 2, content: '1' }
    ]));

  const tree2: TreeNode[] = [
    { id: 1, level: 1, content: '1' },
    { id: 2, level: 1, content: '1' },
    { id: 3, level: 2, content: '1' },
    { id: 4, level: 3, content: '1' },
    { id: 5, level: 2, content: '1' }
  ];
  const tree2_1 = [
    { id: 1, level: 1, content: '1' },
    { id: 2, level: 2, content: '1' },
    { id: 3, level: 3, content: '1' },
    { id: 4, level: 4, content: '1' },
    { id: 5, level: 3, content: '1' }
  ];
  it('top node can move right ( with decendants )', () =>
    expect(moveTreeNodeRight(tree2, 2)).toEqual(tree2_1));

  it('节点不能移出prevNode范围:', () => {
    expect(moveTreeNodeRight(tree2_1, 2)).toEqual(tree2_1);
  });
});
