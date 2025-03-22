import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'rc-picker/es/generate/moment': 'rc-picker/es/generate/dayjs'
    }
}
})
