import { useState } from 'react'
import './App.css'

function App() {
  // 数据状态初始化
  const [todos, setTodos] = useState(['吃饭', '睡觉', '打豆豆']); 
   const [title, settitle] = useState('杭电俊杰'); 
  setTimeout(() => {
    // setTodos(['吃饭', '睡觉', '打豆豆', '钓鱼']); // 正确调用 setTodos 函数
    setTodos(['杭电俊杰'])
    settitle(['杭电俊杰'])
  }, 5000);

  return (
    <div>
      <h1 className="title">{title}</h1>
      <table>
        <thead>
          <tr>
            <th>序号</th>
            <th>任务</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export default App