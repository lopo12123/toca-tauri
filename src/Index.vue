<script lang="ts" setup>
import { onMounted } from "vue";
import GlobalBanner from "@/layouts/GlobalBanner.vue";
import useMemo from "@/stores/useMemo";

const configMemo = useMemo()

// 阻止右键响应
onMounted(() => {
    window.oncontextmenu = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }
    document.oncontextmenu = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }
    // window.onkeydown = (e) => {
    //     e.preventDefault()
    //     e.stopPropagation()
    // }
    // document.onkeydown = (e) => {
    //     e.preventDefault()
    //     e.stopPropagation()
    // }

    configMemo.setAppStatus('open')
    setTimeout(() => {
        configMemo.setAppStatus('normal')
    }, 1_000)
})
</script>

<template>
    <div :class="['index', 'global', configMemo.appStatus]" :style="`opacity: ${configMemo.globalAlpha}`">
        <div class="banner-container">
            <GlobalBanner/>
        </div>
        <div class="body-container">
            <router-view/>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use "src/styles/mixin";

.open {
    animation: anime-open 1s forwards;
    @keyframes anime-open {
        0% {
            width: 0;
            left: 50%;
        }
        100% {
            width: calc(100% - 4px);
            left: 0;
        }
    }
}

.close {
    animation: anime-close 1s forwards;
    @keyframes anime-close {
        0% {
            width: calc(100% - 4px);
            left: 0;
        }
        100% {
            width: 0;
            left: 50%;
        }
    }
}

.index {
    @include mixin.scrollBarStyle(var(--scroll-bar-color));
    position: relative;
    width: calc(100% - 4px);
    max-width: calc(100% - 4px);
    height: calc(100% - 4px);
    max-height: calc(100% - 4px);
    border: solid 2px var(--border-color);
    border-radius: 5px;
    background-color: var(--background-color);
    color: var(--text-color);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    .banner-container {
        position: relative;
        width: 100%;
        height: 1.5rem;
        border-bottom: solid 1px var(--border-color);
    }

    .body-container {
        position: relative;
        width: 100%;
        height: calc(100% - 1.5rem - 1px);
    }
}
</style>