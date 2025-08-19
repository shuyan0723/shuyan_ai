import { 
  useState,
  useEffect 
} from 'react'
import './App.css'

function App() {
  // 实例化一个控制器
  let controller=new AbortController();
  useEffect(()=>{
    fetch('http://localhost:5174/api/banners',{
      // 接受一个信号
      signal:controller.signal
      // signal:AbortSignal.timeout(1000)
    })
      .then(res=>res.json())
      .then(data=>{
        console.log(data)
      })
  },[])
    const stop=()=>{
      controller.abort();
    }
  return (
    <>
      <button onClick={stop}>
        取消请求
      </button>
    </>
  )
}

export default App
