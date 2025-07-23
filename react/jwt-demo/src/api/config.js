import axios from 'axios';
axios.defaults.baseURL='http://localhost:5175/api';

// 请求  拦截器
axios.interceptors.request.use((config)=>{
    const token=localStorage.getItem('token')||"";
    // if(token){
        //  console.log('//////////');
        // let token =localStorage.getItem('token')||"";
         if(token){
            config.headers.Authorization=`Bearer ${token}`;
         }
        //  config.headers.Authorization='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMDAxIiwidXNlcm5hbWUiOiJhZG1pbiJ9LCJpYXQiOjE3NTMyMzk5MjksImV4cCI6MTc1Mzg0NDcyOX0.WcR6z7C77QTTTXGWGCfsYwZ98d1wIoOCUOERjeo5ews}';
        config.headers.Authorization=token;
    // }
    return config;
})

// 响应  拦截器
axios.interceptors.response.use((res)=>{
    console.log('|||||');
    return res;
})


export default axios;
