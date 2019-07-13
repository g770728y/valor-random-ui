# valor-random-ui

> 工作中写的 不成体系 的 ui 组件, 有少量复用机会

## Install

```bash
npm install --save valor-random-ui
```

## 组件介绍

### FlatTree

只需要数据库返回如下数据: \

```
[{id, level, content} , {id, level, content}]
( 无需pid, children )
```

然后就可以使用 FlatTree 构建出树来.
在视效上, FlatTree 相当于一个列表, 通过缩进来展示树
 由于`FlatTree`组件, 为一个纯展示组件 ( 自身不保持状态 )
为方便起见, 提供了以下`helper`方法:

-

## License

MIT © [g770728y](https://github.com/g770728y)
