/**
 * @param {string} s
 * @return {number}
 */
var romanToInt = function(s) {
    const map={
        I:1,
        V:5,
        X:10,
        L:50,
        C:100,
        D:500,
        M:1000,
        IV:4,
        IX:9,
        XL:40,
        XC:90,
        CD:400,
        CM:900,
    }
    let result=0;
    for(let i=0;i< s.length;i++){
        if(map[s[i]]<map[s[i+1]]){
            result=map[s[i]]-result
        }else {
            result=map[s[i]]+result
        }
    }
    return result;
};