import { AuthenticationError } from "openai"; // 若未使用可移除该导入


// 生成音频函数
export const generateAudio = (text) => {
    const token = import.meta.env.VITE_AUDIO_ACCESS_TOKEN;
    const appId = import.meta.env.VITE_AUDIO_APP_ID;
    const clusterId = import.meta.env.VITE_AUDIO_CLUSTER_ID;
    const voiceName = import.meta.env.VITE_AUDIO_VOICE_NAME;
    const endpoint = "/tts/api/v1/tts";
    // 修正：模板字符串使用反引号，正确拼接token
    const headers = {
        'Content-Type': 'application/json',
        Authentication: `Bearer ${token}` // 原错误：单引号无法解析${token}，改为反引号
    };
    // 修正：payload对象结构闭合
    const payload = {
        app: {
            appid: appId,
            token,
            cluster: clusterId
        },
        user: {
            uid: 'Bearbobo'
        },
        audio: {
            voice_name: voiceName,
            encoding: 'ogg_opus',
            compression_rate: 1,
            rate: 24000,
            speed_ratio: 1.0,
            volume_ratio: 1.0,
            pitch_ratio: 1.0,
            emotion: 'happy'
        }
    };

    // 可选：若需导出其他函数，取消注释并完善逻辑
    // export const generateAudioWithYm = () => {
    //   // 生成音频逻辑
    // };
}
// import {generateAudio} from ''
// import App from './App'
// 一个
// export