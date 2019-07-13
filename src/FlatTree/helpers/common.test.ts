import { TreeNode } from '../index.interface';
import { isLeaf, getNextNode, getHiddenIdsForCollapsed } from './common';

describe('is-leaf', () => {
  const tree4: TreeNode[] = [
    { id: 1, level: 1, content: '1' },
    { id: 2, level: 2, content: '1' },
    { id: 4, level: 3, content: '1' },
    { id: 5, level: 1, content: '1' }
  ];
  it('1', () => expect(isLeaf(tree4, 1)).toBeFalsy());
  it('2', () => expect(isLeaf(tree4, 2)).toBeFalsy());
  it('3', () => expect(isLeaf(tree4, 4)).toBeTruthy());
  it('5', () => expect(isLeaf(tree4, 5)).toBeTruthy());
});

describe('getNextNode', () => {
  const tree4: TreeNode[] = [
    { id: 1, level: 1, content: '1' },
    { id: 2, level: 2, content: '1' },
    { id: 3, level: 1, content: '1' }
  ];

  it('1', () => expect(getNextNode(tree4, 1)!.id).toEqual(2));
  it('2', () => expect(getNextNode(tree4, 2)!.id).toEqual(3));
  it('3', () => expect(getNextNode(tree4, 3)).toEqual(undefined));
  it('1-with-decendants', () =>
    expect(getNextNode(tree4, 1, { excludeDecendants: true })!.id).toEqual(3));
});

describe('getHiddenIdsForCollapsed', () => {
  const tree4: TreeNode[] = [{ id: 1, level: 1, content: '1' }];
  it('没有child的节点, collapse没有意义', () =>
    expect(getHiddenIdsForCollapsed(tree4, [1])).toEqual([]));

  const tree5: TreeNode[] = [
    { id: 1, level: 1, content: '1' },
    { id: 2, level: 2, content: '1' }
  ];
  it('将隐藏child节点2', () =>
    expect(getHiddenIdsForCollapsed(tree5, [1])).toEqual([2]));

  const tree6: TreeNode[] = [
    { id: 1, level: 1, content: '1' },
    { id: 2, level: 2, content: '1' },
    { id: 3, level: 3, content: '1' }
  ];
  it('将隐藏decendants节点 2, 3', () =>
    expect(getHiddenIdsForCollapsed(tree6, [1])).toEqual([2, 3]));

  const tree7: TreeNode[] = [
    { id: 1, level: 1, content: '1' },
    { id: 2, level: 2, content: '1' },
    { id: 3, level: 3, content: '1' },
    { id: 8, level: 2, content: '1' },
    { id: 4, level: 1, content: '1' },
    { id: 5, level: 2, content: '1' }
  ];
  it('将隐藏decendants节点 2, 3, 5', () =>
    expect(getHiddenIdsForCollapsed(tree7, [1, 4])).toEqual([2, 3, 8, 5]));
});
