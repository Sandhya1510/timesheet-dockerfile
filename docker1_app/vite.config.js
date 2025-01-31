// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//    // adjust as per the actual path
//   plugins: [react()],
// })

import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html',  // Make sure this points to your actual index.html
    }
  },
  resolve: {
    alias: {
      crypto: 'crypto-browserify', // Ensure that the polyfill is used
    },
  },
});
