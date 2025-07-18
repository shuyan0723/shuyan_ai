# Array

- 怎么认识数组
    - 可遍历的对象
- new Array(5)
   类似于c++,固定大小的分配 v8引擎对arr 设计
   - 灵活的扩展，不限类型，还有hash(哈希)的特性
   - empty*5 key 没有释放 for key in 不可以迭代、
   - new Array().fill(undefined) 统一
- [] 数组字面量
   ['宗馥莉','宗继昌','宗继盛','宗捷梨']
- 静态方法
    Array.of(1,2,3) // 已经有了数据
    Array.from()  // 转换，(类数组，填充计算)

// 
