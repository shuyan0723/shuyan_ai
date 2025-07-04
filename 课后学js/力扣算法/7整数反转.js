function reverse(x) {
    const reversed = parseInt(Math.abs(x).toString().split('').reverse().join('')) * Math.sign(x);
    return reversed > 2**31 -1 || reversed < -(2**31 - 1) ? 0 : reversed;
}
const reverseNum = reverse(-123);
console.log(reverseNum);