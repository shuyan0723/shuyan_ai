import {
    useTodosStore
} from '../../store/todos'


const TodoList=()=>{
    const {
        todos,
        addTodo,
        toggleTodo,
        deleteTodo
    } = useTodosStore();
    return (
        <div>
           <ul>
            {todos.map((todo)=>(
                <li key={todo.id}>
                    <input type="checkbox" checked={todo.completed} onChange={()=>toggleTodo(todo.id)}/>
                    <span>{todo.text}</span>
                </li>
            ))}
           </ul>
        </div>
    )
}

export default TodoList