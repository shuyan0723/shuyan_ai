// NaN 是一个特殊的数字 代表不是一个数字
// ParseInt() 函数解析一个字符串并返回一个整数。 JS 前端场景
// input输入->Number 数字类型->字符串类型->ParseInt() 解析->数字类型->NaN
// map 要接受函数
// forEach 
console.log(['1', '2', '3'].map(parseInt)) // [1, NaN, NaN]  
//[1,2,3]