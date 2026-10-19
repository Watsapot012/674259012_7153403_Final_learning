import { defineConfig } from 'vite';
<<<<<<< HEAD
=======
import tailwindcss from '@tailwindcss/vite';
>>>>>>> f6f9bce (Edit Update)
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
<<<<<<< HEAD
  plugins: [react()],
=======
  plugins: [react(), tailwindcss()],
>>>>>>> f6f9bce (Edit Update)
  server: {
    port: 5173,
    host: '0.0.0.0',
  },
});
