/**
 * 
 * @param {string} num1 
 * @param {string} num2 
 * @returns {string}
 */


function addLarge(num1, num2) {
    let results = ''; // 存储结果
    let carry = 0; // 存储进位
    let i=num1.length-1;
    let j=num2.length-1;
    while(i>=0||j>=0||carry>0){
        // 边界
        const digit1=i>=0? parseInt(num1[i]):0;
        const digit2=j>=0? parseInt(num2[i]):0;
        const sum=digit1+digit2+carry;
        results=(sum%10)+results; // 取余 取个位数  字符串拼接
carry=Math.floor(sum/10); // 取整 取十位数
i--; // 指针
j--; // 指针
    }
    return results;
}