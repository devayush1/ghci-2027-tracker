import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/ghci-2027-tracker/',
  plugins: [react()],
  build: {
    outDir: 'docs',
  },
})
