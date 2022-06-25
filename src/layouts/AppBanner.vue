<script lang="ts" setup>
import { useGlobal } from "@/stores/useGlobal";
import { appWindow } from "@tauri-apps/api/window";
import { open } from "@tauri-apps/api/shell";

const global = useGlobal()
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

type ToolItem = 'theme' | 'elder'
    | 'bug' | 'issue' | 'min'
    | 'max' | 'refresh' | 'exit'
const useTools = (type: ToolItem) => {
    switch(type) {
        case "theme":
            global.toggleTheme()
            break
        case "elder":
            global.toggleElderMode()
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
    console.log('执行: ', type)
}
</script>

<template>
    <div class="app-banner"
         data-tauri-drag-region
         @dblclick="useTools('max')">
        <div class="logo-container" data-tauri-drag-region>
            <i class="iconfont icon-wushu"/>
        </div>

        <div class="tool-list-container" data-tauri-drag-region>
            <i class="separator-line"/>
            <ElTooltip
                placement="right"
                :content="tooltips.theme[global.theme]"
                :effect="global.theme === 'dark' ? 'light' : 'dark'">
                <div class="btn-box" @click="useTools('theme')">
                    <i class="iconfont icon-moonyueliang" v-if="global.theme === 'light'"/>
                    <i class="iconfont icon-sun" v-if="global.theme === 'dark'"/>
                </div>
            </ElTooltip>

            <ElTooltip
                placement="right"
                :content="tooltips.elder[global.elderMode]"
                :effect="global.theme === 'dark' ? 'light' : 'dark'">
                <div :class="['btn-box', global.elderMode === 'enable' ? 'btn-box__selected' : '']"
                     @click="useTools('elder')">
                    <i class="iconfont icon-grandpa"/>
                </div>
            </ElTooltip>

            <ElTooltip
                placement="right"
                content="Bug反馈"
                :effect="global.theme === 'dark' ? 'light' : 'dark'">
                <div class="btn-box" @click="useTools('bug')">
                    <i class="iconfont icon-bug"/>
                </div>
            </ElTooltip>

            <ElTooltip
                placement="right"
                content="建议/意见"
                :effect="global.theme === 'dark' ? 'light' : 'dark'">
                <div class="btn-box" @click="useTools('issue')">
                    <i class="iconfont icon-fankuiyijian"/>
                </div>
            </ElTooltip>
        </div>

        <div class="sys-list-container" data-tauri-drag-region>
            <i class="separator-line"/>

            <ElTooltip
                placement="right"
                content="最小化"
                :effect="global.theme === 'dark' ? 'light' : 'dark'">
                <div class="btn-box" @click="useTools('min')">
                    <i class="iconfont icon-zuoxiajiao-"/>
                </div>
            </ElTooltip>

            <ElTooltip
                placement="right"
                content="最大化"
                :effect="global.theme === 'dark' ? 'light' : 'dark'">
                <div class="btn-box" @click="useTools('max')">
                    <i class="iconfont icon-fangda1"/>
                </div>
            </ElTooltip>

            <ElTooltip
                placement="right"
                content="重新载入"
                :effect="global.theme === 'dark' ? 'light' : 'dark'">
                <div class="btn-box" @click="useTools('refresh')">
                    <i class="iconfont icon-shuaxin"/>
                </div>
            </ElTooltip>

            <ElTooltip
                placement="right"
                content="退出"
                :effect="global.theme === 'dark' ? 'light' : 'dark'">
                <div class="btn-box" @click="useTools('exit')">
                    <i class="iconfont icon-qp_icon_exit"/>
                </div>
            </ElTooltip>
        </div>
    </div>
</template>

<style lang="scss" scoped>
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
        text-align: center;
        line-height: 1.5rem;

        i {
            font-size: 1.5rem;
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
        cursor: pointer;

        &:hover {
            outline: solid 1px var(--separator-stroke);
            background-color: var(--background-hover);
        }
    }

    .btn-box__selected {
        outline: solid 1px var(--separator-stroke);
        background-color: var(--background-hover);
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