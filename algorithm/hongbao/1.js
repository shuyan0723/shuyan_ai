/**
 * 抢红包
 * @param {number} total 总金额
 * @param {number} num 人数
 * @returns {number[]} 每个人抢到的金额
 */
function hongbao(total,num){
     const arr=[];
     let restAmount=total;//剩余金额
     let restNum=num;//剩余人数
     for(let i=0;i<num-1;i++){
        //  随机金额 1-剩余金额/剩余人数*2
        // Math 
        //包装类
        let amout = Math.random(restAmount/restNum*2).toFixed(2)
        // console.log(amout);
        restAmount-=amout;
        restNum--;
        arr.push(amout)
     }
     arr.push(restAmount.toFixed(2))        //最后一个人
    //  -公平性
     //平均值
     //随机性
      return arr
}
console.log(hongbao(31,31));
