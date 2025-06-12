import { useState, useRef } from 'react'; // 导入React状态管理和DOM引用钩子
import './App.css'; // 导入组件样式文件

function App() {
  // 从Vite环境变量中获取火山引擎TTS服务所需配置（需在.env文件中配置）
  const { VITE_TOKEN, VITE_APP_ID, VITE_CLUSTER_ID } = import.meta.env; 
  // console.log(VITE_TOKEN, VITE_APP_ID, VITE_CLUSTER_ID, '////');

  // 管理输入文本状态（初始值为"大家好，我是黄新天"）
  const [prompt, setPrompt] = useState('大家好，我是黄新天');
  // 管理当前状态（ready: 初始状态, waiting: 等待中, done: 完成）
  const [status, setStatus] = useState('ready');
  // 创建音频元素的引用（用于控制音频播放）
  const audioRef = useRef(null);

  /**
   * 将Base64音频数据转换为可播放的Blob URL
   * @param {string} base64AudioData - Base64编码的音频数据
   * @returns {string} 可用于audio元素src属性的Blob URL
   */
  function createBlobURL(base64AudioData) {
    const byteArrays = []; 
    const byteCharacters = atob(base64AudioData); // 解码Base64为二进制字符串
    // 遍历字符转换为字节数组
    for (let offset = 0; offset < byteCharacters.length; offset++) { 
      const byteArray = byteCharacters.charCodeAt(offset); 
      byteArrays.push(byteArray); 
    } 
    // 创建Blob对象（指定音频类型为mp3）
    const blob = new Blob([new Uint8Array(byteArrays)], { type: 'audio/mp3' }); 
    return URL.createObjectURL(blob); // 生成Blob URL
  }

  /**
   * 调用火山引擎TTS接口生成并播放语音
   */
  const generateAudio = () => {
    const voiceName = "zh_male_sunwukong_mars_bigtts"; // 指定语音角色（孙悟空-火星大TTS）
    const endpoint = "/tts/api/v1/tts"; // TTS接口地址

    // 构造请求头（包含认证信息）
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer;${VITE_TOKEN}` // 使用环境变量中的令牌认证
    };

    // 构造请求体（根据火山引擎TTS接口文档定义参数）
    const payload = {
      app: {
        appid: VITE_APP_ID, // 应用ID（环境变量获取）
        token: VITE_TOKEN, // 应用令牌（环境变量获取）
        cluster: VITE_CLUSTER_ID // 集群ID（环境变量获取）
      },
      user: {
        uid: 'bearbobo' // 用户ID（示例值，可根据需求修改）
      },
      audio: {
        voice_type: voiceName, // 语音角色（与voiceName变量一致）
        encoding: 'ogg_opus', // 音频编码格式（可选ogg_opus、mp3等）
        compression_rate: 1, // 压缩率（1表示不压缩）
        rate: 24000, // 采样率（24000Hz）
        speed_ratio: 1.0, // 语速（1.0为正常速度）
        volume_ratio: 1.0, // 音量（1.0为正常音量）
        pitch_ratio: 1.0, // 音调（1.0为正常音调）
        emotion: 'happy' // 情感（可选happy、sad等）
      },
      request: {
        reqid: Math.random().toString(36).substring(7), // 生成随机请求ID（用于追踪请求）
        text: prompt, // 需要转换为语音的文本（来自状态prompt）
        text_type: 'plain', // 文本类型（plain表示纯文本）
        operation: 'query', // 操作类型（query表示查询）
        silence_duration: '125', // 静音时长（单位ms）
        with_frontend: '1', // 是否启用前端处理（1表示启用）
        frontend_type: 'unitTson', // 前端处理类型
        pure_english_opt: '1' // 英文优化（1表示启用）
      }
    };

    // 发送POST请求调用TTS接口
    fetch(
      endpoint,
      {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload) // 将请求体转换为JSON字符串
      }
    )
    .then(res => res.json()) // 解析响应为JSON
    .then(data => {
      // 生成音频Blob URL并设置到audio元素
      const url = createBlobURL(data.data);
      audioRef.current.src = url;
      audioRef.current.play(); // 自动播放音频
      setStatus('done'); // 更新状态为完成
    });
  };

  return (
    <div className="container">
      <div>
        <label>Prompt</label>
        <button onClick={generateAudio}>Generate & Play</button> {/* 点击触发音频生成 */}
        <textarea 
          className="input" 
          value={prompt} 
          onChange={(e) => setPrompt(e.target.value)} // 输入框内容变化时更新prompt状态
        />
      </div>
      <div className="out">
        <div>{status}</div> {/* 显示当前状态（ready/waiting/done） */}
        <audio ref={audioRef} /> {/* 音频元素（通过ref控制播放） */}
      </div>
    </div>
  );
}

export default App; // 导出App组件