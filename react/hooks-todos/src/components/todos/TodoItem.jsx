const TodoItem = (props) => {
    const {
        id,
        text,
        isComplete,
        // onToggle,
    }=props.todo
    const { 
        onToggle,
        onDelete
     } = props 
    // const onDelete=()=>{
    //     // props.onDelete(id)
    // }
return (
    <div className="todo-item">
    <input type="checkbox" checked={isComplete} onChange={onToggle} />
     <span className={isComplete?'completed':''}>{text}</span>
      <button onClick={onDelete}>删除</button>
        </div>
    )
}
export default TodoItem