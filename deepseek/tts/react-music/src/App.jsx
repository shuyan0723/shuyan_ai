// 导入React的useState和useRef钩子，用于状态管理和获取DOM引用
import { useState,useRef } from 'react'

// 导入组件样式文件
import './App.css'

// 定义App组件
function App() {
  // 火山引擎TTS配置：API令牌、应用ID和集群ID（需替换为实际有效凭证）
  const TOKEN = '4rwpJNSPLp4_LDIIoimOVgONWC4H8tFn';
  const APP_ID='4578890435';
  const CLUSTER_ID='volcano_tts'

  // 定义prompt状态，用于存储用户输入的文本内容（初始值为'大家好，我是小魔仙'）
  const [prompt,setPrompt]=useState('大家好，我是小魔仙')

  // 使用useRef创建audioPlayer引用，用于获取音频播放器DOM元素
  const audioPlayer=useRef(null)
  // 打印audioPlayer引用（开发调试用）
  console.log(audioPlayer,'////');
  
  // 定义播放音乐的函数
  const playMusic = () => {
    // 打印audioPlayer引用（开发调试用）
    console.log(audioPlayer,'+++');
    
    console.log('play music');
    // 调用音频元素的play方法开始播放
    audioPlayer.current.play()
  }
  // 定义生成音频的函数（当前未完成实现）
  const generateAudio =  () => {
    // 设置语音类型为男性孙悟空（需根据实际需求调整）
    const voiceName="zh_male_sunwukong_mars_bigtts";
    const endpoint ="/tts/api/v1/tts"// TTS服务接口地址

    // 定义请求头，包含内容类型和认证信息
    const headers={
      'Content-Type':'application/json',
      Authorization:`Bearer ${TOKEN}`,
    }
    // 注意：此处缺少实际调用TTS接口的fetch请求逻辑，需补充以生成音频URL
  }

  return (
    <div className='container'>
      <div>
        <label>Prompt</label>
        {/* 点击按钮触发生成并播放音频（当前仅触发generateAudio函数） */}
        <button onClick={generateAudio}>生成并播放</button>
        {/* 文本输入框，绑定prompt状态，允许用户输入需要转换为语音的文本 */}
        <textarea
        className='input'
        value={prompt}
        onChange={(e)=>setPrompt(e.target.value)}
        >
        </textarea>
      </div>
      {/* 音频播放器，通过ref关联到audioPlayer引用，初始src为本地测试音频 */}
      <audio ref={audioPlayer} src="/sounds/snare.wav"></audio>
      {/* 冗余的音频标签（无实际作用，建议删除） */}
      <audio src="/sounds/snare.wav">
    
      </audio>
      {/* 注释掉的播放按钮（可取消注释以单独触发播放） */}
      {/* <button onClick={playMusic}>播放</button> */}
    </div>
  )
}

// 导出App组件
export default App
