import { useRef } from 'react'
import './App.css'

// 1.父组件传递数据 子组件标签身上绑定属性
// 2.子组件接受数据 props的参数
function Son(props){
  console.log(props);
  // props.name='李四'
  //  name:'父组件中的数据 age:'子组件中的数据'
  // 谁的数据谁负责修改
  return <div><h1>我是子组件{props.name}{props.age}{props.isMale}{props.list}{props.obj.name}</h1>{props.child}</div>
}
function App() {
  // const inputRef = useRef(null)
  // const showDom=()=>{
  //   console.dir(inputRef.current);
  // }
  const name='张三'
  // const age=17
  return (
    <div>
     {/* <input type='text' ref={inputRef} />
     <button onClick={showDom}>显示</button> */}
     123
     <Son 
     name={name} 
     age={17}
     isMale={true}
     list ={['vue','react','angular']}//数组
     obj={{name:'jack'}}
     cb={()=>{console.log(123);}}
     child={<span>this is a span</span>}
     
     />
    </div>
  )
}

export default App
