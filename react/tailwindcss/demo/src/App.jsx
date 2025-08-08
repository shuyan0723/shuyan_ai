import { useState } from 'react'
import './App.css'

function App() {
  return (
     <div className='max-w-xs rounded-lg overflow-hidden bg-white shadow-md
      transition-all duration-300 hover:shadow-lg hover:scale-105 mx-auto my-8 p-4'>
    {/* 容器元素 - 设置最大宽度、圆角、溢出隐藏、背景色和过渡效果 */}
      {/* max-w-xs: 设置最大宽度为 xs 尺寸(通常为20rem/320px) */}
      {/* rounded-lg: 设置大圆角 */}
      {/* overflow-hidden: 隐藏溢出内容 */}
      {/* bg-white: 设置背景色为白色 */}
      {/* shadow-md: 添加中等阴影 */}
      {/* transition-all: 为所有属性添加过渡效果 */}
      {/* duration-300: 过渡持续时间300毫秒 */}
      {/* hover:shadow-lg: 悬停时添加大阴影效果 */}
      {/* hover:scale-105: 悬停时稍微放大 */}
      {/* mx-auto: 水平居中 */}
      {/* my-8: 垂直外边距为8 */}
      {/* p-4: 内边距为4 */}
      <div className='relative'>
        <img src="https://ts1.tc.mm.bing.net/th/id/OIP-C.Cps37NJd4QqA_DXXNLkv9gHaKY?rs=1&pid=ImgDetMain&o=7&rm=3" alt="" 
        className='w-full h-48 object-cover'
        />
         <span className="absolute top-2 left-2 bg-red-100 text-white text-xs font-bold px-2 py-1 rounded">

         </span>
         <button className='absolute top-2 right-2 text-gray-500 hover:text-red-500 transition-colors'>
          {/* 矢量图，数学形状来画图， 支持无限放大，不会模糊，区别于像素图 */}
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
         </button>
      </div>
     <div className='p-4'>
      <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
        Premium  Wireless Headphones
        Premium  Wireless Headphones
      </h3>
     </div>
    </div>
  )
}

export default App
