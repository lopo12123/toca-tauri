import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
    root: './src-docs',
    base: './',
    clearScreen: false,
    plugins: [ vue() ],
    server: {
        port: 3333,
    },
    build: {
        emptyOutDir: true,
        outDir: './docs',
    }
})
