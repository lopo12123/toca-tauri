<script lang="ts" setup>
import { appWindow } from "@tauri-apps/api/window";
import { open } from "@tauri-apps/api/shell";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter()
const tooltips = {
    theme: {
        light: '使用夜间模式',
        dark: '使用日间模式',
    },
    elder: {
        enable: '关闭老年模式',
        disable: '开启老年模式'
    }
}

type ToolItem = 'home' | 'theme' | 'elder'
    | 'bug' | 'issue' | 'min'
    | 'max' | 'refresh' | 'exit'
const useTools = (type: ToolItem) => {
    switch(type) {
        case "home":
            router.push({ name: 'Home' })
            break
        case "theme":
            break
        case "elder":
            break
        case "bug":
            open('https://github.com/lopo12123/toca-tauri/issues')
                .catch(err => {
                    console.log(err)
                })
            break
        case "issue":
            open('mailto:lopo@zju.edu.cn?subject=Some suggestions/comments for Toca')
                .catch(err => {
                    console.log(err)
                })
            break
        case "min":
            appWindow
                .minimize()
                .catch(err => {
                    console.log('最小化出错')
                })
            break
        case "max":
            appWindow
                .isMaximized()
                .then((isMax) => {
                    return isMax
                        ? appWindow.unmaximize()
                        : appWindow.maximize()
                })
                .catch(err => {
                    console.log('最大化出错')
                })
            break
        case "refresh":
            window.location.reload()
            break
        case "exit":
            appWindow
                .close()
                .catch(err => {
                    console.log(err)
                })
            break
    }
}

const action_list = [ 'act-wushu', 'act-wushu1', 'act-wushu2', 'act-wushu3', 'act-wushu4', 'act-wushu5' ]
const action_idx = ref(0)
const action_timer = ref<any>(-1)
onMounted(() => {
    action_timer.value = setInterval(() => {
        action_idx.value = (action_idx.value + 1) % action_list.length
    }, 1000)
})
onBeforeUnmount(() => {
    clearInterval(action_timer.value)
})
</script>

<template>
    <div class="app-banner">
        empty here.
    </div>
</template>

<style lang="scss" scoped>
@use "src/styles/mixin";

.app-banner {
    position: relative;
    width: 100%;
    height: calc(100% - 1rem);
    padding: 0.5rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    .iconfont {
        pointer-events: none;
    }

    .logo-container {
        position: relative;
        width: 1.5rem;
        height: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;

        i {
            font-size: 1.5rem;
            animation: custom-fade-out 1s infinite;
            @keyframes custom-fade-out {
                0% {
                    opacity: 1
                }
                100% {
                    opacity: 0
                }
            }
        }
    }

    .tool-list-container {
        position: relative;
        width: 100%;
        height: calc(100% - 8.5rem);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
    }

    .sys-list-container {
        position: relative;
        width: 100%;
        height: 7rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .btn-box {
        position: relative;
        width: 1.5rem;
        height: 1.5rem;
        font-size: 1rem;
        text-align: center;
        line-height: 1.5rem;

        &:hover {
            outline: solid 1px var(--separator-stroke);
        }
    }

    .btn-box__selected {
        outline: solid 1px var(--separator-stroke);
    }

    .separator-line {
        width: 1.5rem;
        height: 0;
        margin: 0.5rem 0;
        border-bottom: solid 1px var(--separator-stroke);
        display: block;
    }

}
</style>