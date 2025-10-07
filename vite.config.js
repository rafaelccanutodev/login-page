import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignore avisos específicos para ver o erro real
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return
        warn(warning)
      }
    },
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  resolve: {
    alias: {
      // Polyfills para módulos Node.js se necessário
      path: 'path-browserify',
      crypto: 'crypto-browserify',
      stream: 'stream-browserify'
    }
  },
  optimizeDeps: {
    exclude: [] // Adicione módulos problemáticos aqui
  }
})