团队上线了一张用户头像图片，放在CDN上做加速。后来后端同学更新了头像文件，
但前端刷新页面后，用户依旧看到的是旧头像

- 强缓存和协商缓存
  MaxAge http 1.1
  Expres 时间戳 客户端时间不准 1.0

  304
  Last-Modified  If-Modified-Since
  ETag If-None-Match

  - CDN Content Delivery Network 内容分发网络
    通过将静态资源存储到全球各个地的边缘节点，使用户就近访问，减少网络延迟和服务器负载

  - 怎么解决？
  1. 给资源加上hash avatar。png？v-123 版本号
  2. avatar.abc123.png 文件名+hash 给资源加上hash

## 跨域
- JSONP script 标签 src 可以跨域 只能GET 请求
- cors 服务器端设置响应头 Access-Control-Allow-Origin 可以跨域。

- 同源策略
Same-Origin Policy 
同源策略限制限制网页只能访问同源（协议、端口、域名）的资源，防止恶意网站在你登录状态下，偷偷读取或操作其他网站的数据，避免敏感信息被泄露，
是浏览器隔离风险的核心安全机制
- CORS 服务器配置Access-Control-Allow-Origin **白名单机制**。恶意网站没办法让别人的服务器给他开权限，所以跨域数据不同。
你-》 恶意网站 evil.com他想偷bank.com 信息
GET bank.com/api/balance bank.com Access-Control-Allo-Origin 没有evil.com 不执行
一般请求
预检请求 Option

- 代理
  开发期间的代理 vite 正向代理
   上线代理 nginx 反向代理