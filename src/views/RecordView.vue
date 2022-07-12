<script lang="ts" setup>
import { ref } from "vue";
import { invoke } from "@tauri-apps/api";
import TickTimer, { TimerHandle } from "@/components/TickTimer.vue";
import useMemo from "@/stores/useMemo";
import { useRouter } from "vue-router";
import { ValidSignalKey } from "@/scripts/useMapper";
import { useNotification } from "@/scripts/useNotification";

const configMemo = useMemo()

// region 计时器
const timerHandle = ref<TimerHandle>({
    start: () => {
    },
    stop: () => {
    }
})
const bindTimerHandle = (handle: TimerHandle) => {
    timerHandle.value = handle
}
// endregion

// region 返回
const router = useRouter()
const back = () => {
    router.push({
        name: 'Home'
    })
}
// endregion

// region 导出
const record_string = ref('')
const output = () => {
    if(record_string.value === '') {
        useNotification('暂无录制记录')
    }
    else {
        console.log('录制结果字符串: ', record_string.value)
    }
}
// endregion

// region 设置停止录制按钮
const ifSetting = ref(false)
const updateSignal = (code: string, name: string) => {
    configMemo.updateSignalKeyCode(code)
    ifSetting.value = false
    useNotification(`停止键修改为: ${ name }`)
}
// endregion

// region 录制
// 录制键盘
const record_keyboard = () => {
    // 启动下次录制前先重置
    record_string.value = ''

    // 启动录制: 阻塞线程
    timerHandle.value.start()
    configMemo.setScrollMessage('录制中...')
    invoke<string>('record_keyboard', { signal: configMemo.signalKeyCode })
        .then(res => {
            timerHandle.value.stop()
            record_string.value = res
            useNotification('录制结束, 使用导出按钮保存记录')
        })
        .catch(err => {
            timerHandle.value.stop()
            useNotification('录制键盘行为出错')
        })
}
// 录制鼠标
const record_mouse = () => {
    // 启动下次录制前先重置
    record_string.value = ''

    // 启动录制: 阻塞线程
    timerHandle.value.start()
    invoke<string>('record_mouse', { signal: configMemo.signalKeyCode })
        .then(res => {
            timerHandle.value.stop()
            record_string.value = res
            useNotification('录制结束, 使用导出按钮保存记录')
        })
        .catch(err => {
            timerHandle.value.stop()
            useNotification('录制鼠标行为出错')
        })
}
// endregion
</script>

<template>
    <div class="record-view" data-tauri-drag-region>
        <div class="timer">
            <TickTimer @tick-ready="bindTimerHandle"/>

            <div class="operators">
                <div class="back" @click="back">返回</div>
                <div class="output" title="将记录导出为文件用于播放">导出</div>
                <div class="signal">
                    <span title="按下指定按键后停止录制">停止键:</span>
                    <span class="underlined" title="点击设置停止键"
                          @click="ifSetting = !ifSetting">
                    {{ configMemo.signalKeyCode }}
                </span>
                    <div class="custom-selector" v-if="ifSetting">
                        <div class="fake-option" :title="item.name"
                             v-for="item in ValidSignalKey" :key="item.code"
                             @click="updateSignal(item.code, item.name)">
                            {{ item.name }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="records">
            <div class="record-btn" @click="record_keyboard">录制键盘</div>
            <div class="record-btn" @click="record_mouse">录制鼠标</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use "src/styles/mixin";

.record-view {
    position: relative;
    width: calc(100% - 1rem);
    height: calc(100% - 1rem);
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .timer {
        position: relative;
        width: calc(100% - 5.5rem);
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;

        .operators {
            position: relative;
            width: 100%;
            height: 2rem;
            font-size: 0.875rem;
            display: flex;
            align-items: flex-end;
            justify-content: space-between;

            .back, .output {
                position: relative;
                width: calc(2.5rem - 2px);
                height: calc(1.5rem - 2px);
                border: solid 1px var(--border-color);
                border-radius: 2px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;

                &:hover {
                    background-color: var(--background-color__dark);
                }
            }

            .signal {
                position: relative;
                height: calc(1.5rem - 2px);
                display: flex;
                align-items: center;
                justify-content: center;

                .underlined {
                    position: relative;
                    text-decoration: underline;
                    cursor: pointer;
                }

                .custom-selector {
                    @include mixin.scrollBarStyle();
                    position: absolute;
                    z-index: 100;
                    width: 4rem;
                    max-height: 5rem;
                    left: calc(100% + 5px);
                    bottom: 0;
                    border: solid 1px var(--border-color);
                    background-color: var(--background-color);
                    font-size: 0.75rem;
                    overflow: hidden auto;

                    .fake-option {
                        width: calc(100% - 0.5rem);
                        padding: 0 0.25rem;
                        cursor: pointer;

                        &:hover {
                            background-color: var(--background-color__dark);
                        }
                    }
                }
            }
        }
    }

    .records {
        position: relative;
        width: 5rem;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

        .record-btn {
            position: relative;
            width: calc(5rem - 2px);
            height: calc(1.5rem - 2px);
            border: solid 1px var(--border-color);
            border-radius: 2px;
            user-select: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;

            &:hover {
                background-color: var(--background-color__dark);
            }
        }
    }
}
</style>