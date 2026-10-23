import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// Production builds are served from https://himeshahuja.github.io/study-sesh/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/study-sesh/' : '/',
  plugins: [react()],
}));
