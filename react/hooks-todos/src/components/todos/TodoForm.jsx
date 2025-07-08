import { 
    useState  // 私有状态
} from 'react'; 

const TodoForm=({onAddTodo})=>{
    // 数据
    // props 参数数据
    // state 私有的数据
    // 单向数据流
    const [text,setText]= useState('')
    const handleSubmit=(e)=>{
        e.preventDefault();
        let result=text.trim(); // dry don't repeat youself
        if(!text) return;
        onAddTodo(result);
        setText('');//数据状态和界面状态一致要敏感 
    }
    // JSX 一定得有唯一最外层元素 树状 树来编译并解析JSX，编译为虚拟DOM
    return (
        <div>
            <h1 className='header'>TodoList</h1>
            <form className='todo-input' onSubmit={handleSubmit}>
          
             <input 
             type="text" 
             value={text}
             onChange={e => setText(e.target.value)}
             placeholder='Todo text'
             required
             />
             <button type='submit'>Add</button>
            </form>
        </div>
    )
}

export default TodoForm