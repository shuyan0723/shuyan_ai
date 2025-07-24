import { useState } from 'react'
// import './App.css'
// function Son(props){
//   console.log(props);
//    // 父传子
//   return <div>这是子组件,{props.children}</div>
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
// 使用状态提升实现兄弟组件通信 子传父，父传另外一个子
// function Son({onGetSonMsg}){
//   const sonMsg='this is son msg'
//   return (
//     <div>
//       this is son
//       <button onClick={()=>onGetSonMsg(sonMsg)}>sendMsg</button>
//     </div>
//   )
// }
// function App(){
//   const [msg,setMsg]=  useState('')
//   const getMsg=(msg)=>{
//     console.log(msg);   
//     setMsg(msg);
//   }
//   return(
//     <div>
//       this is App,{msg}
//       <Son onGetSonMsg={getMsg}/>
//     </div>
//   )
// }
// export default App


//1.通过子传父
// function A({onGetAName}){
//   const name= 'A name';
//   return (
//     <div>
//         this is A
//         <button onClick={()=>onGetAName(name)}>send</button>
//     </div>
//   )
// }

// function B({name}){
//   return (
//     <div>
//         this is B
//         {name}
//     </div>
//   )
// }
// function App(){
//   const [name,setName]=useState
//   const getAName=(name)=>{
//   console.log(name);
//   setName(name)
//   }
//   return (
//     <div>
//       this is App
//        <A onGetAName={getAName}/>
//        <B name={name}/>
//     </div>
//   )
// }
// export default App