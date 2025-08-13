// Object.defineProperty
var obj={}; // 对象
// es5 就提供的api 兼容性更好
// react 和vue 最新版 对浏览器有要求
Object.defineProperty(obj,'num',{
    value:1,
    configurable:true, //不能删除和修改
    writable:false, //不能修改
    enumerable:true, //不能枚举 可以被看到

    // 属性描述
    // get:function(){
    //     console.log('读取了属性');
    //     return this.value;
    // }
})
// obj.num=2
// console.log(obj.num);
// delete obj.num
// console.log(obj.num);
for(let key in obj){
    console.log(key,':'+obj[key]);
}
console.log(Object.getOwnPropertyDescriptor(obj,'name')); //
Object.defineProperty(obj,'name',{
    // value:'张三',
    // configurable:true,
    writable:true,
    // enumerable:true,
})
obj.name='Bob'

console.log(obj.name);
console.log(Object.getOwnPropertyDescriptor(obj,'name'));
