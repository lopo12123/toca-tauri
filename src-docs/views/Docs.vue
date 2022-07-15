<script lang="ts" setup>

import { ref } from "vue";

const lang = ref<'zh' | 'en'>('zh')
const content = ref()
</script>

<template>
    <div class="docs">
        <div class="body-container">
            body content
        </div>
    </div>
</template>

<style lang="scss" scoped>
.docs {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;

    .body-container {
        width: 80vw;
        height: fit-content;
        min-height: calc(100% - 100px);
        outline: solid 1px red;
    }
}
</style>