interface Animal{
    name:string;
}
interface Animal{
    age:number;
}
const dragon:Animal={
    name:'龙',
    age:100,
}
// 不可以重复声明
// type AnimalType={
//     name:string;
// }
// type Animal={
//     age:number;
// }