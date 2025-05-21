# var_let_const
##JS代码的执行机制
-有一段代码 
硬盘读入内存 
-V8引擎
chrome 心脏，负责解析执行代码
-编译阶段
代码执行环境
currentVariable{
showName:''
myName
}
-作用域 scope 变量查找的规则
全局
函数
块级
-作用域链 scope chain
变量查找的路径 当前作用域->父作用域->...->全局作用域
嵌套关系 
冒泡查找
-变量提升 hoisting//英文：hoisting
-有作用域
-var 提升变量的申明 undefined
赋值是在执行阶段做
函数提升的是函数的定义 

-let 就不可以？
-变量声明 var//英文：variable declaration
-变量赋值 assignment//英文：variable assignment
-变量初始化 initialization//英文：variable initialization
-变量作用域 scope//英文：variable scope
-变量声明提前 declaration hoisting//英文：declaration hoisting
-变量赋值提前 assignment hoisting//英文：assignment hoisting
-变量初始化提前 initialization hoisting//英文：initialization hoisting
