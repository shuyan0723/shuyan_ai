import{
    // 响应式状态hooks
    useState // react 函数式编程 好用的以use 开头的函数
} from 'react';
import TodoForm from "./TodoForm"
import TodoList from "./TodoList"
const Todos=()=>{
    // 数据流管理
    // 父组件持有管理数据 props 传递数据 子组件通过props 自定义函数
    // 通知父组件
const [todos,setTodos]=useState([
    {
        id:1,
        text:'学习react hooks',
        isComplete:false
    },
    {
        id:2,
        text:'学习算法',
        isComplete:false
    },
])
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
        todo=>todo.id===id?
        {...todo,isComplete:!todo.isComplete}
        :todo
        ))
     }
     const onDelete=(id)=>{
        setTodos(
            todos.filter(todo=>todo.id!==id)
        )
     }
    return (
        <div className='app'>
            {/* 自定义事件 */}
            <TodoForm onAddTodo={addTodo} />
            <TodoList
             todos={todos}
             onToggle={onToggle}
             onDelete={onDelete}
             />
        </div>
    )
}

export default Todos