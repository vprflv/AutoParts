
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],

    test: {
        environment: 'jsdom',
        globals: true,
        include: ['**/*.{test,spec}.{ts,tsx}'],
        exclude: ['**/node_modules/**', '**/.next/**', '**/dist/**'],


        alias: {
            '@': path.resolve(__dirname, './src'),
            '@/': path.resolve(__dirname, './src'),
            '@/src': path.resolve(__dirname, './src'),
        },
    },

    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});