var reverse=function(x){
    const result1=parseInt(Math.abs(x).toString().split('').reverse().join(''))*Math.sign(x)
    return result1>2**31-1||result1<-(2**31)?0:result1
}
const reverseNum=reverse(120);
console.log(reverseNum);
