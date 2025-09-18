import {
  createRouter,
  createWebHistory
} from 'vue-router';
import { useUserStore } from '@/store/user';

import type {RouteRecordRaw} from 'vue-router'


const routes:RouteRecordRaw[]=[
    {
        path:'/login',
        name:'login',
        component:()=>import('@/views/Login.vue')
    },
    {
        path:'/',
        name:'home',
        component:()=>import('@/views/Home.vue'),
        meta:{
            requiresAuth:true
        }
    }
]

const router=createRouter({
    history:createWebHistory(),
    routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
    console.log('路过....');
    const userStore=useUserStore();
    if (to.meta.requiresAuth&& !userStore.isLogin) {
        // 修复重定向语法
        next('/login');
        // 或者使用命名路由：next({ name: 'login' })
    } else {
        next();
    }
})

export default router