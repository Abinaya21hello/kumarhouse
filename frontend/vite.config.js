import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [react(), visualizer()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'axios'],
          ui: ['@material-ui/core', '@material-ui/icons'],
          utils: ['./src/utils/helpers.js'],
          // Add other dependencies or application parts to split into chunks
        },
      },
    },
    chunkSizeWarningLimit: 2000, // Keep the limit higher if necessary
  },
});
