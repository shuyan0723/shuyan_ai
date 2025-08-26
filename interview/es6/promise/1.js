const p1 = Promise.resolve('p1');
const p2 = new Promise((resolve, reject) => (
    setTimeout(() => {
        resolve('p2 延时一秒')
    }, 1000)
))
const p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('p3 延时一秒')
    }, 2000)
})
const p4 = Promise.reject('p4 rejected');
const p5 = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject('p5 rejected 延时1秒')
    }, 1500)
})
// 并行
//  开始计时
console.log('总耗时all 开始');

Promise.all([p1, ,p2,, p3]).then(res => {
    console.log(res);
    console.timeEnd('总耗时all');
    
 }).catch(err => {
    console.log(err);
      console.timeEnd('总耗时all');
})