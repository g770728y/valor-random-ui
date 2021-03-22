import * as React from "react";
import { storiesOf } from "@storybook/react";
import FlatTree from ".";
import { TreeNode } from "./index.interface";
import { nextArrayId, reAppend } from "valor-app-utils";

const Content: React.FC = (data: any) => {
  console.log("data", data.id, data.level);
  return <span style={{ fontSize: 20 }}>11</span>;
};

const tree: TreeNode[] = [
  { id: 1, level: 1, content: Content },
  { id: 2, level: 2, content: "2" },
  { id: 3, level: 2, content: "3" },
  { id: 4, level: 3, content: "4" },
  { id: 5, level: 4, content: "5" },
  { id: 6, level: 2, content: "6" },
  { id: 7, level: 1, content: "7" },
  { id: 8, level: 2, content: "8" },
  { id: 9, level: 1, content: "9" }
];

const Action: React.FC<{ id: any }> = ({ id }) => {
  const [i, setI] = React.useState(0);
  return (
    <button onClick={() => setI(i + 1)}>
      {i}:{id}
    </button>
  );
};

const DefaultTree: React.FC = () => {
  const [selectedId, onSelect] = React.useState<number | null>(null);
  const [data, setData] = React.useState(tree);
  const [collapsedIds, setCollapsedIds] = React.useState<number[]>([]);

  const onCollapse = () => {
    if (selectedId) {
      setCollapsedIds(reAppend<number>(collapsedIds, selectedId));
    }
  };

  const onExpand = () => {
    if (selectedId) {
      setCollapsedIds(collapsedIds.filter(id => selectedId !== id));
    }
  };

  return (
    <div>
      <div>
        <button onClick={onExpand}>展开</button>
        <button onClick={onCollapse}>收合</button>
      </div>
      <FlatTree
        ActionComponent={Action}
        data={data}
        selectedId={selectedId}
        onSelect={onSelect}
        collapsedIds={collapsedIds}
      />
    </div>
  );
};

storiesOf("FlatTree", module).add("default", () => <DefaultTree />);
