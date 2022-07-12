import { defineStore } from "pinia";

export default defineStore({
    id: 'memo',
    state() {
        return {
            alwaysOnTop: JSON.parse(localStorage.getItem('alwaysOnTop') ?? 'false') as boolean,
            globalAlpha: JSON.parse(localStorage.getItem('globalAlpha') ?? '1'),
            scrollMessage: '',
            signalKeyCode: localStorage.getItem('signalKeyCode') ?? 'Escape',
        }
    },
    actions: {
        toggleAlwaysOnTop() {
            this.alwaysOnTop = !this.alwaysOnTop
            localStorage.setItem('alwaysOnTop', JSON.stringify(this.alwaysOnTop))
        },
        updateGlobalAlpha(val: number) {
            if(val == this.globalAlpha) return;

            if(val >= 1) this.globalAlpha = 1
            else if(val <= 0.1) this.globalAlpha = 0.1
            else this.globalAlpha = val

            // 可采用 debounce
            localStorage.setItem('globalAlpha', JSON.stringify(this.globalAlpha))
        },
        setScrollMessage(msg: string) {
            this.scrollMessage = msg
        },
        updateSignalKeyCode(code: string) {
            if(code === this.signalKeyCode) return;

            this.signalKeyCode = code
            localStorage.setItem('signalKeyCode', this.signalKeyCode)
        },
    }
})