# 性能优化

## 重绘重排

- 重绘
    当元素样式改变但不影响布局时，浏览器重新绘制元素的过程。如改变颜色，背景等。
- 重排
    DOM元素的尺寸，位置发生变化时，浏览器需要重新计算布局，影响其他元素位置的过程。
    重排一定会触发重绘（性能开销更大），重绘不一定会触发重排。

### DEMO 1 批量修改DOM 
```js
// 不对 多次操作可能触发多次重排重绘
// 虽然现代浏览器会批量更新，会合并修改，优化
// 但是我们可以通过一些操作避免
const el = document.getElementById('myEl')
for (let i = 0; i < 1000; i++) {
    el.style.width  = '100px';
    el.style.height ='100px';
    el.style.margin ='10px';
    // good
    el.className='my-class' // 用类名而不是一堆js操作style
    el.style.cssText = 'width: 100px; height: 100px; margin: 10px;'
    el.className='my-class2'
}
```

### 使用文档碎片
```js
const fragment = document.createDocumentFragment();
for(let i=0;i<10;i++){
    const el = document.createElement('li')
    el.style.width = '100px'
    el.style.height = '100px'
    el.style.margin = '10px'
    fragment.appendChild(el); // 没有重绘重排
}
document.body.appendChild(fragment) // 一次重排重绘
// 批量添加元素时，使用document.createDocumentFragment()优化
// 也可以用appendChild 但是会触发重排
```

## 脱离文档流进行操作 下线
```js
const el = document.getElementById('myEl');
el.style.position = 'absolute'
el.style.display = 'none'
... 进行大量DOM操作

el.style.display = 'block';
el.style.position = 'static'
el.style.left = '100px'
el.style.top = '100px'
```


### 缓存布局

```js
// offsetTop 读取，但是每次都会触发重排以获得盒子的布局信息

for(let i=0;i<1000;i++){
    el.style.left =el.offsetTop + 1 + 'px'
}

let top = el.offsetTop;// 缓存了布局信息
for(let i=0;i<1000;i++){
    top += 1;
    el.style.top = top + 'px';
}
```

### 使用transform 代替位置调整
```js
// 不会触发重排，只触发重绘，性能更好。
el.style.transform = 'translateX(100px)'
// 会触发重排
el.style.left = '100px'
// 不会触发重排
el.style.transform = 'translateY(100px)'
// 不会触发重排
el.style.transform = 'translate(100px,100px)'
```

## 资源的加载优化
     - 图片懒加载
     - 路由懒加载
        代码文件上，  code spliting 代码分割
     - 资源预加载
         未来可能会用到的资源
        <link rel='prefetch' href='/next-page.js'>
        dns-prefetch dns 预解析
        preload 当前页面必须资源，立即加载
        - script 资源的加载 阻塞的
            默认没有
            async  并发 异步加载，不阻塞页面其他资源加载
            defer 异步加载，但是会阻塞页面其他资源加载，等页面加载完成再执行    
            module 异步加载，但是会阻塞页面其他资源加载，等页面加载完成再执行，
            并且会将模块的依赖关系解析出来，提前加载
        - webp 格式图片
            图片的优化，显著的减少体积，并质量不受影响
        - 图标字体库
        减少http请求数

            
## JS执行优化
       - 防抖节流
       - web worker 处理复杂的计算
       - requestAnimationFrame 动画优化
       - requestIdleCallback react fiber 机制
            schedule 机制
       
## 框架层优化
      - memo,useMemo,useCallback 避免不必要的渲染
      - shadcn-ui 按需加载组件库
      - 合理使用key 优化列表渲染

## 缓存策略
      - 强缓存和协商缓存
          Expires(客户端时间不准确) / Cache-Control 不发送请求
          LastModified if-modified-since 时间戳  304
          ETag if-none-match 
      - localstorage/sessionStorage/cookie
## 网络优化
      - CDN加速
          静态资源，分流，会缓存文件
          多路复用 多域名服务器 img1.baidu.com img.baidu.com
      - Gzip 压缩
      - HTTP/2 多路复用
      - DNS 预解析

## 首屏优化
      - SSR 
           组件渲染在服务器端已经完成编译，执行，浏览器端直接显示就好
      - 骨架屏
      - http 2.0 server push 首屏数据推送

## 性能测试
      - chrome 的performance面板
      可以看到各项性能指标，针对性的优化
      可以给出各项性能指标，针对性的优化，给出优化建议

      - 减少首屏JS/css 体积 （code spliting）
      代码分割（Code Splitting）是一种通过将代码分割成多个小块（chunks），
      并按需动态加载的技术，用于优化应用程序的加载性能，提高用户体验。
      - 使用transform代替位置调整，预加载相关资源
      juejin js = (vue + vue-router) + App.vue + Home.vue + Components
      vue+vue-router 单独拆分 缓存 基本是不会变的
      App.vue + home.vue + components 业务代码 经常改，单独
      做了一次升级 

    - lightHouse 性能测试
         是chrome的一款性能打分插件，会在 性能，无障碍，最佳实践，SEO 打分
         会给出优化建议，非常细致。
         - 图片大小优化
         - 字体库
         - 渲染屏蔽请求

## 性能的关键指标
- FCP First ContentFul Paint
     首内容绘制（FCP First ContentFul ，FCP）是衡量网页加载性能的关键指标，
     表示页面中最大可见内容元素（如图片，视频或文本块）完全渲染完成的时间。

- LCP Largest Contentful Paint
     最大内容绘制（Largest Contentful Paint, LCP）是衡量网页加载性能的关键指标，
     表示页面中最大可见内容元素（如图片、视频或文本块）完全渲染完成的时间。
     

      首页只加载必要的js，其他组件按需加载

