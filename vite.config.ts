import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    include: ['leaflet']
  },
  build: {
    rollupOptions: {
      external: [],
    }
  }
});
