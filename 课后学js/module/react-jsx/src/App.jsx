import { useState } from 'react'
import './App.css'

// 1.定义组件
// const Button=()=>{
//   // 业务组件逻辑
//   return (
//     <button>按钮</button>
//   )
// }

function App() {
  // 1. 调用useState添加一个状态变量
  // count 状态变量
  // setCount 修改状态变量的函数
  const [count,setCount]=useState(10)
  // let [count,setCount]=useState(10)
  // 2. 点击事件回调
  const handleClick=()=>{
    // setCount(count+1)
    // count++
    // console.log(count);
    setCount(count+1)
  }
  // 作用：1.用传入的新值修改count
  // 2.重新使用新的count渲染UI
  return (
    // <div className='App'>
    //   {/* 2.使用组件 */}
    //   {/* 自闭和 */}
    //   <Button />
    //   {/* 成对标签 */}
    //   <Button>按钮</Button>
    // </div>
  
    <div>
         <button onClick={handleClick}>{count}</button>
    </div>
  )
}

export default App
