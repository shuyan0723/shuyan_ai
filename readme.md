
- git 版本控制

第一步
创建一个本地仓库
第一种：克隆别人的仓库
执行命令：git clone 仓库地址
第二种：电脑创建一个文件夹
执行命令：git init

把内容提交到暂存区
git add index.js
把所有的文件提交到暂存区
git add .
对提交内容备注
git commit -m '备注内容'

查看这些节点 提交人 提交时间 备注
git log
查看每次提交都修改了哪些文件
git log --stat