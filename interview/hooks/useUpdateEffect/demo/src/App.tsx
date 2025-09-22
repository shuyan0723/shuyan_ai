import { useState } from "react";
import useUpdateEffect from './hooks/useupdateEffect'

export default function App(){
  const [count,setCount]=useState<number>(0);
  useUpdateEffect(()=>{
    console.log('count update',count);
  },[count])
    
  
  return (
    <div style={{padding:20}}>
      <h1>useUpdateEffect</h1>
      <p>Count:{count}</p>
      <button onClick={()=>setCount(count+1)}>+</button>
    </div>
  )
}
