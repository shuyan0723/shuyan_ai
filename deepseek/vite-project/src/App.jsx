import { useState } from 'react'

import './App.css'

function App() {
  console.log(import.meta.env.VITE_API_KEY)
  // react 内置的hook (钩子)函数  快速的解决一些问题 响应式的数据状态
  // useRef DOM 等对象的绑定
  const [content,setContent]=useState('')
  const [imgBase64Date,setImgBase64Date]=useState('')
  const [isValid,setIsValid]=useState(false)
  // base64? google 推出的编码方案
  const updateBase64Data = (e) => {
    // 拿到图片 e html5 js和操作系统本地文件交互
    const file = e.target.files[0]
    // console.log(file);
    if(!file) return;
    // html5 读的方式 读取文件
    const reader = new FileReader();
   reader.readAsDataURL(file);
   // 异步操作 
   reader.onload=()=>{
    // console.log(reader.result);
    setImgBase64Date(reader.result)
    setIsValid(true)
   }
  }

  const update = async() => {  //asynchronous异步
    if(!imgBase64Date) return;
    const endpoint ='http://api.moonshot.cn/v1/chat/completions';
  
  const headers={
    'Content-Type':'application/json',
    // 授权码 Bearer 一般都会带 
    'Authorization':`Bearer ${import.meta.env.VITE_API_KEY}`
  }
  // 实时反馈给用户
  setContent('正在生成...')
  const response = await fetch(
    endpoint,
    {
      method:'POST',
      headers:headers,// es6中 JSON key value 一样可以省略
      body:JSON.stringify({
        model:'moonshot-v1-8k-vision-preview',
        message:[
          {
            role:'user',
            content:[
              {
                type:"image_url",
                image_url:{
                  url:imgBase64Date
                }
              },
              {
                type:'text',
                text:'请详细描述图片的内容'
              }
            ]
          },
        ]
      })
}
)
        // 二进制字节流 json 也是异步的
        const data = await response.json()
        setContent(data.choices[0].message.content)
  }
  return (
    <div className="container">
      <div>
     <label htmlFor="fileInput">图片:</label>
     <input 
     type="file" 
     id="fileInput"
     className="input"
     accept=".jpeg,.jpg,.png,.gif"
     onChange={updateBase64Data}
     />
     <button onClick={update} disabled={!isValid}>提交</button>
     <div className="preview">
    {
      imgBase64Date && <img src={imgBase64Date} alt="" />
    }
     </div>
     <div>
     { content}
      </div>
    </div>
    </div>
  )
}

export default App
