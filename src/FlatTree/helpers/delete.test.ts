import { TreeNode } from '../index.interface';
import { deleteTreeNode } from './delete';

describe('deleteTreeNode', () => {
  const tree1: TreeNode[] = [];
  it('empty tree', () =>
    expect(deleteTreeNode(tree1, undefined)).toEqual(tree1));

  const tree2: TreeNode[] = [{ id: 1, content: '1', level: 1 }];
  it('tree has one child', () => expect(deleteTreeNode(tree2, 1)).toEqual([]));

  const tree3: TreeNode[] = [
    { id: 1, content: '1', level: 1 },
    { id: 2, content: '1', level: 2 },
    { id: 3, content: '1', level: 1 }
  ];
  it('delete node with children', () =>
    expect(deleteTreeNode(tree3, 1)).toEqual([
      { id: 3, content: '1', level: 1 }
    ]));
});
