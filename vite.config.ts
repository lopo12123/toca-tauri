import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    clearScreen: false,
    plugins: [ vue() ],
    envPrefix: [ 'VITE_', 'TAURI_' ],
    resolve: {
        alias: {
            "@": resolve("src")
        }
    },
    server: {
        port: 3000,
        strictPort: true
    },
    build: {
        target: [ 'es2021', 'chrome97' ],
    }
})
