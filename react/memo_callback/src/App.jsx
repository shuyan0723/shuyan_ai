import { useState,useEffect,useCallback,
  useMemo // 缓存一个复杂计算的值
 } from 'react'
import './App.css'
import Button from './components/Button'
function App() {
  const [count,setCount] = useState(0)
  const [num,setNum] = useState(0)
  console.log('App render');
  
  const expensiveComputation=(n)=>{
    // const tt=expensiveComputation(n)
    // console.log(tt);
    console.log('expensiveComputation');
    
    // 复杂计算 开销高
    for(let i=0;i<1000;i++){
      // console.log(i);
      i++
    }
    return n*2
  }
  const result = useMemo(()=>expensiveComputation(num),[num])
  useEffect(()=>{
    console.log('count',count);
  },[count])
  useEffect(()=>{
    console.log('num',num);
  },[num])
  // render 重新生成 
  // 不要重新生成，和 useEffect []一样 
  // callback 回调函数 缓存
  const handleClick = useCallback(()=>{
    // setNum(num+1)
    console.log('handleClick');
  },[num])
  return (
    <>  
       {/* <div>{expensiveComputation(n)}</div> */}
       <div>{result}</div>
       <div>{count}</div>
       <button onClick={()=>setCount(count+1)}>增加</button>
       <br />
       <button onClick={()=>setNum(num+1)}>增加</button>
       <br />
       <Button num={num} onClick={handleClick}>Click me</Button>
    </>
  )
}

export default App
