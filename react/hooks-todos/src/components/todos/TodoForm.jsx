import { 
    useState  // 私有状态
} from 'react'; 
const TodoForm=()=>{
    // JSX 一定得有唯一最外层元素 树状 树来编译并解析JSX，编译为虚拟DOM
    return (
        <div>
            <h1 className='header'>TodoList</h1>
            <form>

            </form>
        </div>
    )
}

export default TodoForm