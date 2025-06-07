// 定义构造函数 Person（模拟“类”，首字母大写是约定）
// 参数 name（姓名）、age（年龄）用于初始化实例属性
function Person(name, age) {
    // this 指向通过 new 创建的实例对象（类似 Java 的 this）
    // 为实例添加私有属性（每个实例独立）
    this.name = name;
    this.age = age;
}

// 为 Person 的原型对象添加共享方法 sayHello（所有 Person 实例可通过原型链访问）
Person.prototype.sayHello = function() {
    console.log(`你好,我是${this.name},今年${this.age}岁`);
}

// 通过 new 创建 Person 的实例 hu（实例化对象）
// 参数 '吉他胡' 和 20 会传递给构造函数，初始化 hu 的 name 和 age
var hu = new Person('吉他胡', 20);

// 输出 hu 的隐式原型 __proto__（初始指向 Person.prototype）
// 结果应为 { sayHello: [Function (anonymous)] }（即 Person 的原型对象）
console.log(hu.__proto__);

// 定义一个普通对象 a，后续用于修改 hu 的原型
var a = {
    name: '孔子',   // a 的 name 属性（会被 hu 访问，但优先级低于 hu 自身的 name）
    eee: '鹅',      // a 的 eee 属性（hu 可通过原型链访问）
    country: '中国'  // a 的 country 属性（hu 可通过原型链访问）
}

// 动态修改 hu 的隐式原型为对象 a（改变 hu 的原型链）
// 注意：直接修改 __proto__ 不推荐（影响性能），仅用于演示原型机制
hu.__proto__ = a;

// 输出修改后的 hu.__proto__（应显示对象 a 的内容）
console.log(hu.__proto__);

// 访问 hu 的 country 属性：hu 自身无此属性，从原型 a 中查找
// 输出：中国（来自 a.country）
console.log(hu.country);

// 输出 Person 的原型对象（未被修改，仍保留 sayHello 方法）
// 结果应为 { sayHello: [Function (anonymous)] }
console.log(Person.prototype);

// 验证 Person 原型对象的 constructor 属性是否指向 Person 构造函数
// 原型对象默认有 constructor 属性，指向其对应的构造函数，输出：true
console.log(Person.prototype.constructor === Person);

// 访问 hu 的 eee 和 name 属性：
// - eee：hu 自身无此属性，从原型 a 中获取（输出：鹅）
// - name：hu 自身有此属性（构造函数初始化的 '吉他胡'），优先级高于原型 a 的 name（输出：吉他胡）
console.log(hu.eee, hu.name);



