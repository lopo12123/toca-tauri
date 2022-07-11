<script lang="ts" setup>
import AppBanner from "@/layouts/AppBanner.vue";
import { useGlobal } from "@/stores/useGlobal";
import { invoke } from "@tauri-apps/api";
import { ref } from "vue";

const global = useGlobal()

const record_status = ref<string>('wating')
const doKeyRecord = () => {
    record_status.value = 'recording'
    invoke('record_keyboard', { signal: 'Escape' })
        .then((res: any) => {
            record_status.value = 'done'
            console.log(res)
        })
        .catch((err: any) => {
            record_status.value = 'error'
            console.log(err)
        })
}
</script>

<template>
    <div :class="['index', global.theme]">
        <div class="status">
            status: <span>{{ record_status }}</span>
        </div>
        <!--        <div class="app-banner-container">-->
        <!--            <AppBanner/>-->
        <!--        </div>-->
        <!--        <div class="app-view-container">-->
        <!--            <router-view/>-->
        <!--        </div>-->
        <button @click="doKeyRecord">record keys</button>
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