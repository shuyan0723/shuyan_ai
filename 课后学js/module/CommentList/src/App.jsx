import { useState } from 'react'
import './App.css'

function App() {
  // 1.使用useState维护list
  // const [commentList, setCommentList] = useState(list)
  // 1.声明一个react状态
  // 2.核心绑定流程
  // 1.通过value属性绑定react状态
  // 2.通过onChange事件绑定react状态
   const [value, setValue] = useState('')
  
  return (
    <div>
     <input
    type='text'
    value={value}
    onChange={(e)=>setValue(e.target.value)}
   />
    </div>
  )
}

export default App
