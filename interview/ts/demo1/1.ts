// let a:any=1; // any 任何类型， ts新手，狂用any
//    a="1"  // 不能滥用,学会用泛型，做类型的传参
//    function getFirstElement(arr:any[]):any{
//     return arr[0]
//    }
//   // 复用性，函数参数，返回值 指定类型
   const numbers=[1,2,3]
   const firstNumber=getFirstElement(numbers)
   console.log(firstNumber)

//    const strs=["1","2","3"]
//    const firstStr=getFirstElement(strs)
//    console.log(firstStr)

//    复用这个函数的同时，传个类型参数

function getFirstElement<T>(arr:T[]):T|undefined{
    return arr.length>0?arr[0]:undefined
}

 const strings=["hello","world"];
 const firstString=getFirstElement<string>(strings);
 console.log(firstString)

// const numbers=[1,2,3]
// const firstNumber=getFirstElement<number>(numbers);
// // console.log(firstNumber)
// firstNum?.toFixed(2)
