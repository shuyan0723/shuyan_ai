/**
 * 大数相加函数（处理字符串形式的超大数字相加）
 * @param {string} num1 - 第一个大数字符串（如 "1234567890123456789"）
 * @param {string} num2 - 第二个大数字符串
 * @returns {string} 两个大数相加后的结果字符串（如 "2469135780246913578"）
 */

function addLarge(num1, num2) {
    let results = ''; // 存储最终相加结果的字符串（从低位到高位拼接）
    let carry = 0;    // 存储进位值（0 或 1，因为两个个位数相加最大为 9+9+1=19，进位最多为 1）
    let i = num1.length - 1; // 指针：从 num1 的最后一位（个位）开始遍历
    let j = num2.length - 1; // 指针：从 num2 的最后一位（个位）开始遍历

    // 循环条件：只要任意一个数还有未处理的位，或存在进位，就继续相加
    while (i >= 0 || j >= 0 || carry > 0) {
        // 取当前位的数字（若指针越界则取 0）
        const digit1 = i >= 0 ? parseInt(num1[i], 10) : 0; // num1 的当前位数字（i 有效时取对应位，否则 0）
        const digit2 = j >= 0 ? parseInt(num2[j], 10) : 0; // 修正：原代码为 num2[i]，应为 num2[j]！否则 j 指针无效时会取错位置

        // 计算当前位的和（当前位数字 + 进位）
        const sum = digit1 + digit2 + carry;

        // 拼接结果：取 sum 的个位（sum % 10），
        // 拼接到结果字符串的前面（因为是从低位到高位计算）
        results = (sum % 10).toString() + results;

        // 更新进位：取 sum 的十位（sum / 10 向下取整，结果只能是 0 或 1）
        carry = Math.floor(sum / 10);

        // 指针左移，处理前一位
        i--;
        j--;
    }

    return results; // 返回最终相加结果
}