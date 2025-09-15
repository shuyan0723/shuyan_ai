

import {
    createRouter,
    createWebHistory,
    type RouteRecordRaw
} from 'vue-router'
// 路由配置数组？
const rootRoutes:RouteRecordRaw[]=[
  {
    path:'/home',
    // 懒加载
    component:()=>import('@/views/HomePage/HomePage.vue'),
    name:'home'
  },
  {
    path:'/account',
    name:'account',
    component:()=>import('@/views/account/AccountPage.vue'),
  },
  {
    path:'/discount',
    name:'discount',
    component:()=>import('@/views/discount/DiscountPage.vue'),
  },
  {
    path:'/collection',
    name:'collection',
    component:()=>import('@/views/collection/CollectionPage.vue'),
  },
  {
    path:'/trip',
    name:'trip',
    component:()=>import('@/views/trip/TripPage.vue'),
  },
]
const routes:RouteRecordRaw[]=[
   {
    path:'/',
    name:'App',
    component:()=>import('@/views/TheRoot.vue'),
    redirect:'/home',
    children:rootRoutes
   }
]


const router=createRouter({
    history:createWebHistory(),
    routes
})
export default router
