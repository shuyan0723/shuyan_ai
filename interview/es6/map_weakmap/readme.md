# map weakmap

- es6 新增的数据结构 作为企业级大型语言需要的内置数据结构
- key 可以是对象
- map（强引用），weakmap（弱引用）

## 垃圾回收
node --expose-gc 1.js
- 也是一套程序，也是语言底层的关键机制
- 内存的动态分配 由操作系统管理
- 引用计数 不为0 不会回收
- map 强引用 不会被回收 
  - key = null, map=null; 释放内存
- global.gc(); 手动触发垃圾回收
 node 运行 node --expose-gc 为运行方式
- weakmap 弱引用 会被回收

- Map,Set 需要手动去考虑内存的开销
    WeakMap,WeakSet 弱引用自动实现
    global.gc() 