import path from 'path'
import checker from 'vite-plugin-checker'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'

// ----------------------------------------------------------------------

const PORT = 3000

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    checker({
      typescript: true,
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
        dev: { logLevel: ['error'] },
      },
      overlay: {
        position: 'tl',
        initialIsOpen: false,
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^src(.+)/,
        replacement: path.resolve(process.cwd(), 'src/$1'),
      },
      {
        find: '@Components',
        replacement: path.resolve(process.cwd(), 'src/Components'),
      },
      {
        find: '@Core',
        replacement: path.resolve(process.cwd(), 'src/Components/Core'),
      },
      {
        find: '@Modules',
        replacement: path.resolve(process.cwd(), 'src/Components/Modules'),
      },
      {
        find: '@Ui',
        replacement: path.resolve(process.cwd(), 'src/Components/Ui'),
      },
      {
        find: '@Container',
        replacement: path.resolve(process.cwd(), 'src/Container'),
      },
      {
        find: '@Services',
        replacement: path.resolve(process.cwd(), 'src/Services'),
      },
      {
        find: '@Redux',
        replacement: path.resolve(process.cwd(), 'src/Redux'),
      },
      {
        find: '@Reducers',
        replacement: path.resolve(process.cwd(), 'src/Redux/Reducers'),
      },
      {
        find: '@Assets',
        replacement: path.resolve(process.cwd(), 'src/Assets'),
      },
      {
        find: '@Constants',
        replacement: path.resolve(process.cwd(), 'src/Constants'),
      },
      {
        find: '@Hooks',
        replacement: path.resolve(process.cwd(), 'src/Hooks'),
      },
      {
        find: '@Utils',
        replacement: path.resolve(process.cwd(), 'src/Utils'),
      },
      {
        find: '@Themes',
        replacement: path.resolve(process.cwd(), 'src/Themes'),
      },
      {
        find: '@Routes',
        replacement: path.resolve(process.cwd(), 'src/Routes'),
      },
      {
        find: '@Localization',
        replacement: path.resolve(process.cwd(), 'src/Localization'),
      },
    ],
  },
  server: { port: PORT, host: true },
  preview: { port: PORT, host: true },
})
