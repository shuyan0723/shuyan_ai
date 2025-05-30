// 定义函数 foo，内部包含局部变量和返回对象（触发闭包）
function foo() {
    // var 声明的函数作用域变量（可修改）
    var myName = "极客时间"; 
    // let 声明的函数作用域变量（块级作用域，但在此函数内等价于函数作用域）
    let test1 = 1; 
    // const 声明的函数作用域常量（不可重新赋值）
    const test2 = 2; 

    // 创建对象 innerBar，包含两个方法（getName 和 setName）
    var innerBar = {
        // getName 方法：打印 test1 并返回 myName
        getName: function() {
            console.log(test1); // 访问父级作用域的 test1（值为 1）
            return myName; // 访问父级作用域的 myName（初始为 "极客时间"）
        },
        // setName 方法：修改父级作用域的 myName
        setName: function(newName) {
            myName = newName; // 直接修改父级作用域的 var 变量（可写）
        }
    };

    // 返回 innerBar 对象（其方法会保留对 foo 函数作用域的引用，形成闭包）
    return innerBar;
}

// 调用 foo 函数，执行后 foo 的作用域本应销毁，但因 innerBar 被返回并赋值给 bar，其作用域被闭包保留
var bar = foo(); 
// 函数嵌套函数，外部访问的时候，
// 沿着词法作用域链，找到它申明的时候的函数中的变量，
//函数就好像有一个背包一样，里面放着外层函数的变量。
// 通过 bar 调用 setName 方法，修改闭包中的 myName（从 "极客时间" 改为 "极客邦"）
bar.setName("极客邦"); 

// 调用 getName 方法：
// 1. 打印闭包中的 test1（值为 1）
// 2. 返回闭包中已修改的 myName（"极客邦"）
bar.getName(); 

// 再次调用 getName 并通过 console.log 输出返回值（结果为 "极客邦"）
console.log(bar.getName());