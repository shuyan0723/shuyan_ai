console.log(0/0);
// 平方根 NaN 
console.log(Math.sqrt(-1));// js 内置的Math对象，提供了一些数学运算的方法，如sqrt（）
console.log(parseInt('123'),parseInt('a456'),parseInt('456a'));
console.log(Number(undefined));// NaN
console.log(NaN===NaN);// false Not a Number 不是数字的方式有很多种 NaN是一个特殊值
console.log(isNaN(NaN),isNaN(0/0),isNaN('456a'),(typeof('456a') !=='number'));// true 是数字的方式有很多种
console.log(typeof NaN);
