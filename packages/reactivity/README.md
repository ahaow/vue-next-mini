# reactivity

响应性核心

## 什么是 WeakMap？ 它和 Map 有什么区别?

WeakMap 和 Map 两个具备一个核心共同点，那就是：**都是 {key, value}的结构对象**

但是对于 WeakMap 而言，它却存在两个不同的地方：

1. key 必须是对象
2. key 是若引用

概念：

弱引用: 不会影响垃圾回收机制，即：WeakMap 的 key 不再存在任何引用时，会被直接回收

强引用: 会影响垃圾回收机制，存在强引用的对象永远不会被回收

```js
let obj = {
  name: 'carpe'
}

const map = new Map()
//   const map = new WeakMap()
map.set(obj, 'value')

obj = null
```

## 总结

对于 reactive 的响应函数而言，我们知道它：

1. 通过 proxy 的 setter 和 getter 来实现的数据监听
2. 需要配合 effect 函数进行使用
3. 基于 WeakMap 完成的依赖收集和处理
4. 可以存在一对多的依赖关系

reactive 的不足:

1. reactive 只能对 复杂数据 类型进行使用
2. reactive 的响应性数据，不可以进行结构
