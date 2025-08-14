# vue 中的hooks
- 你用的react 是什么版本的？
     react 19
     react 16.8 划时代的更新 函数式组件， hooks 2019年
     之前 类组件 Components 基类  
     函数组件 子组件+父组件通过props 传递数据 无状态组件
     UI 展示 Stateless 简单，性能好
     函数组件 + useState + useEffect.. hooks 类组件都没有必要了

- 类组件
    和函数组件都有， 各司其职
    - 类组件比较固守于类的格式，繁琐
    - this 丢失的问题 事件处理
    - 生命周期钩子函数 由useEffect 副作用代替
    - 开销大些 函数组件结合memo,useMemo 更好的性能优化

    - Vue 抄袭了react 
           hooks 函数式编程思想
      

- vue 和 react 相同点和区别 
- ahooks 

 - hooks 表达总线
      - 内置的hooks
      什么是hooks？
      Hooks 是 React 16.8 版本引入的一种新特性，它让你可以在函数组件中使用状态和其他 React 特性，而不需要编写类组件。简单来说，Hooks 就是一些特殊的函数，它们可以让你在保持组件函数化的同时，还能拥有类组件的一些功能，比如状态管理、生命周期事件等。

       通俗点讲，Hooks 就像是给你的函数组件插上翅膀，让它们能做更多的事情。
        在 React 世界里，Hooks 让组件的编写方式变得更加灵活和强大。

          useState,useEffect(副作用),
          useMemo,useCallback
          useContext,useReducer 
          useRef(用于创建一个可变的引用的对象) 
          useLayoutEffect(布局副作用) 是 React 的一个 Hook，
          它让你在组件更新后、浏览器重新绘制之前运行代码，适合执行那些需要立即看到效果的 DOM 操作。
          就像是你在装修房子时，先规划好所有家具的摆放位置（就像浏览器计算页面布局），
          然后立刻搬进家具（进行DOM操作）。这个Hook让你在规划好后立刻行动，
          确保一切都按照计划进行，用户很快就能看到装修好的样子。

          `useImperativeHandle`(自定义实例方法) 是 React 的一个 Hook，
           是一个 React Hook，它用于在使用 `ref` 时自定义暴露给父组件的实例值，
           确保父组件能够通过 `ref` 访问子组件中特定的方法或属性。

          想象一下你在玩一个遥控车，`ref` 就像是你手中的遥控器，它能让你控制车的各种动作。
          但是，有时候你不仅想控制车，还想直接访问车的一些功能，比如打开车灯或者检查电量。
          在 React 中，`useImperativeHandle` 就像是一个特殊的遥控器设置。
          当你用 `ref` 来控制一个子组件（遥控车）时，
          `useImperativeHandle` 允许你告诉子组件：“嘿，当你被父组件控制时，
          记得暴露一些特定的功能（比如打开车灯的方法）给父组件。”

这样，父组件就可以通过 `ref` 不仅发送命令给子组件，还能直接访问和使用子组件中的一些特定功能或信息，就像你通过遥控器检查遥控车的电量一样。这使得组件之间的交互更加灵活和强大。


      - 自定义的hooks
            useTitle, useTodos,useMouse,useRepos
            响应式业务，响应式场景封装到hooks/目录下，复用
      - ahooks 第三方hooks/ vue use 库
           useToggle,
           useRequest (所有的请求 data,loading,error) 我在业务中就经常用

