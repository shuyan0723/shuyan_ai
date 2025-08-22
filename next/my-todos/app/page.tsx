'use client'
import { useState,useEffect } from 'react';
import {
  type Todo
} from '@/types/todo'

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

    const fetchTodos = async () => {
        const res = await fetch('/api/todos');
        const data = await res.json();
        setTodos(data);
    }
    const addTodo = async () => {
      if (input.trim() === '') return;
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: input,
          completed: false
        })
      });
      const newTodo = await res.json();
      setTodos([newTodo, ...todos]);
      setInput('');
    }

    const toggleTodo = async (id: number,completed:boolean) => {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          completed: !completed
        })
      });
      const updatedTodo = await res.json();
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
    }
     const deleteTodo = async (id: number) => {
      await fetch(`/api/todos/${id}`, {
        method: 'DELETE'
      });
      setTodos(todos.filter(todo => todo.id !== id));
    }

   return (
    <main className='max-w-xl max-auto p-6'>
       <h1 className='text-2xl font-bold mb-4'>待办事项</h1>
        <div className='flex gap-2 mb-4'>
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className='flex-1 p-2 border rounded'
            placeholder='添加新任务'
          />
          <button className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
          onClick={addTodo}
          >
            添加</button>
        </div>
        <ul className='space-y-2'>
          {
            todos.map((todo) => (
              <li key={todo.id} 
              className='flex items-center justify-between p-2 border rounded'
              >
                <span
                onClick={() => toggleTodo(todo.id,todo.completed)}
                className={`cursor-pointer select-none
                  ${todo.completed ? 'line-through text-gray-500' : ''}`}
                >{todo.title}</span>
               <button 
               onClick={() => deleteTodo(todo.id)}
               className='bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600'
               >x</button>
              </li>
            ))
            
          }

        </ul>
    </main>
   )
}
