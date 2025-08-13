-npx create-next-app@latest my-todo
  基于create-next-app创建项目一个my-todo next.js 项目
- npx
   不用先安装，先安装可以直接运行，适合项目的测试
   不会留下痕迹，不影响全局
   npm i -g create-next-app@lastest
   尝试一下某种技术的时候，特别有用

- CSR and SSR
   csr 组件在客户端运行 模板编译，挂载，浏览器(client) SPA
   Next.js 服务器端渲染SSR 组件的编译发生在服务器端，SEO 非常好
   爬虫爬取的是服务器端返回的html,而csr 只有一个root,所以是两种模式 
   企业站，SEO，掘金