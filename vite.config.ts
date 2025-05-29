// vite.config.ts
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [
    angular()
  ],
  optimizeDeps: {
    include: [
      '@angular/localize/init'
    ]
  }
});
