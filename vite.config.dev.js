import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import eslint from 'vite-plugin-eslint'
import svgr from 'vite-plugin-svgr'

// ----------------------------------------------------------------------
// This config shows ESLint errors only for files you're actively editing
// Use this when you have many existing ESLint errors
// ----------------------------------------------------------------------

const PORT = 3000

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    eslint({
      // Only check files when they're saved (not on startup)
      lintOnStart: false,

      // File patterns
      include: ['src/**/*.js', 'src/**/*.jsx'],
      exclude: ['node_modules/**', 'dist/**', 'public/**'],

      // Only show errors, not warnings (for cleaner output)
      emitWarning: false, // Set to true to see warnings
      emitError: true,

      // Don't fail the build
      failOnError: false,
      failOnWarning: false,

      // Use a compact formatter
      formatter: 'compact',

      // Cache for better performance
      cache: true,
    }),
  ],

  server: {
    port: PORT,
    host: true,
    hmr: {
      overlay: false, // Don't show overlay (less intrusive)
    },
  },

  preview: {
    port: PORT,
    host: true,
  },

  build: {
    chunkSizeWarningLimit: 1000,
  },

  clearScreen: true,
})
