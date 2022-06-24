import { defineStore } from "pinia";

export const useGlobal = defineStore({
    id: 'global',
    state() {
        return {
            theme: (localStorage.getItem('theme') ?? 'light') as 'light' | 'dark',
            elderMode: (localStorage.getItem('elderMode') ?? 'disable') as 'enable' | 'disable'
        }
    },
    actions: {
        toggleTheme() {
            this.theme = this.theme === 'light' ? 'dark' : 'light'
            localStorage.setItem('theme', this.theme)
        },
        toggleElderMode() {
            this.elderMode = this.elderMode === 'enable' ? 'disable' : 'enable'
            document.documentElement.className = 'elder-' + this.elderMode
            localStorage.setItem('elderMode', this.elderMode)
        }
    }
})