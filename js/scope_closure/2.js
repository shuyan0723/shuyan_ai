// 定义全局作用域中的 bar 函数
function bar() {
    var myName = "极客世界"; // var 声明：函数作用域（bar 函数内有效）
    let test1 = 100; // let 声明：函数作用域（bar 函数内有效）
    
    // if 条件为真（1 为真值），进入块级作用域
    if (1) { 
        let myName = "Chrome浏览器"; // let 声明：块级作用域（仅 if 块内有效）
        console.log(test); // 尝试打印变量 test：
        // 查找路径：当前块作用域（无 test）→ bar 函数作用域（无 test）→ 全局作用域（找到 let test = 1）
        // 最终输出全局作用域的 test 值 1
    }
}
// 定义全局作用域中的 foo 函数
function foo() {
    var myName = "极客邦"; // var 声明：函数作用域（foo 函数内有效）
    let test = 2; // let 声明：函数作用域（foo 函数内有效）
    // 显式块级作用域（{} 包裹）
    { 
        let test = 3; // let 声明：块级作用域（仅当前块内有效）
        bar(); // 调用 bar 函数（bar 的作用域链在定义时已确定，与调用位置无关）
    }
}
// 全局作用域：var 声明变量（全局有效，存在变量提升）
var myName = "极客时间"; 
// 全局作用域：let 声明变量（全局有效，无变量提升，块级作用域）
let myAge = 10; 
// 全局作用域：let 声明变量（全局有效）
let test = 1; 
// 调用 foo 函数，触发函数执行
foo();