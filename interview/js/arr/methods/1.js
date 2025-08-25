const arr=[1,2,3,4,5];
// const removed=arr.splice(2,2);
// console.log(removed);

// console.log(arr);
// 如果不修改呢？ 
const newArr=arr.slice(0,2).concat(arr.slice(4));
console.log(newArr);
console.log(arr);
