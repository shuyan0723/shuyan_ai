import TodoItem from "./TodoItem"
const TodoList=(props)=>{
   const{
      todos,
      onToggle,
      onDelete
   }=props
   return   (
    <ul>
    {/* TodoList */}
    {
      todos.length>0?(
        todos.map((todo)=>
          <TodoItem 
        todo={todo} 
        key={todo.id}
        onToggle={()=> onToggle(todo.id)}
        onDelete={()=> onDelete(todo.id)}
        />)
      ):(
         <p>暂无代办事项</p>
      )
    }
 
    </ul>
   )
}
export default TodoList