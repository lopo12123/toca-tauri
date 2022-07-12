<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { ElSlider } from "element-plus";
import { appWindow } from "@tauri-apps/api/window";
import { useNotification } from "@/scripts/useNotification";
import useMemo from "@/stores/useMemo";

const configMemo = useMemo()

// 需要绑定一个 v-model 才能使用
const _slider_value_receiver = ref(1)

// 透明度调整条是否可见
const opacityAdjusterVisible = ref(false)

// 固定 最小 刷新 退出
const useTools = (type: 'pin' | 'min' | 'refresh' | 'exit') => {
    switch(type) {
        case "pin":
            appWindow.setAlwaysOnTop(!configMemo.alwaysOnTop)
                .then(() => {
                    configMemo.toggleAlwaysOnTop()
                })
                .catch(() => {
                    useNotification('窗口置顶失败')
                })
            break
        case "min":
            appWindow.minimize()
                .catch(() => {
                    useNotification('最小化失败')
                })
            break
        case "refresh":
            window.location.reload()
            break
        case "exit":
            appWindow.close()
                .catch(() => {
                    useNotification('退出失败')
                })
            break
    }
}

onMounted(() => {
    if(configMemo.alwaysOnTop) {
        appWindow.setAlwaysOnTop(true)
            .then(() => {
                configMemo.toggleAlwaysOnTop()
            })
            .catch(() => {
                useNotification('窗口置顶失败')
            })
    }
})
</script>

<template>
    <div class="global-banner"
         data-tauri-drag-region>
        <div class="auto-switch-box"
             data-tauri-drag-region>
            <div class="scroll-message-box" :style="`width: ${opacityAdjusterVisible ? '0%' : '100%'}`">
                <div class="inner-text">{{ configMemo.scrollMessage }}</div>
            </div>
            <div class="opacity-adjuster" :style="`width: ${opacityAdjusterVisible ? '100%' : '0%'}`">
                <div class="inner-slider">
                    <ElSlider v-model="_slider_value_receiver" size="small"
                              :min="0.1" :max="1" :step="0.1"
                              :show-tooltip="false"
                              @input="configMemo.updateGlobalAlpha"/>
                </div>
            </div>
        </div>
        <div class="operate-btn"
             data-tauri-drag-region>
            <div class="btn" @click="opacityAdjusterVisible = !opacityAdjusterVisible">0</div>
            <div :class="['btn', configMemo.alwaysOnTop ? 'btn-active' : '']"
                 @click="useTools('pin')">
                1
            </div>
            <div class="btn" @click="useTools('min')">2</div>
            <div class="btn" @click="useTools('refresh')">3</div>
            <div class="btn" @click="useTools('exit')">4</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use "src/styles/mixin";

.global-banner {
    position: relative;
    width: calc(100% - 1rem);
    height: 100%;
    padding: 0 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .auto-switch-box {
        position: relative;
        width: calc(100% - 7rem);
        height: 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .scroll-message-box {
            @include mixin.textInLine;
            position: relative;
            height: 1rem;
            line-height: 1rem;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            overflow: hidden;
            transition: width 1s;

            .inner-text {
                @include mixin.textInLine;
                font-size: 0.875rem;
            }
        }

        .opacity-adjuster {
            position: relative;
            height: 1rem;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            overflow: hidden;
            transition: width 1s;

            .inner-slider {
                width: 90%;
                margin: 0 5%;
            }
        }
    }

    .operate-btn {
        position: relative;
        width: 6rem;
        height: 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .btn {
            position: relative;
            width: 1rem;
            height: 1rem;
            text-align: center;
            line-height: 1rem;
            cursor: pointer;

            &:hover {
                outline: solid 1px var(--border-color);
            }
        }

        .btn-active {
            outline: solid 1px var(--border-color);
        }
    }
}
</style>