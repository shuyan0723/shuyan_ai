import {
    defineStore
} from 'pinia'

export const useUserStore = defineStore('user',{
    state:()=>({
        // isLogin:false,
       token:localStorage.getItem('token') || '',
       username:localStorage.getItem('username') || ''
    }),
    actions:{
        setToken(token:string){
            this.token=token;
            localStorage.setItem('token',token);
        },
        setUsername(user:string){
            this.username=user;
            localStorage.setItem('username',user);
        },
        logout(){
            this.token='';
            this.username='';
            localStorage.removeItem('token');
            localStorage.removeItem('username');
        },
    },
    // 计算属性 依赖于响应式状态计算后的结果
    // useMemo 
    getters:{
        isLogin():boolean{
            return !!this.token; 
        }
    }
})