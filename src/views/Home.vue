<script lang="ts" setup>
import { useRouter } from "vue-router";
import { appWindow } from "@tauri-apps/api/window";

const router = useRouter()

const useTools = (type: 'min' | 'max' | 'refresh' | 'exit') => {
    switch(type) {
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

const selectOption = (type: 'display' | 'record') => {
    if(type === 'display') {
        router.push({ name: 'DisplayView' })
    }
    else if(type === 'record') {
        router.push({ name: 'RecordView' })
    }
}
</script>

<template>
    <div class="home">
        <div class="side-menu">
            <div class="min" @click="useTools('min')">
                1
            </div>
            <div class="max" @click="useTools('max')">
                2
            </div>
            <div class="refresh" @click="useTools('refresh')">
                3
            </div>
            <div class="exit" @click="useTools('exit')">
                4
            </div>
        </div>
        <div class="options">
            <div class="option-btn" @click="selectOption('display')">播放</div>
            <div class="option-btn" @click="selectOption('record')">录制</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use "src/styles/mixin";

.home {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .option-btn {
        width: 5rem;
        height: 3rem;
        //border: solid 1px var(--separator-stroke);
        //user-select: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
            text-decoration: underline;
        }
    }
}
</style>