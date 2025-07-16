import {
    useReducer

} from 'react';
import todoRedecer from '../reducers/todoReducer'
// es6 参数的默认值
// {todos,} key:value 省略
// ``模版字符串 
// 解构[]=[] {}={}
// 展开运算符,... rest 运算符 
export function useTodos(initial = []){
    const [todos,dispatch]=useReducer(todoRedecer,initial)
    const addTodo = text => dispatch({type:'ADD_TODO',text})
    const toggleTodo = id =>dispatch({type:'TOGGLE_TODO',id})
    const removeTodo = id =>dispatch({type:'REMOVE_TODO',id})
    // const clearCompleted = ()=>dispatch({type:'CLEAR_COMPLETED'})
    return {
        todos,
        addTodo,
        toggleTodo,
        removeTodo
    }
}
