import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import htmlMinify from './plugins/vite-plugin-html-minify';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    htmlMinify()
  ],
})
