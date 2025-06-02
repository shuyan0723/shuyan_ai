// 独一无二的值
const sym=Symbol();
const sym1=Symbol();
const sym2=Symbol('desc');//label 标签
console.log(typeof sym,sym);
console.log(sym===sym1);// false
// symbol 可以用于对象的key
// 使用symbol 构造函数实例化，一个标记id 的唯一值ID
// ID 唯一性，Symbol
const ID=Symbol('id');
// es6 之前 key string
// symbol 作为key 不会被枚举，不会出现在for...in for...of Object.keys() Object.getOwnPropertyNames() JSON.stringify()

const sex='男'
const num=2
const age =Symbol('age');
const user={
   "name":'Alice',
   "age":18,
   [age]:19,
//    [sex]:'男',
//    [num]:2,
   // key 是独一无二的
   // 当我们在大厂,如果我们要去修改别人的代码中的对象
   // 对象动态的 不希望出错
   [Symbol()]:18,
   [ID]:123,
    // "ID":1,
}
// user.age=18;
// console.log(user.name,user.age,user[age],user[ID]);
// 面向对象私有属性概念？
// 对象的隐私 
for(let key in user){ //遍历对象的key 不包括symbol
    console.log(key,user[key],'-------------');
}
