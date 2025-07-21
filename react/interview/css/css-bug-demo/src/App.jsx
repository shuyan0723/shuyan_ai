import { useState } from 'react'
import './App.css'
import AnotherButton from './components/AnotherButton'
// import 运行  路由懒加载 后面覆盖前面
import Button from './components/Button'


function App() {

  return (
    <>
     <AnotherButton />
       <Button />
      
    </>
  )
}

export default App
