<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

export type TimerHandle = {
    start: (initial_ms: number, to: 'increase' | 'decrease') => void,
    stop: () => void
}

const emits = defineEmits<{
    (ev: 'tickReady', handle: TimerHandle): void
}>()

const hour = ref(0)
const min = ref(0)
const sec = ref(0)
const dot_sec = ref(0)

const isTiming = ref(false)
const timerId = ref<any>(-1)
const startTick = (initial_ms: number, to: 'increase' | 'decrease') => {
    // 初始化
    // 1h = 60 * 60 * 1_000 ms
    hour.value = Math.floor(initial_ms / 3_600_000)
    initial_ms %= 3_600_000
    // 1min = 60 * 1_000 ms
    min.value = Math.floor(initial_ms / 60_000)
    initial_ms %= 60_000
    // 1sec = 1_000 ms
    sec.value = Math.floor(initial_ms / 1_000)
    initial_ms %= 1_000
    // 0.1sec = 100 ms
    dot_sec.value = Math.floor(initial_ms / 100)

    // 增/减
    if(to === 'increase') {
        timerId.value = setInterval(() => {
            if(dot_sec.value < 9) dot_sec.value += 1
            // 进位 1s
            else {
                dot_sec.value = 0

                if(sec.value < 59) sec.value += 1
                // 进位 1min
                else {
                    sec.value = 0

                    if(min.value < 59) min.value += 1
                    // 进位 1hour
                    else {
                        min.value = 0

                        hour.value = hour.value + 1
                    }
                }
            }
        }, 100)
    }
    else if(to === 'decrease') {
        timerId.value = setInterval(() => {
            if(dot_sec.value > 0) dot_sec.value -= 1
            // 借位 1s
            else {
                dot_sec.value = 9

                if(sec.value > 0) sec.value -= 1
                // 借位 1min
                else {
                    sec.value = 59

                    if(min.value > 0) min.value -= 1
                    // 借位 1hour
                    else {
                        if(hour.value > 0) {
                            min.value = 59
                            hour.value -= 1
                        }
                        else {
                            clearInterval(timerId.value)
                        }
                    }
                }
            }
        }, 100)
    }
    isTiming.value = true
}
const stopTick = () => {
    clearInterval(timerId.value)
    isTiming.value = false
}

onMounted(() => {
    emits('tickReady', { start: startTick, stop: stopTick })
})
onBeforeUnmount(() => {
    stopTick()
})
</script>

<template>
    <div class="tick-timer">
        <div class="hour">
            {{ hour > 9 ? hour : ('0' + hour) }}
        </div>
        <span :class="['ticker', isTiming ? 'tick' : '']">:</span>
        <div class="min">
            {{ min > 9 ? min : ('0' + min) }}
        </div>
        <span :class="['ticker', isTiming ? 'tick' : '']">:</span>
        <div class="sec">
            {{ sec > 9 ? sec : ('0' + sec) }}
        </div>
        <span :class="['ticker', isTiming ? 'tick' : '']">.</span>
        <div class="dot-sec">
            {{ dot_sec }}
        </div>
    </div>
</template>

<style lang="scss" scoped>
.tick-timer {
    position: relative;
    width: 6rem;
    height: 2rem;
    font-size: 1.5rem;
    font-family: UniDream-LED;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .ticker {
        margin: 0 1px;
    }

    .tick {
        animation: tick-tick 1s infinite;
        @keyframes tick-tick {
            0% {
                opacity: 1;
            }
            50% {
                opacity: 1;
            }
            51% {
                opacity: 0;
            }
            100% {
                opacity: 0;
            }
        }
    }
}
</style>