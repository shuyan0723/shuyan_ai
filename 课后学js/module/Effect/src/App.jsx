import { useState,useEffect } from 'react'
import './App.css'


const URL='https://www.baidu.com'
function App() {
  useEffect(()=>{
    // 额外的操作 获取频道列表
   async function getList(){
     const res=await fetch(URL)
     const list=await res.json()
     console.log(list);
    }
  },[])
  return (
    <div>
      <h1>Effect</h1>
    </div>
  )
}

export default App
