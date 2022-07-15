<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, shallowRef } from "vue";
import type { TickRequest, TickResponse } from "@/components/ticker";
import { useNotification } from "@/scripts/useNotification";

export type TimerHandle = {
    start: (initial_ms: number, to: 'increase' | 'decrease') => void,
    stop: () => void,
    setLabel: (ms: number) => void
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
                    else if(hour.value > 0) {
                        min.value = 59
                        hour.value -= 1
                    }
                }
            }

            if(hour.value === 0 && min.value === 0 && sec.value === 0 && dot_sec.value === 0) stopTick()
        }, 100)
    }
    isTiming.value = true
}
const stopTick = () => {
    clearInterval(timerId.value)
    isTiming.value = false
}
// region 使用 worker 避免省电策略
const tickWorker = shallowRef<Worker | null>(null)
const startTickWorker = (initial_ms: number, to: 'increase' | 'decrease') => {
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
    tickWorker.value = new Worker(new URL('./ticker', import.meta.url), { type: 'module' })
    if(to === 'increase') {
        tickWorker.value.onmessage = (ev) => {
            const data: TickResponse = ev.data
            if(data.status === 'pending') {
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
            }
            else {
                useNotification('计时线程出错')
                isTiming.value = false
            }
        }
    }
    else if(to === 'decrease') {
        tickWorker.value.onmessage = (ev) => {
            const data: TickResponse = ev.data

            if(data.status === 'pending') {
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
                        else if(hour.value > 0) {
                            min.value = 59
                            hour.value -= 1
                        }
                    }
                }

                if(hour.value === 0 && min.value === 0 && sec.value === 0 && dot_sec.value === 0) stopTickWorker()
            }
            else {
                useNotification('计时线程出错')
                isTiming.value = false
            }
        }
    }

    isTiming.value = true
    tickWorker.value.postMessage({ cmd: 'start', duration: 100 } as TickRequest)
}
const stopTickWorker = () => {
    tickWorker.value?.terminate()
    tickWorker.value = null
    isTiming.value = false
}
// endregion
const setLabel = (ms: number) => {
    // 正在计时时禁止手动介入修改
    if(isTiming.value) return;

    // 1h = 60 * 60 * 1_000 ms
    hour.value = Math.floor(ms / 3_600_000)
    ms %= 3_600_000
    // 1min = 60 * 1_000 ms
    min.value = Math.floor(ms / 60_000)
    ms %= 60_000
    // 1sec = 1_000 ms
    sec.value = Math.floor(ms / 1_000)
    ms %= 1_000
    // 0.1sec = 100 ms
    dot_sec.value = Math.floor(ms / 100)
}

onMounted(() => {
    emits('tickReady', {
        start: startTickWorker,  // startTick,
        stop: stopTickWorker,  //stopTick,
        setLabel
    })
})
onBeforeUnmount(() => {
    // stopTick()
    stopTickWorker()
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