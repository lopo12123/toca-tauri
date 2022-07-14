<script lang="ts" setup>
import { ref } from "vue";
import { useNotification } from "@/scripts/useNotification";
import useMemo from "@/stores/useMemo";
import { xml2obj, XMLStruct } from "@/scripts/useXml";
import TickTimer, { TimerHandle } from "@/components/TickTimer.vue";
import { useRouter } from "vue-router";
import { invoke } from "@tauri-apps/api";

const configMemo = useMemo()

// region 计时器
const timerHandle = ref<TimerHandle>({
    start: () => {
    },
    stop: () => {
    },
    setLabel: () => {
    }
})
const bindTimerHandle = (handle: TimerHandle) => {
    timerHandle.value = handle
}
// endregion

// region 返回
const router = useRouter()
const back = () => {
    if(configMemo.isWorking) useNotification('正在录制/播放, 请结束后再试')
    else router.push({
        name: 'Home'
    })
}
// endregion

// region 载入文件
const type2name = {
    keyboard: '键盘行为',
    mouse: '鼠标行为',
    none: '未选择'
}
const action_type = ref<'keyboard' | 'mouse' | 'none'>('none')
const action_obj = ref<XMLStruct | null>(null)
const load_action = (type: 'keyboard' | 'mouse') => {
    if(configMemo.isWorking) useNotification('正在录制/播放, 请结束后再试')
    else {
        const ipt = document.createElement('input')
        ipt.type = 'file'
        ipt.accept = '.toca'
        ipt.onchange = () => {
            if(!ipt.files || ipt.files.length === 0) {
                useNotification('请选择记录文件')
            }
            else {
                configMemo.setScrollMessage('解析中...')
                action_type.value = type
                const reader = new FileReader()
                reader.onload = () => {
                    const try_parse = xml2obj(reader.result as string, type, true)

                    if(try_parse === 'EType') useNotification('文件类型错误')
                    else if(try_parse === 'EHash') useNotification('文件已被篡改')
                    else if(try_parse === 'EParse') useNotification('文件解析失败')
                    else {
                        action_obj.value = try_parse
                        timerHandle.value.setLabel(try_parse.Toca.action.till)
                    }

                    configMemo.setScrollMessage('')
                }
                reader.onerror = () => {
                    useNotification('文件读取失败')
                }
                reader.readAsText(ipt.files[0])
            }
        }
        ipt.click()
    }
}
// endregion

// region 自动播放
const start_display = () => {
    if(configMemo.isWorking) useNotification('正在录制/播放, 请结束后再试')
    else if(action_obj.value === null || action_type.value === 'none') useNotification('请先选择并载入文件')
    else {
        configMemo.setWorking(true)
        configMemo.setScrollMessage('播放中...')
        timerHandle.value.start(action_obj.value.Toca.action.till, 'decrease')
        invoke<boolean>(
            `display_${ action_type.value }_async`,
            {
                actionString: JSON.stringify(action_obj.value.Toca.action)
            })
            .then(res => {
                // timerHandle.value.stop()
                configMemo.setScrollMessage('')
                useNotification('播放结束, 可再次点击播放按钮进行重播')
                configMemo.setWorking(false)
            })
            .catch(err => {
                // timerHandle.value.stop()
                configMemo.setScrollMessage('')
                useNotification('播放出错')
                configMemo.setWorking(false)
            })
    }
}
// endregion
</script>

<template>
    <div class="display-view">
        <div class="dashboard">
            <TickTimer @tick-ready="bindTimerHandle"/>

            <div class="operators">
                <div class="back" @click="back">返回</div>
                <div class="auto-play" title="自动播放已载入的鼠标/键盘行为记录"
                     @click="start_display">
                    播放
                </div>
                <div class="curr-action">当前: {{ type2name[action_type] }}</div>
            </div>
        </div>
        <div class="displays">
            <div class="display-btn"
                 @click="load_action('keyboard')"
                 title="选择并载入键盘行为文件">
                载入键盘
            </div>
            <div class="display-btn"
                 @click="load_action('mouse')"
                 title="选择并载入鼠标行为文件">
                载入鼠标
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use "src/styles/mixin";

.display-view {
    position: relative;
    width: calc(100% - 1rem);
    height: calc(100% - 1rem);
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .dashboard {
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

            .back, .auto-play {
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

            .curr-action {
                position: relative;
                width: 6.25rem;
                height: 1.5rem;
                display: flex;
                align-items: center;
                justify-content: flex-start;
            }
        }
    }

    .displays {
        position: relative;
        width: 5rem;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

        .display-btn {
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

    .block {
        width: 50px;
        height: 50px;
        animation: shiny 0.3s infinite linear;

        @keyframes shiny {
            0% {
                background-image: linear-gradient(135deg,
                    #ccc0 0%,
                    #ccc 100%);
            }
            10% {
                background-image: linear-gradient(135deg,
                    #ccc 0%,
                    #ccc0 10%,
                    #ccc 100%);
            }
            20% {
                background-image: linear-gradient(135deg,
                    #ccc 0%,
                    #ccc0 20%,
                    #ccc 100%);
            }
            30% {
                background-image: linear-gradient(135deg,
                    #ccc 0%,
                    #ccc0 30%,
                    #ccc 100%);
            }
            40% {
                background-image: linear-gradient(135deg,
                    #ccc 0%,
                    #ccc0 40%,
                    #ccc 100%);
            }
            50% {
                background-image: linear-gradient(135deg,
                    #ccc 0%,
                    #ccc0 50%,
                    #ccc 100%);
            }
            60% {
                background-image: linear-gradient(135deg,
                    #ccc 0%,
                    #ccc0 60%,
                    #ccc 100%);
            }
            70% {
                background-image: linear-gradient(135deg,
                    #ccc 0%,
                    #ccc0 70%,
                    #ccc 100%);
            }
            80% {
                background-image: linear-gradient(135deg,
                    #ccc 0%,
                    #ccc0 80%,
                    #ccc 100%);
            }
            90% {
                background-image: linear-gradient(135deg,
                    #ccc 0%,
                    #ccc0 90%,
                    #ccc 100%);
            }
            100% {
                background-image: linear-gradient(135deg,
                    #ccc 0%,
                    #ccc0 100%);
            }
        }
    }
}
</style>