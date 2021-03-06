<script lang="ts" setup>
import { ref } from "vue";
import { invoke } from "@tauri-apps/api";
import TickTimer, { TimerHandle } from "@/components/TickTimer.vue";
import useMemo from "@/stores/useMemo";
import { useRouter } from "vue-router";
import { ValidSignalKey } from "@/scripts/useMapper";
import { useNotification } from "@/scripts/useNotification";
import { download_xml, obj2xml } from "@/scripts/useXml";
import { save } from "@tauri-apps/api/dialog";
import { writeTextFile } from "@tauri-apps/api/fs";

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
    if(configMemo.isWorking) {
        useNotification('正在录制/播放, 请结束后再试')
        return;
    }
    router.push({
        name: 'Home'
    })
}
// endregion

// region 导出
// 录制类型
const record_type = ref<'keyboard' | 'mouse'>('keyboard')
// 结果保存为字符串
const record_string = ref('')
// 导出为文件
const output = () => {
    if(configMemo.isWorking) {
        useNotification('正在录制/播放, 请结束后再试')
    }
    else if(record_string.value === '') {
        useNotification('暂无记录, 请先进行录制')
    }
    else {
        const xml_str = obj2xml(JSON.parse(record_string.value), record_type.value)

        if(xml_str === null) useNotification('事件记录解析出错')
        else download_xml(xml_str, record_type.value)
    }
}
// 使用 tauri-api 导出
const output_fs = () => {
    if(configMemo.isWorking) {
        useNotification('正在录制/播放, 请结束后再试')
    }
    else if(record_string.value === '') {
        useNotification('暂无记录, 请先进行录制')
    }
    else {
        const xml_str = obj2xml(JSON.parse(record_string.value), record_type.value)

        if(xml_str === null) useNotification('事件记录解析出错')
        else {
            const filename = `${ Date.now() }.${ record_type.value[0] }.toca`

            configMemo.setScrollMessage('导出中...')
            save({
                title: '选择文件保存位置',
                defaultPath: filename,
                filters: [ {
                    name: 'TOCA_RECORD_FILE',
                    extensions: [ 'toca' ]
                } ],
            })
                .then(dir => {
                    if(!dir) {
                        useNotification('请选择保存位置')
                        return Promise.reject('null')
                    }
                    else return writeTextFile(dir, xml_str)
                })
                .then(() => {
                    configMemo.setScrollMessage('')
                    useNotification('导出成功')
                })
                .catch((err) => {
                    configMemo.setScrollMessage('')
                    if(err !== 'null') useNotification('导出失败')
                })
        }
    }
}
// endregion

// region 设置停止录制按钮
const ifSetting = ref(false)
const startSetting = () => {
    if(configMemo.isWorking) {
        useNotification('正在录制/播放, 请结束后再试')
    }
    else ifSetting.value = !ifSetting.value
}
const updateSignal = (code: string, name: string) => {
    if(configMemo.isWorking) {
        useNotification('正在录制/播放, 请结束后再试')
    }
    else {
        configMemo.updateSignalKeyCode(code)
        ifSetting.value = false
        useNotification(`停止键修改为: ${ name }`)
    }
}
// endregion

// region 录制
// 录制键盘
const record_keyboard = () => {
    if(configMemo.isWorking) {
        useNotification('正在录制/播放, 请结束后再试')
    }
    else {
        // 加锁
        configMemo.setWorking(true)

        // 启动下次录制前先重置
        record_string.value = ''

        // 守卫 提示信息
        record_type.value = 'keyboard'
        timerHandle.value.start(0, 'increase')
        configMemo.setScrollMessage('录制中...')

        // 启动录制: 阻塞线程
        invoke<string>('record_keyboard_async', { signal: configMemo.signalKeyCode })
            .then(res => {
                record_string.value = res
                timerHandle.value.stop()
                configMemo.setScrollMessage('')
                useNotification('录制结束, 使用导出按钮保存记录')

                // 解锁
                configMemo.setWorking(false)
            })
            .catch(err => {
                console.log(err)
                timerHandle.value.stop()
                configMemo.setScrollMessage('')
                useNotification('录制键盘行为出错')

                // 解锁
                configMemo.setWorking(false)
            })
    }
}

// 录制鼠标
const record_mouse = () => {
    if(configMemo.isWorking) {
        useNotification('正在录制/播放, 请结束后再试')
    }
    else {
        // 加锁
        configMemo.setWorking(true)

        // 启动下次录制前先重置
        record_string.value = ''

        // 启动录制: 阻塞线程
        record_type.value = 'mouse'
        timerHandle.value.start(0, 'increase')
        configMemo.setScrollMessage('录制中...')
        invoke<string>('record_mouse_async', { signal: configMemo.signalKeyCode })
            .then(res => {
                record_string.value = res
                timerHandle.value.stop()
                configMemo.setScrollMessage('')
                useNotification('录制结束, 使用导出按钮保存记录')

                // 解锁
                configMemo.setWorking(false)
            })
            .catch(() => {
                timerHandle.value.stop()
                configMemo.setScrollMessage('')
                useNotification('录制鼠标行为出错')

                // 解锁
                configMemo.setWorking(false)
            })
    }
}
// endregion
</script>

<template>
    <div class="record-view" data-tauri-drag-region>
        <div class="dashboard">
            <TickTimer @tick-ready="bindTimerHandle"/>

            <div class="operators">
                <div class="back" @click="back">返回</div>
                <div class="output" title="将录制的记录导出, 可用于读取并播放"
                     @click="output_fs">
                    导出
                </div>
                <div class="signal">
                    <span title="按下指定按键后停止录制">停止键:</span>
                    <span class="underlined" title="点击设置停止键"
                          @click="startSetting">
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
            <div class="record-btn"
                 @click="record_keyboard"
                 title="开始录制键盘行为">
                录制键盘
            </div>
            <div class="record-btn"
                 @click="record_mouse"
                 title="开始录制鼠标行为">
                录制鼠标
            </div>
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
                    border: solid 1px var(--separator-stroke);
                    border-radius: 2px;
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