// 导入 React 的状态管理钩子（用于声明响应式状态）
import { useState } from 'react'
// 导入组件样式文件（CSS 模块）
import './App.css'

// 定义函数组件 App（React 应用的根组件）
function App() {
  // 数据状态初始化：声明待办事项列表状态（初始值为 ['吃饭', '睡觉', '打豆豆']）
  // useState 返回 [状态值, 状态更新函数]，此处通过数组解构赋值
  const [todos, setTodos] = useState(['吃饭', '睡觉', '打豆豆']); 
  
  // 声明标题状态（初始值为 '杭电俊杰'）
  // 注意：settitle 是状态更新函数（命名建议首字母大写，如 setTitle，更符合 React 规范）
  const [title, settitle] = useState('杭电俊杰'); 
  
  // 副作用：5 秒后更新状态（模拟异步数据变化）
  setTimeout(() => {
    // 更新待办事项列表（覆盖为新数组 ['考杭电']）
    setTodos(['考杭电']); 
    
    // 潜在问题：title 初始状态是字符串，但此处用数组 ['杭电俊杰'] 更新
    // 这会导致 <h1> 渲染时显示数组的字符串形式（如 "杭电俊杰" 可能变为数组的字符串表示）
    settitle(['杭电俊杰']); 
  }, 5000);

  // 渲染逻辑：返回 JSX 结构（React 组件的视图部分）
  return (
    <div>
      {/* 动态渲染标题（使用 title 状态值） */}
      <h1 className="title">{title}</h1>
      
      {/* 渲染待办事项表格 */}
      <table>
        <thead>
          <tr>
            <th>序号</th>
            <th>任务</th>
          </tr>
        </thead>
        <tbody>
          {/* 遍历 todos 数组，动态生成表格行 */}
          {/* map 方法返回 JSX 数组，每个 <tr> 需添加唯一 key（此处用 index 作为标识） */}
          {todos.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td> {/* 序号（数组索引 +1） */}
              <td>{item}</td> {/* 任务内容（数组元素） */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// 导出 App 组件（作为应用入口）
export default App