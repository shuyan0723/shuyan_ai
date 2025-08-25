# 数据可视化

- echarts
   老板，客户，数据报表
   开源的用于绘制柱状图，饼状图等的可视化库
- @types/echarts
     echarts 类型申明文件， 单独的 
     为什么react 不需要单独安装类型申明文件？
     react 是用ts 写出来的
     acharts 原生js 和类型声明文件是分开的

- 直接看出数据的价值
     echarts 2D
     three.js 3D
     数据可视化
- echarts 3D
    - 安装echarts, @types/echarts
    - init 实例化
          姚传给他一个图表的额DOM挂载点
          useRef<HTMLDivElement>(null)
          null | HTMLDivElement
          联合类型 useRef 可变对象
    - setOption(option)
         series 数据条目