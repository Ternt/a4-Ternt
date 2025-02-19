import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': './source',
    },
  },
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      treeshake: true,
      output: {
        manualChunks: {
          react: ['react', 'react-dom', '@mantine/core', '@mantine/form', '@mantine/hooks'],
          reactThree: ['@react-three/fiber', '@react-three/drei'],
          three: ['three'],
        }
      }
    }
  },
  plugins: [react()]
})
