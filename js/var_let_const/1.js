// 代码 
// 编译阶段，
// 一霎那，语法检测，做点准备（变量查找）
// 执行阶段
// 当前作用域的顶部
// 变量提升事面试官喜欢问的，js开发者设计的
// 不好，代码的执行结果和代码的阅读顺序不一致，有歧义
// 糟粕，避开
// 申明变量不在使用var,用let
showName()// 驼峰式命名
console.log(myName);

var myName = 'shuyan';
function showName() { 
    let b=2;//函数作用域
console.log('函数执行了');

}
