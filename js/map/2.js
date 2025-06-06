// parseInt num 函数解析一个字符串并返回一个整数。 JS 前端场景
['1', '2', '3'].map((num,index,arr)=>{
    console.log(num,index,arr);
    return num;
})
// 第二个参数是进制数
console.log(parseInt('1',0,['1', '2', '3']))
console.log(parseInt('2',1,['1', '2', '3']))
console.log(parseInt('3',2,['1', '2', '3']))