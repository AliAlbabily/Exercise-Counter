import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        open: true // Add this line to open the browser automatically
    },
    base: '/Exercise-Counter/',
});