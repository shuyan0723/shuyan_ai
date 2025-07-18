// 如何遍历数组
// - for (let i=0...) 计数循环 性能好 可读性不好 不是人脑，是电脑
// - while
// - forEach 
// - map filter find some every ...
// - for of 
const names=Array.of('宗馥莉','宗继昌','宗继盛','宗捷莉');
// console.log(names);
names.forEach(name =>{
    if(name=='宗捷莉'){
        console.log('我是宗捷莉');
        // break;
        return;
    }
    console.log('Processing:'+name);
    
})
