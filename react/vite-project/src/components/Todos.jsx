// 定义 Todos 组件，用于渲染待办事项列表
// 接收父组件传递的 todos 数组（待办事项数据）
function Todos(props) {
    // 打印 props 到控制台（调试用，实际开发中可删除）
    console.log(props, '////');
    // 从 props 中解构出 todos（待办事项数组）
    const todos = props.todos;

    // 渲染待办列表：使用 ul 包裹，遍历 todos 数组生成 li 元素
    return (
        <ul>
            {
                // 使用 map 遍历 todos 数组，每个待办项渲染为一个 li
                // key 属性用于 React 识别列表项的唯一性（必须，通常用 id）
                todos.map(todo => (
                    <li key={todo.id}>{todo.text}</li>
                ))
            }
        </ul>
    )
}

// 导出组件，供其他文件引用
export default Todos;