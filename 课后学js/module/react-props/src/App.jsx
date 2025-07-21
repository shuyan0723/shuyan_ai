// import { useState } from 'react'
// import './App.css'
// function Son(props){
//   console.log(props);
//    // 父传子
//   return <div>这是子组件,{props.children}</div>
//   // 子传父 核心思路：在子组件中调用父组件的函数并传递参数
  

// }
// function App() {
//   return (
//     <div>
//      <Son>
//       <span>this is span</span>
//      </Son>
//     </div>
//   )
// }
// export default App


//子传父 核心思路：在子组件中调用父组件的函数并传递参数

function Son(){
  const sonMsg='this is son msg'
  return (
    <div>
      this is son
      <button>sendMsg</button>
    </div>
  )
}
function App(){
  return(
    <div>
      this is App
      <Son/>
    </div>
  )
}
export default App