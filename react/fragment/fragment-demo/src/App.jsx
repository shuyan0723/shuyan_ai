import { 
  useState,
  Fragment   // 文档碎片
} from 'react'
import './App.css'

// function Demo(){
//   return (
//     // DOM 树多了一层不需要的节点，DOM解析性能下降，多迭代一层
//     <Fragment>
//       <h1>Hello</h1>
//       <p>你好</p>
//     </Fragment>
//   )
// }
function Demo({items}){
 return items.map(items =>(
        <Fragment key={items.id}>
          <h1>{items.name}</h1>
          <p>{items.content}</p>
        </Fragment>
      ))
   }
function App() {
     const items=[
      {
        id:1,
        name:'钟文城',
        content:'内容1'
      },
      {
        id:2,
        name:'赖泽阳',
        content:'内容2'
      }
     ]
  return (
    <>
      <Demo items={items}/>
    </>
  )
}

export default App
