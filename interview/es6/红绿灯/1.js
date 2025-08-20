// 红绿灯

// const { sleep } = require("openai/core.mjs");

// - 同步阻塞
//  sleep 函数
// - 显示时间
// - 轮询


const sleep = ms=>new Promise(res=>setTimeout(res,ms));

(async()=>{
    console.log('begin');
    // 异步变同步
    await sleep(2000);
    console.log('end');
})()