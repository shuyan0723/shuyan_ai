import { 
  useState,
  useEffect
} from 'react'
import './App.css'
import { 
  getTodos,
  getRepos
 } from '@/api'



function App() {
  // const [todos,setTodos] = useState([])
  const [repos,setRepos] = useState([])

    useEffect(()=>{
      const fetchData=async()=>{
        // const todoResult =await getTodos()
        // setTodos(todoResult.data.data)
        const repoResult =await getRepos()
        setRepos(repoResult.data)
        console.log(repoResult.data)
      }
      fetchData()
    },[])
  return (
    <>
      {
        repos.map(repo =>(
          <div key={repo.id}>
            {repo.name}
          </div>)
        )
      }
      {/* {
        todos.map(todo =>(
          <div key={todo.id}>
            {todo.title}
          </div>)
        )
      } */}
    </>
  )
}

export default App
