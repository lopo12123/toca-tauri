<script lang="ts" setup>
import AppBanner from "@/layouts/AppBanner.vue";
import { useGlobal } from "@/stores/useGlobal";

const global = useGlobal()
</script>

<template>
    <div :class="['index', global.theme]">
        <div class="app-banner-container">
            <AppBanner/>
        </div>
        <div class="app-view-container">

        </div>
    </div>
</template>

<style lang="scss" scoped>
$banner-width: 2rem;

.index {
    position: relative;
    width: calc(100vw - 2px);
    height: calc(100vh - 2px);
    border: solid 1px var(--separator-stroke);
    background-color: var(--background);
    color: var(--text-color);
    display: flex;
    align-items: center;
    justify-content: center;

    .app-banner-container {
        position: relative;
        width: $banner-width;
        height: 100vh;
        border-right: solid 1px var(--separator-stroke);
    }

    .app-view-container {
        position: relative;
        width: calc(100% - #{$banner-width} - 1px);
        height: 100vh;
    }
}
</style>