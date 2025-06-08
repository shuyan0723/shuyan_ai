// 导入 React 的 useState Hook（用于管理组件状态）
import { useState } from 'react'
// 导入样式文件（用于定义组件样式）
import '../todo.css'
// 导入子组件：输入表单（TodoForm）和列表渲染（Todos）
import TodoForm from './TodoForm'
import Todos from './Todos'

// 定义主组件 TodoList
function TodoList() {
    // 使用 useState 定义三个状态：
    // 1. h1：测试用状态（初始值 'haha'），用于演示状态更新
    // 2. title：页面标题状态（初始值 'Todo list'）
    // 3. todos：待办事项数组状态（初始包含一个待办项：{id:1, text:'吃饭', completed:false}）
    const [h1, setHi] = useState('haha');
    const [title, SetTitle] = useState('Todo list')
    const [todos, setTodos] = useState([
        {
            id: 1,
            text: '吃水饺',
            completed: false
        }
    ])

    // 定义添加待办事项的函数（传递给 TodoForm 组件）
    const handleAdd = (text) => {
        // 使用 setTodos 更新 todos 状态：
        // 展开原数组（...todos），添加新待办项（id 为原数组长度+1，text 为输入内容）
        setTodos([
            ...todos,
            {
                id: todos.length + 1,
                text: text,
                completed: false
            }
        ])
    }

    // 渲染页面结构：
    // - 包含标题（显示 title 和 h1 状态）
    // - 嵌入 TodoForm 组件（传递 onAdd 回调用于添加待办）
    // - 嵌入 Todos 组件（传递 todos 数组用于渲染列表）
    return (
        <div className="container">
            <h1 className="title">{title} {h1}</h1>
            {/* 表单组件：通过 onAdd 属性传递添加待办的函数 */}
            <TodoForm onAdd={handleAdd} />
            {/* 列表组件：通过 todos 属性传递待办数据 */}
            <Todos todos={todos} />
        </div>
    )
}

// 导出主组件，作为页面入口
export default TodoList;