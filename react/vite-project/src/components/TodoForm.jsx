// 导入 React 的 useState Hook（用于管理组件状态）
import { useState } from 'react'

// 定义 TodoForm 组件，接收父组件传递的 onAdd 回调函数（用于添加待办事项）
function TodoForm(props) {
    // 从 props 中解构出 onAdd（父组件传递的添加待办的函数）
    const onAdd = props.onAdd;
    // 使用 useState 定义输入框的状态：text（输入内容）和 setText（更新输入内容的函数）
    // 初始值为 '打吃鸡'（输入框默认显示的提示文字）
    const [text, setText] = useState('打吃鸡')

    // 处理表单提交的函数（当用户点击提交按钮时触发）
    const handleSubmit = (e) => {
        // 阻止表单默认的提交行为（避免页面刷新或跳转到 action 地址）
        e.preventDefault();
        // 调用父组件传递的 onAdd 函数，将当前输入的 text 作为参数传递（添加新待办）
        onAdd(text);
        // 注意：这里可以添加清空输入框的逻辑（如 setText('')），当前代码未实现
    }

    // 处理输入框内容变化的函数（当用户输入时触发）
    const hangleChange = (e) => {
        // 获取输入框的当前值（e.target.value），并更新 text 状态
        setText(e.target.value);
    }

    // 渲染表单界面：包含一个输入框和提交按钮
    return (
        <form action="http://www.baidu.com" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="请输入代办事项"
                value={text}        // 输入框的值由 text 状态控制（响应式）
                onChange={hangleChange}  // 输入变化时调用 hangleChange 更新状态
            />
            <button>提交</button>
        </form>
    )
}

// 导出组件，供其他文件引用
export default TodoForm;