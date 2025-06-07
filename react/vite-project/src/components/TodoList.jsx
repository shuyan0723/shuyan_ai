import '../todo.css'
import TodoForm from './TodoForm'
import Todos from './Todos'
function TodoList(){
    return(
   <div className="container">
    <h1 className="title">Todo List</h1>
    <TodoForm />
    <Todos />
   </div>
    )
}

export default TodoList;