<script lang="ts" setup>
import AppBanner from "@/layouts/AppBanner.vue";
import { useGlobal } from "@/stores/useGlobal";
import { computed } from "vue";

const theme = computed(() => useGlobal().theme)
</script>

<template>
    <div :class="['index', theme]">
        <div class="app-banner-container">
            <AppBanner/>
        </div>
        <div class="app-view-container">
            {{ theme }}
        </div>
    </div>
</template>

<style lang="scss" scoped>
.index {
    position: relative;
    width: 100vw;
    height: 100vh;
    background-color: var(--background);
    color: var(--text-color);
    display: flex;
    align-items: center;
    justify-content: center;

    .app-banner-container {
        position: relative;
        width: 50px;
        height: 100vh;
    }

    .app-view-container {
        position: relative;
        height: 100vh;
    }
}
</style>