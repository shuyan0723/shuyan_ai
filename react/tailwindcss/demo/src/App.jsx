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
      {/* // 相对定位容器 - 作为子元素的定位基准 */}
      <div className='relative'>
        {/* 产品图片 - 使用外部URL加载 */}
        <img 
          src="https://ts1.tc.mm.bing.net/th/id/OIP-C.Cps37NJd4QqA_DXXNLkv9gHaKY?rs=1&pid=ImgDetMain&o=7&rm=3" 
          alt="产品图片"  // 添加图片描述以提高可访问性
          className='w-full h-48 object-cover'  // w-full: 宽度100%填满父容器; h-48: 高度固定为48像素; object-cover: 保持图片比例并裁剪超出部分
        />
         {/* // 标签元素 - 通常用于显示产品状态(如热销、新品等) */}
         <span 
           className="absolute top-2 left-2 bg-red-100 text-white text-xs font-bold px-2 py-1 rounded" 
           // absolute: 绝对定位; top-2: 距离顶部2个单位; left-2: 距离左侧2个单位
           // bg-red-100: 背景色为浅红色; text-white: 文字颜色为白色
           // text-xs: 文字大小为超小; font-bold: 字体加粗
           // px-2: 水平内边距为2个单位; py-1: 垂直内边距为1个单位; rounded: 圆角边框
         >
           {/* 热销  // 建议添加标签文本，如"热销"、"新品"等 */}
         </span>
         {/* // 按钮元素 - 通常用于关闭或收藏功能 */}
         <button 
           className='absolute top-2 right-2 text-gray-500 hover:text-red-500 transition-colors' 
           // absolute: 绝对定位; top-2: 距离顶部2个单位; right-2: 距离右侧2个单位
           // text-gray-500: 正常状态下文字颜色为灰色
           // hover:text-red-500: 鼠标悬停时文字颜色变为红色
           // transition-colors: 颜色变化添加过渡效果，使颜色变化更平滑
         >
           {/* 矢量图，数学形状来画图， 支持无限放大，不会模糊，区别于像素图 */}
           {/* // SVG图标 - 这里使用的是一个内置的图标 */}
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
      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
        Noise-cancelling, 30-hour battery life, premium sound quality.
      </p>
      <div className='flex items-center mt-2'>
        <div className='flex'>
        <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <svg class="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>

            </div>
             <div class="mt-3 flex items-center justify-between">
          <span class="text-xl font-bold text-gray-900">$199.99</span>
          <span class="text-sm text-gray-500 line-through">$249.99</span>
        </div>

        
        <button class="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Add to Cart
        </button>

        <button class="mt-2 w-full text-blue-600 hover:text-blue-800 text-sm font-medium">
          Quick View
        </button>
      </div>
     </div>
    </div>
  )
}

export default App
