# 数组上的方法

## 分纬度来回答，带上业务场景

- 是否修改原数组，非纯函数，有副作用。姚慎用
    push pop shift unshift 栈。队列操作
    shift unshift 性能差， 移动元素 （数组是连续）
    
    splice(删除/插入/替换)
    splice(start,deleteCount,item1,item2,item3....)
    sort 排序

不会修改原数组的方法， 纯函数， 推荐多用
   - forEach 无返回
   - map 返回新数组
   - 查找类
       es5 提供了indexOf,  lastIndexOf
       es6 提供了 find 查找满足条件的元素 第一个元素
       findIndex 查找满足条件的元素 第一个下标
       includes 是否包含
       在最近的新版本里 es15 2023 findLastIndex 
       js是基于ECMAScript 脚本标准开发的 
       ES5 兼容性
       ES6 新特性
       ES6+ 对新特性持续在关注

      - 过滤和判定
          filter 过滤
          some 有一个满足
          every 所有都满足
          any 有一个满足
          none 没有一个满足
      - 拼接/裁剪
          concat 拼接
          slice 裁剪
      - 扁平化
          flat 扁平化
      - 迭代器 iterable
          keys() values() entries()
      - join/toString() 拼接
      - 归约
          reduce 归约
          reduceRight 从右往左归约
      - 静态方法
          Array.from() 类数组转数组
          Array.of() 数组转类数组
          Array.isArray() 是否是数组
      find/findIndex/findLast/findLastIndex
      filter 过滤
      some 有一个满足
      every 所有都满足


- es6 新增方法
- 遍历/查找类//转换类/拼接类/统计类
