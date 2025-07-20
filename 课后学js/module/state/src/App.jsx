import { useState } from 'react'
import './App.css'
// import App from'./main.jsx'
function App() {
  // 修改对象状态
  // const [form, setForm] = useState({
  //   name:'jack'
  // })
  // const changeForm=()=>{
  //   // 错误写法：直接修改
  //   // form.name='rose'
  //   // 正确写法:setForm 传入一个全新对象
  //   setForm({
  //     ...form,
  //     name:'rose'
  //   })
  // }
  const style={
      color:'blue',
       fontSize:'50px',
  }
  return (
    <div>
     {/* <button onClick={changeForm}>修改名字{form.name}</button> */}
      {/* 行内控制样式 */}
     {/* <span style={{color:'red',fontSize:'50px'}}>this is a span</span> */}
     <span style={style}>this is a span</span>
     {/* 通过className类名控制 */}
     <span className='foo'>this is class foo</span>
    </div>
  )
}

export default App
