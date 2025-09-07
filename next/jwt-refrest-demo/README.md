# next.js 全栈项目

- users & posts 
- jwt 双token 鉴权
- 虚拟列表 
    AI 爬虫 掘金100条数据
- 大文件上传
- ai 工程化
       流式输出
       function tool
       mcp
- ai 搜索
    
## 双token 
单token localStorage 长期的，第三方拦截 不安全
安全 + 无感刷新登录
双token 
- accessToken 校验身份 重要 时间有效期变短 以小时为单位
      过期怎么办？ 
- refreshToken 刷新 7day 时间长
      没有过期，refreshToken 发到服务器 / api/auth/refresh 
     返回新的 accessToken 无感刷新
- refreshToken 过期后， 去登录

## 开发流程
- .env
      mysql url
      create database demo;建立数据库
- prisma 初始化 
      orm 工具
      object relation mapping 关系映射
      User(表) => User类
      一行     =>    new User() 实例
      底层数据库操作 映射 高级的面向对象操作 

- Prisma Schema 是定义数据库模型、
关系和数据类型的配置文件，
用于生成类型安全的数据库客户端。
     数据库设计图
     navicat 好的地方， schema + git 留下数据库设计和修改的历史
     文档型的， 可以追踪。留底

- Model 表的映射模型
        @@map("user") 指定模型对应的表名
        posts    Post[]  一对多的关系
        createdAt updatedAt  prisma 自动维护
        @id 主键 @unique 唯一索引
        Model User {
            columns name type  @default
            索引
            relation 
        }

        - migration 迁移
             记录 

- restful API
- lib/ 复用的js 模块
- regexp
     前端，后端都要会正则
     /^.+?[]{}$/ test 
     ^ 开始 $ 结束 ^ 严格匹配整个字符
     . 都匹配，一个字符
     ？ 0次或一次
     + 一次或多次
     [] 范围 
     {} 长度

     bcryptjs 是一个纯JavaScript实现的密码哈希库，用于安全地加密和校验密码

     加密js 模块  单向的加密算法（不能被解密）
     register 加密一次
     login password 加密一次 
     比较的是加密后的串是否一样？
- 状态码
    - 200 ok
    - 201 Created 成功创建
    - 400 Bad Request 客户端错误
    - 401 Forbidden 未授权
    - 404 Not Found 资源不存在
    - 409 Conflict 冲突
    - 500 Internal Server Error 服务器错误
    
    - middleware 的概念
      中间件 配置一个列表 
      / dashboard 
      Middleware 是中间件，用户在请求和响应之间执行预处理逻辑，
      如日志、认证、数据解析等。
      - 配置一个需要登录的页面数组
      - some startWith 
      - response.next() 放行 
      - response.redirect() 跳转