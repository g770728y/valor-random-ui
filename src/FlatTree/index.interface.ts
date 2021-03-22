import * as React from "react";

export type TreeNode = {
  id: any;
  level: number;
  content:
    | React.Component<Omit<TreeNode, "content">>
    | React.FC<Omit<TreeNode, "content">>
    | string;
  readonly?: boolean;
  [k: string]: any;
};
