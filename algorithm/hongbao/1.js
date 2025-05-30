/**
 * 抢红包算法（存在待修复问题）
 * @param {number} total 总金额（单位：元）
 * @param {number} num 抢红包人数
 * @returns {number[]} 每个人抢到的金额数组（单位：元，保留两位小数）
 */
function hongbao(total, num) {
    const arr = []; // 存储每个人抢到的金额
    let restAmount = total; // 剩余未分配的金额（初始为总金额）
    let restNum = num; // 剩余未分配的人数（初始为总人数）
    
    // 循环分配前 num-1 个人的红包（最后一人直接取剩余金额）
    for (let i = 0; i < num - 1; i++) {
        // 问题1：Math.random() 不接受参数，原逻辑错误
        // 原意图：生成 1 到 (剩余金额/剩余人数*2) 之间的随机金额（理想逻辑）
        // 正确写法示例：Math.random() * (max - min) + min，此处需调整
        // 问题2：toFixed(2) 返回字符串，直接参与数值运算会导致类型错误（如 "1.23" - 1 会变成 "0.23"）
        let amout = Math.random(restAmount / restNum * 2).toFixed(2); // 错误：Math.random() 无参数
        
        // 问题3：amout 是字符串，restAmount 是数值，减法会转为字符串拼接（如 10 - "2.3" = 7.7，但 10 - "abc" = NaN）
        restAmount -= amout; // 实际会变为 restAmount = restAmount - Number(amout)，但需显式转换
        restNum--; // 剩余人数减1
        arr.push(amout); // 将当前金额存入数组（但类型为字符串）
    }
    
    // 最后一人取剩余金额（同样存在 toFixed(2) 转字符串问题）
    arr.push(restAmount.toFixed(2)); // 剩余金额可能因前面的类型错误变为 NaN 或负数
    
    // 公平性/随机性说明：当前逻辑未限制最小金额（可能出现0元），且随机范围计算错误，需优化
    return arr;
}

// 测试：总金额31元，31人抢（每人理论最小0.01元）
console.log(hongbao(31, 31));
