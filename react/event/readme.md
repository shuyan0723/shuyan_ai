# react 事件机制
- JS里面的事件机制 
   - 异步
   - 监听一个事件，
   -   addEventListener()
   DOM2 事件
   - DOM 0 
   <a onClick="doSomething()">  </a>
   - DOM 1? DOM 版本， 没有去做事件升级

  - addEventListener(type,listener,useCapture?) 
      - 回调函数 callback 异步处理的称呼
      - promise then 
      - async await 
      监听器 
- 注册事件 addEventListener 
- useCapture false 默认值
    页面是浏览器渲染引擎按像素点画出来 png
    先捕获 document -> 一层层去问
       点了谁？
       先触发父元素 
    event.target 
      捕获阶段结束，拿到event.target 
    冒泡
       event.target 冒泡到html 回去到根
       事件让他在冒泡阶段执行 
       在哪个阶段执行
