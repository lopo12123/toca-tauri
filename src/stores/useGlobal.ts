import { defineStore } from "pinia";

export const useGlobal = defineStore({
    id: 'global',
    state() {
        return {
            theme: (localStorage.getItem('theme') ?? 'light') as 'light' | 'dark'

        }
    },
    actions: {
        toggleTheme() {
            this.theme = this.theme === 'light' ? 'dark' : 'light'
            localStorage.setItem('theme', this.theme)
        }
    }
})