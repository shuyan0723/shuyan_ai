// 引入Node.js内置的文件系统模块（用于操作文件）
const fs = require('fs');

// 创建一个Promise对象，封装异步文件读取操作
const readFilePromise = new Promise((resolve) => {
    // 使用fs.readFile异步读取当前目录下的1.html文件
    // 参数1：文件路径（./1.html表示当前目录下的1.html）
    // 参数2：回调函数（err为错误对象，data为读取到的二进制数据）
    fs.readFile('./1.html', (err, data) => {
        // 将二进制数据转换为字符串并打印（假设文件是文本格式）
        console.log(data.toString());
        // 调用resolve()标记Promise状态为“已解决”，触发后续then链
        resolve();
    })
})

// Promise解决后执行的回调函数
readFilePromise
  .then(() => {
    // 函数体：当文件读取完成后执行
    console.log('读完了');
  })
// 注意：此处未处理reject情况（如文件不存在），实际开发中应添加catch捕获错误
// console.log('1111');
