import { useState } from 'react'
function TodoForm(props) {
    const onAdd=props.onAdd;
    const [text,setText]=useState('打吃鸡')

    const handleSubmit=(e)=>{
        //阻止默认提交行为
        //由js 来控制
        e.preventDefault();//event api
        // console.log(text);
        onAdd(text)
        //todos? 打报告 
    }
    const hangleChange=(e)=>{
        // console.log(e.target.value);
        setText(e.target.value)

    }
  return (
   
    <form action ="http://www.baidu.com" onSubmit={handleSubmit}>
    <input
     type="text"
     placeholder="请输入代办事项"
     value={text}
     onChange={hangleChange}
     />
     <button>提交</button>
      </form>
  )
}
export default TodoForm;