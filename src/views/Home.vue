<script lang="ts" setup>
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const router = useRouter()
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
        <div class="option-btn" @click="selectOption('display')">播放</div>
        <div class="option-btn" @click="selectOption('record')">录制</div>
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
    justify-content: center;

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