export interface TreeNode {
  id: any;
  level: number;
  content: string;
  containable?: boolean;
  [k: string]: any;
}
