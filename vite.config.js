import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
import eslint from 'vite-plugin-eslint'

// ----------------------------------------------------------------------

const PORT = 3000

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    eslint({
      // File patterns
      include: ['src/**/*.js', 'src/**/*.jsx'],
      exclude: ['node_modules/**', 'dist/**', 'public/**'],
      
      // Linting behavior
      lintOnStart: true, // Lint all files on server start
      cache: false, // Disable cache for real-time updates
      
      // Error and Warning handling
      emitWarning: true, // Show warnings in terminal
      emitError: true, // Show errors in terminal
      failOnError: false, // Don't stop dev server on errors
      failOnWarning: false, // Don't stop dev server on warnings
      
      // Output format
      formatter: 'stylish', // Better readability for terminal output
    }),
  ],

  server: { 
    port: PORT, 
    host: true,
    // Clear console on every HMR update
    hmr: {
      overlay: true, // Show errors as overlay in browser
    },
  },
  
  preview: { 
    port: PORT, 
    host: true 
  },
  
  // Suppress large chunk warnings
  build: {
    chunkSizeWarningLimit: 1000, // 1MB limit
    rollupOptions: {
      onwarn(warning, warn) {
        // Skip certain warnings
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return
        }
        warn(warning)
      },
    },
  },
  
  // Clear terminal on restart
  clearScreen: true,
})