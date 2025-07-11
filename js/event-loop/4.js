console.log('同步start');
const promise1=Promise.resolve('Frist Promise');
const promise2=Promise.resolve('Second Promise');
const promise3=new Promise(resolve=>{console.log('同步3'); resolve('Third Promise');})
promise1.then(value=> console.log(value))
promise2.then(value=> console.log(value))
promise3.then(value=> console.log(value))
setTimeout(() => {
   console.log('下一把再见');
   const promise4=Promise.resolve('Forth Promise');
   promise4.then(value=> console.log(value))
},0);
setTimeout(()=>{
    console.log('异步1');
},0)
console.log('同步end');
