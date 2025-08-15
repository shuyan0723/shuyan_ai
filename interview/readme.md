# 秋招面试

## JS
- Object.assign() 
- 深浅拷贝
- = JS 内存相关 
- 拷贝(简单数据类型 复印了一份 ) 和引用式赋值 

- 响应式底层
    - Object.defineProperty()
    - Proxy 

- 属性描述符(property descriptor)
  configurable:false, //可配置  不能删除和修改
  enumerable:false, //不能枚举
  writable:false, //不能修改
  value:1,
  get:function(){
    console.log('读取了属性');
    return this.value;
  },
  set:function(newValue){
    console.log('设置了属性');
    this.value=newValue;
  }

  ## Git
  开发中的如何使用git 的

  - 安装开发环境
      - node
      - git 环境 开源的分布式版本管理软件
      - 公司会发放一个git 账号,私有项目



  - git config --global user.name "your_name"
  - git config --global user.email "your_email@example.com"
  - 入职 git clone 公司代码
     - 主分支 main/master
         所有人都在用的，线上分支
     - 新开一个分支 dev 
        在自己的工作任务分支
        git checkout -b xxx
        git branch 查看当前分支
        git checkout main 切换到主分支
        


 - 常用命令
     git pull origin main 每天上班前的动作
     git status 当前git 状态
     git log --oneline  查看提交记录
     git add .提交到暂存区
     git commit -m "提交信息" 提交到本地仓库
     git push origin main  提交到远程仓库


     
     








