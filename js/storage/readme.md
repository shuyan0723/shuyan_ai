# Storage 存储
  - 前端存储
    - cookie
     存储啥玩意 
       - 登录状态
       - 购物车
   - localStorage
   - sessionStorage
   - indexDB
  - 后端存储
    MySQL NoSQL MongoDB
  - 缓存 

## 首页
- 用户的登录状态
  cookie
      - 服务器识别用户身份
      - B/S 架构软件 http 协议 
      - http 0.9 版本 没有身份 
      - http 是无状态协议 
        请求一次和一千次，拿到的内容都一致 
        身份状态？ 
      - http 1.0 正式版
        header 请求头
        Content-Type:
        Authorization
        Cookie uid-1241212
        用户带上，服务器端在解析 你的身份了
        http 协议还是无状态的 ，请求头可以夹带一些私货
      - 界面有哪些状态 
        未登录 已登录 用户身份  时间 过期 主动登出（换号）

    - 前后端联调
        - 前端负责表单 
          阻止默认行为
          收集表单值
          fetch 请求 await 等待服务器端响应请求 
          POST /login api 地址  前后端接口 
        - 后端
          路由 /login
          用户名和密码的校验
          通过设置cookie 响应头 Set-Cookie
          服务器端的返回 http 一起回到请求端
          前端存储里 Cookie 有了内容

 ## Cookie
  Cookie是浏览器存储的小型文本数据，用于记录用户状态（如登录信息），
  随HTTP请求发送至服务器，实现会话保持。
- 每次http的时候，会自动带上cookie 信息
- cookie 小饼干 (内容小) 关键的身份信息 ，存储在浏览器中(位置) 
- http 协议仍然是无状态的，每次请求独立，它是通过在请求头携带cookie 信息，实现身份认证。

        



