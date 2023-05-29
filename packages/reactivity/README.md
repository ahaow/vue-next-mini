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


# ref

## ref 函数是如何进行实现的呢?

`ref` 函数本质上是生成一个 `RefImpl` 类型的实例对象，通过 `get` 和 `set` 标记处理了 value 函数

## ref 可以构建简单数据类型的响应性吗?

是的，ref 可以构建简单数据类型的响应性

## ref 的数据 为何必须通过 .value访问

1. 因为 ref 需要处理简单数据类型的响应性，但是对于简单数据类型而言，它无法通过 proxy 建立代理
2. 所以 vue 通过 `get value()` 和 `set value()` 定义了两个属性函数，通过主动触发这两个函数(属性调用)的形式来进行依赖收集 和 触发依赖
3. 所以通过 `.value` 来保证响应性