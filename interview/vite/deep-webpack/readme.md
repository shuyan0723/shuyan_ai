# hash 冲突怎么解决？

- 强缓存，协商缓存
    Cache-Control:max-age=
    节日活动，修改，编译，上线
    index.js 
    不用请求，怎么更新？

- bundle.[hash].js
 静态文件如何更新？
 使用hash 表达不同的版本，强制用户读取新文件。
 hash的设置，可以即强缓存又随时更新。
    每次编译，文件名都不一样
    缓存失效，每次都要请求
- bundle.[contenthash].js
    内容改变，hash 才会改变
    缓存失效，每次都要请求

- js css code splite
配置文件
- react react-dom react-router libs 单独打包