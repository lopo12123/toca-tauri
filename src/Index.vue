<script lang="ts" setup>
import { onMounted } from "vue";

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
    <div class="index global">
        <router-view/>
    </div>
</template>

<style lang="scss" scoped>
.index {
    position: relative;
    width: calc(100vw - 4px);
    max-width: calc(100vw - 4px);
    height: calc(100vh - 4px);
    max-height: calc(100vh - 4px);
    border: solid 2px var(--separator-stroke);
    color: var(--text-color);
    overflow: auto;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>