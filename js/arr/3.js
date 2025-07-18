const arr =new Array(5);
// console.log(arr);//[ <5 empty items> ]
// console.log(arr[0]);//undefined
let obj={
    name:'葫芦娃'
}
let obj2={
    skill:'喷火'
}
obj._proto_=obj2;
console.log(obj.skill);
for(let key in obj){
    console.log(obj[key]);
}
console.log(
    arr.hasOwnProperty('name'),
    arr.hasOwnProperty('skill')
);

console.log(arr.hasOwnProperty(0));

