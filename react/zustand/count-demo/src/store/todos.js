// 全局状态模块化
import {
    create,
    
} from 'zustand';

export const useTodosStore = create((set)=>({
    todos:[
        {
            id:1,
            title:'学习react',
            completed:false
        },
        {
            id:2,
            title:'学习vue',
            completed:true
        }
    ],
    addTodo:(text)=>set((state)=>({
        todos:[
            ...state.todos,
            {
                id:state.todos.length+1,
                text,
                // title:text,
                completed:false
            }
        ]
    })),
    toggleTodo:(id)=>set((state)=>({
        todos:state.todos.map((todo)=>({
            ...todo,
            completed:todo.id===id?!todo.completed:todo.completed
        })),
        deleteTodo:(id)=>set((state)=>({
            todos:state.todos.filter((todo)=>todo.id!==id)
        }))
    }))
}))