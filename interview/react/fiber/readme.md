# React Fiber 机制

- 组件比较多，组件树（树状组件）的深度比较深
   每个组件都需要经历 JSX模板的编译，VDOM多的创建，响应式的生命，
   生命周期，挂载等，

   怎么办？核心问题是什么？
   react 组件渲染是同步代码，更加重要的没机会做
   打断一下，让浏览器响应用户更优先的先做一下，到时候再回来接着执行。

- fiber 机制是react 16引入的重写核心算法，实现了可中断渲染。

       - 学习过什么 api 类似fiber
            可打断可持续 
            requestAnimationFrame
            requestIdleCallback

- requestAnimationFrame
  `requestAnimationFrame` 是一个浏览器 API，用于在下一次屏幕刷新之前执行回调函数，
   常用于实现平滑的动画效果，确保每一帧都能在浏览器的空闲时间完成，避免页面卡顿。
   1s 执行60次

- requestIdleCallback
  - React 组件渲染低优先级任务
     不能往死里干，需要被中断
  - 更高优先级的任务是用户的交互

  - react 组件树 渲染任务拆分
     在一个时间切片里能执行
     这个时间长度用requestIdleCallback来描述的
     一直去问还有多少可执行时间 


## 总结一下
- react 组件多，组件树深度，渲染耗时，复杂
- 使用requestIdCallback 中断渲染
- 优先响应界面交互和核心任务
- 当再次idle 后，继续执行渲染任务
- requestIdCallback 时间不定，16.67ms(刷帧)-优先任务耗时=本次执行时间
没有fiber react 组件一多，就会卡，fiber 解决性能问题，主要通过中断渲染，
保障用户交互流畅，解决大型应用阻塞主线程问题。
fiber 节点，react 渲染的工作单元  

## Render分成两个阶段
     - 渲染阶段 构建新的虚拟dom 树，diff patches []
     - 提交阶段 把改变应用到DOM上。

## diff 算法
- 同层级比较 不然时间复杂度数O(n^3)
     - ABCDE EABCD
     dom 开销比较大
     diff 算法除了考虑本身时间复杂度，还考虑了dom 操作的次数。
     移动操作比新增+删除操作要少，所以diff 算法会优先考虑移动操作。
     insertBefore 
- 简单diff算法
- ABCD DCAB 
多节点 diff 算法的目的是为了尽量重复
      ABEC ABC
      new  newChildren[i]
       newChildren[i-1] B
       newChildren[i-1].nextSibling C
       insertBefore(E,newChildren[i-1].nextSibling)

       diff 算法我们是从一端逐个处理的， 叫做简单diff 算法