import { 
  useState,
  useEffect,
  useLayoutEffect,
  useRef
 } from 'react'
import './App.css'

// function App() {
//   // 响应式对象
//   const boxRef = useRef();
//   console.log(boxRef.current,boxRef)

//   useEffect(()=>{
//          console.log('useEffect height',boxRef.current.offsetHeight);        
//   },[])
//   useLayoutEffect(()=>{
//          console.log('useLayoutEffect height',boxRef.current.offsetHeight);
//   },[])
//   return (
//     <>
//      <div ref={boxRef} style={{height:100}}></div>
//     </>
//   )
// }

// function App(){
//   const [content,setContent]=useState('做官要三思');
//   const ref=useRef();
  // useEffect(()=>{
  //   ref.current.style.height='200px';
  // },[])
  //  useLayoutEffect(()=>{
  //   // 阻塞渲染 同步的感觉
  //   setContent('做官要三思');
  //   ref.current.style.height='200px';
  //  },[content])
  
//   return (
//     <div ref={ref} style={{height:'50px',background:'red'}}>内容</div>
  // )
// }
// 弹窗组件
function Model(){
   const ref=useRef();
   useLayoutEffect(()=>{
    const height=ref.current.offsetHeight;
    ref.current.style.marginTop= `${(window.innerHeight-height)/2}px`
   },[])
   return <div ref={ref} style={{backgroundColor:'red',position:'absolute',height:'200px',width:'200px'}}>弹窗</div>
}
function App(){
    return (
      <>
      <Model/>
      </>
    ) 
}

export default App
