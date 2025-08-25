'use client';
import { useEffect, useState } from 'react';
import { Todo } from '@/types/todo';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // 组件挂载时获取待办事项列表
  useEffect(() => {
    fetchTodos();
  }, []);

  // 获取所有待办事项
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/todos');
      if (!res.ok) throw new Error('获取数据失败');
      
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
      alert('获取待办事项失败');
    } finally {
      setLoading(false);
    }
  };

  // 添加新待办事项
  const addTodo = async () => {
    if (input.trim() === '') {
      alert('请输入待办事项内容');
      return;
    }

    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: input,
        }),
      });
      
      if (!res.ok) throw new Error('添加失败');
      
      const newTodo = await res.json();
      setTodos([newTodo, ...todos]);
      setInput('');
    } catch (error) {
      console.error('Error adding todo:', error);
      alert('添加待办事项失败');
    }
  };

  // 删除待办事项
  const deleteTodo = async (id: number) => {
    if (!confirm('确定要删除这个待办事项吗？')) return;

    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('删除失败');
      
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('删除待办事项失败');
    }
  };

  // 切换待办事项完成状态
  const toggleTodo = async (id: number, completed: boolean) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !completed,
        }),
      });
      
      if (!res.ok) throw new Error('更新失败');
      
      const updatedTodo = await res.json();
      setTodos(todos.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
    } catch (error) {
      console.error('Error updating todo:', error);
      alert('更新待办事项失败');
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">我的待办事项</h1>
        
        {/* 添加新待办事项的表单 */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="添加新的待办事项..."
            className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            onClick={addTodo}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            添加
          </button>
        </div>
        
        {/* 待办事项列表 */}
        {loading && todos.length === 0 ? (
          <div className="text-center py-4">加载中...</div>
        ) : todos.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            暂无待办事项，添加一个吧！
          </div>
        ) : (
          <ul className="space-y-3">
            {todos.map(todo => (
              <li
                key={todo.id}
                className="flex justify-between items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id, todo.completed)}
                    className="h-5 w-5 text-blue-500 rounded focus:ring-blue-400 mr-3"
                  />
                  <span
                    className={`cursor-pointer select-none ${
                      todo.completed ? 'line-through text-gray-500' : 'text-gray-800'
                    }`}
                    onClick={() => toggleTodo(todo.id, todo.completed)}
                  >
                    {todo.title}
                  </span>
                </div>
                
                <button
                  onClick={() => deleteTodo(todo.id)}
                  disabled={loading}
                  className="text-red-500 hover:text-red-700 disabled:opacity-50"
                  title="删除待办事项"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
