<script lang="ts" setup>
import { useRouter } from "vue-router";

const router = useRouter()

const makeChoice = (choice: 'record' | 'display') => {
    if(choice === 'record') router.push({ name: 'RecordView' })
    else if(choice === 'display') router.push({ name: 'DisplayView' })
}
</script>

<template>
    <div class="home">
        <div class="logo">
            logo
        </div>
        <div class="options">
            <div class="option-btn" @click="makeChoice('record')">录制</div>
            <div class="option-btn" @click="makeChoice('display')">播放</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use "src/styles/mixin";

.home {
    position: relative;
    width: calc(100% - 1rem);
    height: calc(100% - 1rem);
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .options {
        position: relative;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

        .option-btn {
            position: relative;
            width: 5rem;
            height: 1.5rem;
            border: solid 1px var(--border-color);
            border-radius: 2px;
            user-select: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;

            &:hover {
                background-color: var(--background-color__dark);
            }
        }
    }
}
</style>