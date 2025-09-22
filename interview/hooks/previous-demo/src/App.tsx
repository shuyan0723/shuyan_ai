import { useState } from 'react'
import './App.css'
import {
  usePrevious
} from './hooks/usePrevious'
function App() {
  const [count, setCount] = useState(0)
  const prevCount=usePrevious(count);
  console.log('prevCount',prevCount);
  return (
    <>
      <p>x看在:{count}</p>
      <p>上一次:{prevCount??"无"}</p>
      <button onClick={()=>setCount(count+1)}>增加</button>
    </>
  )
}

export default App
