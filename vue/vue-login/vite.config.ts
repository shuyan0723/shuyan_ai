import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 简化mock配置，移除可能导致问题的选项
    viteMockServe({
      mockPath: 'src/mocks',  // 使用更简单的路径格式
      localEnabled: true,
      supportTs: true,
      watchFiles: true
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, "src")
    }
  }
})