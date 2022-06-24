<script lang="ts" setup>
import { useGlobal } from "@/stores/useGlobal";

const global = useGlobal()

</script>

<template>
    <div class="app-banner">
        <ElTooltip
            placement="right"
            content="切换主题"
            :effect="global.theme === 'dark' ? 'light' : 'dark'">
            <div class="btn-box" @click="global.toggleTheme">
                o
            </div>
        </ElTooltip>
    </div>
</template>

<style lang="scss" scoped>
.app-banner {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>