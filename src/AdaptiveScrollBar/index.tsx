import * as React from "react";
import { getOffsetTo } from "valor-app-utils";
import * as Rx from "rambdax";

interface Props {
  // h为水平滚动条, v为竖直滚动条
  direction: "h" | "v";
  // 内容size, 包括未显示部分
  contentSize: number;
  // 视口size ( 与barsize相同 )
  viewportSize: number;
  // 已滚动(到左或顶)的部分
  scrollSize: number;
  // 滚动条宽度
  barWidth: number;
  // 滚动条高度(不一定等于视口高!!!)
  barSize: number;
  // 滚动条样式
  barStyle: React.CSSProperties;
  // 滚动块样式
  thumbStyle: React.CSSProperties;
  // 是否总是显示 (即: 若contentSize<=viewportSize, 则可needed按需显示)
  visibleOn: "always" | "needed";
  // 当点击bar或拖拽thumb时, 对应的新的scroll
  onScroll: (scrollSize: number) => void;
  // 当拖动滚动条时, throttle时间, 免得一直发通知影响性能
  delay?: number;
}
/**
 * 非常易用的滚动条实现
 * 数据流是单向的, 当且仅当 内部发生点击或拖拽时, 才会通知外部onScroll
 * 由于担心使用useMemo造成内存泄漏, 不使用函数式组件
 * 请查看example
 */
class AdaptiveScrollBar extends React.PureComponent<Props> {
  ref: React.RefObject<HTMLDivElement> = React.createRef();

  constructor(props: Props) {
    super(props);
    this.centerBar = this.centerBar.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = Rx.throttle(
      this.handleMouseMove.bind(this),
      props.delay || 100
    );
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  centerBar(nativeEvent: any) {
    const {
      direction,
      onScroll,
      viewportSize,
      barSize,
      contentSize
    } = this.props;
    // 点击后, thumb 应该滚动到此位置 ( 顶部 )
    const thumbSize = this.thumbSize;
    const offset =
      direction === "h"
        ? nativeEvent.target === this.ref.current
          ? nativeEvent.offsetX
          : getOffsetTo(nativeEvent.target, this.ref!.current!).left +
            nativeEvent.offsetX
        : nativeEvent.target === this.ref.current
        ? nativeEvent.offsetY
        : getOffsetTo(nativeEvent.target, this.ref!.current!).top +
          nativeEvent.offsetY;
    const targetThumbTopOffset = offset - thumbSize / 2;
    const scroll =
      targetThumbTopOffset < 0
        ? 0
        : targetThumbTopOffset + thumbSize > barSize
        ? ((barSize - thumbSize) / barSize) * contentSize
        : (targetThumbTopOffset / barSize) * contentSize;
    onScroll(scroll);
  }

  thumbOffset0 = 0;
  moveFrom = 0;

  handleMouseDown(e: React.MouseEvent) {
    const event = e.nativeEvent;
    // 先保证点击bar时, thumb移到鼠标下方, 实现连续操作
    this.centerBar(event);

    setTimeout(() => {
      this.moveFrom =
        this.props.direction === "h" ? event.clientX : event.clientY;
      this.thumbOffset0 = this.thumbOffset;
      document.body.addEventListener("mousemove", this.handleMouseMove);
      document.body.addEventListener("mouseup", this.handleMouseUp);
    });
  }

  handleMouseMove(e: any) {
    this.tryNotify(e.clientX, e.clientY);
  }

  handleMouseUp(e: any) {
    this.tryNotify(e.clientX, e.clientY);

    document.body.removeEventListener("mousemove", this.handleMouseMove);
    document.body.removeEventListener("mouseup", this.handleMouseUp);
  }

  tryNotify(clientX: number, clientY: number) {
    const { direction } = this.props;
    const offset =
      direction === "h" ? clientX - this.moveFrom : clientY - this.moveFrom;
    const newScroll = this.getScrollByOffset(offset);
    if (newScroll !== this.props.scrollSize) this.props.onScroll(newScroll);
  }

  getScrollByOffset(offset: number) {
    const thumbSize = this.thumbSize;
    const { barSize, contentSize } = this.props;
    return this.thumbOffset0 + offset < 0
      ? 0
      : this.thumbOffset0 + thumbSize + offset > barSize
      ? ((barSize - thumbSize) / barSize) * contentSize
      : ((this.thumbOffset0 + offset) / barSize) * this.props.contentSize;
  }

  get barStyle() {
    const props = this.props;
    const { direction, barWidth, barSize } = props;
    return direction === "h"
      ? {
          position: "absolute" as any,
          ...props.barStyle,
          height: barWidth,
          width: barSize,
          overflow: "hidden"
        }
      : {
          position: "absolute" as any,
          ...props.barStyle,
          width: barWidth,
          height: barSize,
          overflow: "hidden"
        };
  }

  get thumbSize() {
    const { contentSize, viewportSize, scrollSize, barSize } = this.props;
    return Math.min((viewportSize / contentSize) * barSize, barSize);
  }

  get thumbOffset() {
    const { contentSize, viewportSize, scrollSize, barSize } = this.props;
    const thumbSize = this.thumbSize;
    return scrollSize >= contentSize - viewportSize
      ? barSize - thumbSize
      : Math.max((scrollSize / contentSize) * barSize, 0); // 防止负数scrollSize让滚动条溢出
  }

  get thumbStyle() {
    const props = this.props;
    const { direction } = props;
    const thumbSize = this.thumbSize;
    const thumbOffset = this.thumbOffset;
    return direction === "h"
      ? {
          position: "absolute" as any,
          width: thumbSize,
          height: "100%",
          left: thumbOffset,
          ...props.thumbStyle
        }
      : {
          position: "absolute" as any,
          width: "100%",
          height: thumbSize,
          top: thumbOffset,
          ...props.thumbStyle
        };
  }

  render() {
    const props = this.props;
    const { contentSize, viewportSize, visibleOn } = props;
    if (contentSize <= viewportSize && visibleOn === "needed") return null;

    const barStyle = this.barStyle;
    const thumbStyle = this.thumbStyle;
    return (
      <div ref={this.ref} style={barStyle} onMouseDown={this.handleMouseDown}>
        <div style={thumbStyle}></div>
      </div>
    );
  }
}

export default AdaptiveScrollBar;
