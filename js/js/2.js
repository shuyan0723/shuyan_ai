// 数组对象
const arr = ['1','2','3'];
console.log(typeof arr);//类型运算符 undefined 未定义
const date = new Date();//日期对象
console.log(typeof date);//类型运算符 undefined 未定义
// 如何区分Object 的这些类型呢？
//[object Array]
//[object Date]
console.log(typeof Object.prototype.toString.call(arr)); //对象.原型.字符串化调用(数组)
console.log(Object.prototype.toString.call(date));//对象.原型.字符串化调用(日期)
// 会在MDN 文档看一些资料
function getType(val){//自定义函数
    // string api 的选择
    // split + substring
    return Object.prototype.toString.call(arr).slice(8,-1);

}