# react repos
- api.github.io/users/shuyan0723/repos
- 综合react开发全家桶、项目级别的、大型的、性能
- todos
- 从demo开始

- Login
## 路由设计
   - react-router-demo
   - /repos/:username/
   - /repos/:id
   懒加载 
   hash/history 
   （路由守卫） 
    useParams : username
## 数据管理
     APP 数据管理
     repos 
     useContext + useReducer + hooks
     createContext + reducer + useRepos 
## react 
    组件的粒度
## api 
    fetch
    - axios http请求库 
    - 独立的模块，所有的请求会从组件中分离到api目录下  

## 项目目录结构，项目架构
      - api
           应用中的所有接口
      - mian.jsx
           入口文件
           添加路由， SPA
           添加全局应用状态管理
           