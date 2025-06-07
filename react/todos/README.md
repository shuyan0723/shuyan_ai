## React 组件化

-vite 何为？
npm 包管理

- 大型项目
- 模型代码
- 跑起来

- 何为组件
    组合了html、css、js的开发单元
    App.jsx 根组件 
    - 标签粒度太细，只是工作的一个环节，不利于表达业务单元的抽象
    - TodoList 组件
    - 工作单位 
    - 功能单位 
- 组件如何划分 TodoList 为例
- 函数就是组件
    - return html 完成了模版{ 数据 }
    - return 之前 js 逻辑 数据 ....
    - 复用
    - 以html标签的形式，插入之


## 开发目录
    - todoListComponent 项目目录
    - src 开发目录 
    - index.html 入口文件
    - main.js 入口文件
    - App.jsx 根组件
    - 组件放到components 目录下
    - css 放在src/下
        相对路径 ../

    ## 模块化
     - 大型多人协作的项目
     - 模块化文件分离
         - 函数 
         - 类
         - 文件分离  一个文件一个模块（类，函数，组件）
         - import xxx from '../components/xxx'
         - export default xxx

    ## 组件化思想
    - 现代前端开发框架的核心思想
    - 低级的DOM树编程 -》组件数编程
    - 开发的最小单元
        html 只是沙子
        组件才是任务单元
    -组件组合一堆html,css,js  实现一个组合功能
       方便复用
    - 组件组合在一起 完成页面开发
        页面有组件构成，现代前端其实就是用组件搭乐高积木
  