import { 
    useState ,
    useEffect
} from 'react'

export const useTodos = () => {
    const [todos,setTodos]=useState(JSON.parse(
        localStorage.getItem('todos') 
        ))
        useEffect(()=>{
            // console.log('/////');
            // 接受字符串,
            // window.localStorage.setItem('todos',todos)
            localStorage.setItem('todos',JSON.stringify(todos))
         },[todos])
            // 新增todo
   const addTodo=(text)=>{
        // setTodo
        // 数据状态是对象的时候
        setTodos([
            ...todos,
            {
              id:Date.now(),
              text,
              inComplete:false

            }
        ])
   }
   const onToggle=(id)=>{
        console.log(id);
        for(let i=0;i<todos.length;i++){
          if(todos[i].id===id){
            todos[i].isComplete=!todos[i].isComplete
          }
        }
        // state 是对象或数组的时候 
        setTodos([...todos])
        return;
      // todo 数组找打id 为id, isComplete !isComplete
      // 响应式？ 返回一个全新的todos
      setTodos(
   todos.map(
      todo=>todo.id===id 
      ? {...todo,isComplete:!todo.isComplete}
      : todo
      ))
   }
   const onDelete=(id)=>{
      setTodos(
          todos.filter(todo=>todo.id!==id)
      )
   }

        return {
            todos,
            setTodos,
            addTodo,
            onToggle,
            onDelete
        }
}

 


