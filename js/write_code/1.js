// 完成的功能
// function objectFactory(){
//     var obj={};
//     // 类数组没有shift方法，所以借用数组的shift方法
//     var Constructor=[].shift.call(arguments); // 构造函数
//     obj.__proto__=Constructor.prototype
//     var ret =Constructor.apply(obj.arguments)
//     // Constructor.apply(obj,arguments)
//     //  || null 的情况 仍然会返回object 构造函数 return 简单类型，忽略
//     return typeof ret==='object'?ret||obj:obj
// }
// es6 版本
function objectFactory(Constructor,...args){
    var obj={};
    // 类数组没有shift方法，所以借用数组的shift方法
    // var Constructor=[].shift.call(arguments); // 构造函数
    obj.__proto__=Constructor.prototype
    var ret =Constructor.apply(obj.arguments)
    // Constructor.apply(obj,arguments)
    //  || null 的情况 仍然会返回object 构造函数 return 简单类型，忽略
    return typeof ret==='object'?ret||obj:obj
}
function Person(name,age){
    this.name = name
    this.age = age
    // return 1;
    return {
        name:name,
        age:age,
        label:'hahaha'
    }
}
Person.prototype.sayHi=function(){
    console.log(`你好，我是${this.name}`);
}
let p1=new Person('张四',18)
console.log(p1);

// p1.sayHi()

let p=objectFactory(Person,'张三',20)
console.log(p);
// p.sayHi()
console.log(p instanceof Person);

// new Person(...)->function[[construct]]->{} &&this  ->[[call]]
// ->{}.__proto__ ->constructor.prototype ->return {}  