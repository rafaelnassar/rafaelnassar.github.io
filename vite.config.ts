import path from 'path'
import { defineConfig } from 'vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig(({ mode }) => ({
  plugins: [basicSsl()],
  server: {
    host: '::',
    port: 8080,
    https: true,
    hmr: {
      overlay: false,
    },
  },
  preview: {
    https: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}))
