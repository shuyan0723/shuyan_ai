import { useState } from 'react'
import './App.css'
import VirtualList from './components/VirtuaList';

const generateData=(count)=>
  Array.from({length:count},(_,i)=>({
    id:i,
    name:`Item ${i}`,
    description:`This is item number ${i},`
  }))

function App() {
  const data = generateData(10000);
  const renderItem=(item,index)=>(
    <div
    style={{
      padding:'10px',
      border:'1px solid #eee',
      backgroundColor:index%2===0?'#f9f9f9':'#fff',
    }}
    >
        <strong>[{item.id}]</strong>{item.name}
        <p
           style={{margin:'4px 0', fontSize:'0.9em',color:'#666'}}       
        >
          {item.description}
        </p>
    </div>
  )
  return (
    <div style={{padding:'20px',fontFamily:'Arial'}}>
      <h1>Virtual List Demo 1000000 条数据</h1>
      {/* 固定高度虚拟列表 */}
      <VirtualList
       data={data} 
       height={window.innerHeight-100}
       itemHeight={80}
       renderItem={renderItem} 
       overscan={3} /*预渲染上下各3个额外项 */
       />
    </div>
  )
}

export default App
