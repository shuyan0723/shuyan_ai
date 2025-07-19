import { 
  useState,
  useEffect
} from 'react'
import './App.css'

function App() {
   const [todos,SetTodos]=useState([
    {
      id:1,
      title:'标题1',
    },
    {
      id:2,
      title:'标题2',
    },
     {
      id:3,
      title:'标题3',
     },
   ])
   useEffect(()=>{
    setTimeout(()=>{
      // SetTodos(prev=>prev.map(todo=>{
      //   if(todo.id===1) return {
      //     ...todo,
      //     title:'标题修改了',
      //   }
      //   return todo
      // }))
      // SetTodos(prev=>[
      //   ...prev,
      //   {
      //     id:4,
      //     title:'标题4',
      //   }
      // ])
      SetTodos(prev=>[
        {
          id:4,
          title:'标题4'
        },
        ...prev
      ])
    },3000)
    // console.log('todos发生了变化')
   },[])

  return (
    <ul>
        {
          todos.map((todo,index)=>(
            <li key={index}>{todo.title}</li>
          ))
        }
    </ul>
  )
}

export default App
