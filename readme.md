
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

commit 5d1215bf56195ccf2d2775901a97af841df77e53
可以穿越时间查看之前的代码

git diff 5d1215bf56195ccf2d2775901a97af841df77e53
可以查看这次提交修改了什么内容
分支
git branch 查看项目有哪些分支
master 一般用来保存经过测试的稳定代码
想开发新功能，一般在master基础上再复制出一个develop分支
一般用来保存开发过程中的代码
git checkout -b develop
git branch 可以发现已经创建了分支了
git checkout master 切换到master分支
git merge develop 合并develop分支到master分支上
