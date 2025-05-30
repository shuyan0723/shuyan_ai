// 定义全局作用域中的 bar 函数（作用域链指向全局）
function bar() {
    // 尝试打印变量 myName：由于 bar 函数内部未定义 myName，会沿作用域链向上查找
    console.log(myName); // 最终输出全局作用域的 "骑士"（原因见下文分析）
}

// 定义全局作用域中的 foo 函数（作用域链指向全局）
function foo() {
    // 在 foo 函数的局部作用域中声明变量 myName（var 声明会变量提升，但赋值在执行阶段）
    var myName = "极客"; 
    // 调用 bar 函数（bar 的作用域链在定义时已确定，与调用位置无关）
    bar(); 
}

// 全局作用域声明变量 myName 并赋值为 "骑士"（var 声明会提升到全局作用域顶部）
var myName = "骑士";

// 调用 foo 函数，触发 foo 内部逻辑执行
foo();