# AI 单词拍照移动应用

- mobile APP
- css reset 
- 组件划分思维
  - 功能逻辑划分 图片上传
  - App 根组件
  - PictureCard 子组件
  - 组件通信
     - 父组件负责持有状态
     - 父组件api 请求
     - 子组件消费数据 
     - state(私有数据状态), props(父组件传递的数据状态) 都是数据
     - 子组件修改状态，通过回调函数通知父组件，父组件修改状态
 - 目录结构
  - src/ 开发目录 
  - components/ 组件目录
   - 组件就是一个文件夹
     - jsx
     - css
  - public/ 静态资源
  - libs/ 工具包
  - .env.local ai api-key token 等环境变量 

    - PictureCard/ 图片上传组件
