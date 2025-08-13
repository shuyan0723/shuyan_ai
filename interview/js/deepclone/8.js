const s=Symbol('id'); // 独一无二，对象的属性
const source={
    [s]:123,
    name:'张三',
    age:19
}
const target=[];
Object.assign(target,source);
console.log(target);
