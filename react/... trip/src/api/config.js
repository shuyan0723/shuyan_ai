import axios from 'axios'

axios.defaults.baseURL='http://localhost:5173/api'
axios.interceptors.request.use((config)=>{
    // console.log(config,'config');
    // token
    return config
})
// 响应拦截
axios.interceptors.response.use((data)=>{
    // console.log(res,'res');
    return data.data
})


export default axios