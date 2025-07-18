const arr =[1,2,3];
// 可迭代对象 比我们技术循坏好理解
for(const [index,value] of arr.entries()){
    console.log(index,value);
}
// for of item 还要拿到index?
// for(const [index,value] of arr.entries()){
//     // 每一项都是数组，第一项是key,第二项是值
//       console.log(index,value);
      
// }
console.log(arr.entries());
