<script lang="ts" setup>
import { useGlobal } from "@/stores/useGlobal";

const global = useGlobal()

</script>

<template>
    <div class="app-banner">
        <div class="btn-box" @click="global.toggleTheme">
            {{ global.theme }}
        </div>
    </div>
</template>

<style lang="scss" scoped>
.app-banner {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>