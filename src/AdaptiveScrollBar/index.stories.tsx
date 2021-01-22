import * as React from "react";
import { storiesOf } from "@storybook/react";
import ScrollBar from ".";

const VScrollBarTest = () => {
  const [scroll, setScroll] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    ref.current!.scrollTop = scroll;
  }, [scroll]);

  return (
    <div
      style={{
        background: "#ccc",
        width: 500,
        height: 500,
        overflow: "hidden",
        position: "relative"
      }}
    >
      {/* 这是公共容器, 同时容纳scrollbar与content部分 (试想, scrollbar在content内部, 就没有定制的必要了) */}
      <div
        ref={ref}
        style={{
          background: "#666",
          width: 500,
          height: 500,
          position: "absolute"
        }}
      >
        {/* <!-- 这是content的容器, 对应 barHeight --> */}
        <div style={{ background: "green", width: 200, height: 2000 }}>
          content区
        </div>
      </div>
      <ScrollBar
        direction="v"
        contentSize={2000}
        viewportSize={500}
        scrollSize={scroll}
        barWidth={20}
        barSize={250}
        barStyle={{ background: "#999", right: 0 }}
        thumbStyle={{ background: "red" }}
        visibleOn="needed"
        onScroll={s => {
          console.log("new scrollx, 最大为1500:", s);
          setScroll(s);
        }}
      />
    </div>
  );
};

storiesOf("scroll-bar", module).add("v_scrollbar", () => {
  return <VScrollBarTest />;
});
