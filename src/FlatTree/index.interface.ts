export interface TreeNode {
  id: any;
  level: number;
  content: string;
  readonly?: boolean;
  [k: string]: any;
}
