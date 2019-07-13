import { TreeNode } from '../index.interface';
import { createTreeNode } from './create';

describe('createTreeNode', () => {
  const tree1: TreeNode[] = [{ id: 1, level: 1, content: '1' }];

  it('current node is leaf', () =>
    expect(createTreeNode(tree1, { id: 100, content: '5' }, 1)).toEqual([
      { id: 1, level: 1, content: '1' },
      { id: 100, level: 1, content: '5' }
    ]));

  const tree2: TreeNode[] = [
    { id: 1, level: 1, content: '1' },
    { id: 2, level: 2, content: '1' }
  ];

  it('current node has children', () => {
    expect(createTreeNode(tree2, { id: 100, content: '5' }, 1)).toEqual([
      { id: 1, level: 1, content: '1' },
      { id: 100, level: 2, content: '5' },
      { id: 2, level: 2, content: '1' }
    ]);
  });

  it('create on empty tree', () => {
    expect(
      createTreeNode([], { id: 100, content: '5' }, undefined, {
        topLevel: 1
      })
    ).toEqual([{ id: 100, level: 1, content: '5' }]);
  });
});
