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
})
</script>

<template>
    <div class="index global" :style="`opacity: ${configMemo.globalAlpha}`">
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

.index {
    @include mixin.scrollBarStyle(var(--scroll-bar-color));
    position: relative;
    //width: calc(100vw - 4px);
    //max-width: calc(100vw - 4px);
    //height: calc(100vh - 4px);
    //max-height: calc(100vh - 4px);
    width: 300px;
    height: 100px;
    border: solid 2px var(--border-color);
    border-radius: 5px;
    background-color: var(--background-color);
    color: var(--text-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    overflow: auto;

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