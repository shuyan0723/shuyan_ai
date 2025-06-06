function Person(name, age) {
    //this 指向实例化对象 类似java 里面的this 关键字 指向对象
     this.name = name;
      this.age = age;
}
Person.prototype.sayHello=function(){
     console.log(`你好,我是${this.name},今年${this.age}岁`)
    }
var hu=new Person('吉他胡', 20)
console.log(hu.__proto__);
var a={
    name:'孔子',
    eee:'鹅',
    country:'中国'
}
hu.__proto__=a
console.log(hu.__proto__);
console.log(hu.country);
console.log(Person.prototype);
console.log(Person.prototype.constructor===Person);
console.log(hu.eee,hu.name);



