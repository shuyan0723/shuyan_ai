//纯函数
// 想同的输入，一定会有想同的输出
// 没有副作用，不操作外部变量、不发请求、不该DOM
// 管理数据状态 纯函数去管 全局状态更正确
// 重要 一堆的地方都要用到它
// 修改值，修改方法 流程
function add(a,b){
    
    return a+b;
}
// 不纯的
let total=0; // 全局状态
function addToTotal(s){
    total+=s;
    return total;
}