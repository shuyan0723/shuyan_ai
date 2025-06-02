// 枚举类型
const STATUS ={
    // 常量
    READY :Symbol('ready'),// 准备状态
    LOADING:Symbol('loading'),// 加载中状态
    ERROR:Symbol('error'),// 错误状态
    DONE:Symbol('done')// 完成状态
}
let status=STATUS.READY;
if(status===STATUS.READY){
    console.log('开始加载');
}
