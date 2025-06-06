// 没有class 的 js 如何在苦苦追求 oop
// 首字母大写 约定 1.类的概念
// 2.构造函数 
function Person(name, age) {
    //this 指向实例化对象 类似java 里面的this 关键字 指向对象
     this.name = name;
      this.age = age;
}
// 函数对象 原型对象
// 类的方法
Person.prototype={
   sayHello:function(){
    console.log(`你好,我是${this.name},今年${this.age}岁`)
   }
}
// new 一下 实例化对象
// new 运行构造函数
let hu=new Person('吉他胡', 20)
hu.sayHello()
// 原型对象 
let o={a:1};
console.log(o.__proto__.__proto__);

console.log(hu.__proto__);
console.log(o.toString());

// console.log(new Person('小公主', 20))