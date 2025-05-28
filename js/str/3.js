//包装类
let a = "abc";
let b = new String("abc");//类
console.log(a==b);//值
//js 给所以的简单数据类型提供了 相应类型的类  包装类
console.log(a===b);//类型不同
console.log(b.split(''))
// 为了统一面向对象写法,
// js 会主动将简单数据类型转化为相应的包装类型 包装成对象
// a -> new String(a)

console.log(a.split(''))
// 之后会销毁对象，回归原来的简单数据类型



