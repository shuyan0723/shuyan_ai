import {
    NextResponse     // res 
} from 'next/server' // api server
// ts是js的超集
import {type Todo} from '@/app/types/todo'


interface Todo{
    id:number;
    text:string;
    completed:boolean;
}

let todos:Todo[] = [
    {
        id:1,
        text:'广州',
        completed:false
    },
    {
        id:2,
        text:'北京',
        completed:true
    },
    {
        id:3,
        text:'上海',
        completed:false
    }
];
// todos.push({
//     id:1,
//     text:'todo1',
//     completed:false
// })
 // Restful 一切皆资源
 // 后端是向用户暴露资源的
 // method + 资源 URL定义规则
export async function GET(){
    return NextResponse.json(todos);
}

export async function POST(request:Request){
  // 获取请求体 body json
  const data=await request.json();
  // 核心的数据，函数的参数，返回值
  const newTodo={
    id:+Date.now(),
    text:data.text,
    // typescript 除了强类型外，代码提示更好，写起来更快
    completed:false
  }
  todos.push(newTodo);
  return NextResponse.json(newTodo);
  
} 

export async function PUT(request:Request){
    const data=await request.json();// 解析请求体
   todos=todos.map(todo=>
    todo.id===data.id?{...todo,completed:data.completed}:todo
);
    return NextResponse.json(todos);

}
// restful 简历
export async function DELETE(request:Request){
    const data=await request.json();
    todos=todos.filter(todo=>todo.id!==data.id);
    return NextResponse.json(todos);
    
}