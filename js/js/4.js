//全局的
//变量提升
const { log } = require("console");
//全局作用域
function fn(){//函数作用域
   let a=2;
   if(true){//支持块级作用域(高级语言的特性) var 不支持块级作用域
    var b=3;//块级作用域
   }console.log(b);
}
fn();
//全局的 js 代码执行之前会有一个预编译的过程
//变量提升
console.log(value,'-----------');
var a=1;
a=1;
if(false){//块级作用域
   var value=1;//申明变量 
} 
// undefined 有
//全局找不到value
console.log(value);