<script lang="ts" setup>
import { ref } from "vue";
import { invoke } from "@tauri-apps/api";

type RecordStatus = '-' | 'pending' | 'error' | 'done'

const record_status = ref<RecordStatus>('-')
const result = ref('no result now.')
const doRecord = (type: 'keyboard' | 'mouse') => {
    if(type === 'keyboard') {
        record_status.value = 'pending'
        invoke<string>('record_keyboard', { signal: 'Escape' })
            .then((res) => {
                record_status.value = 'done'
                result.value = res
                console.log(res)
            })
            .catch((err: any) => {
                record_status.value = 'error'
                result.value = err
                console.log(err)
            })
    }
    else if(type === 'mouse') {
        record_status.value = 'pending'
        invoke<string>('record_mouse', { signal: 'Escape' })
            .then((res) => {
                record_status.value = 'done'
                result.value = res
                console.log(res)
            })
            .catch((err: any) => {
                record_status.value = 'error'
                result.value = err
                console.log(err)
            })
    }
}
</script>

<template>
    <div class="record-view" data-tauri-drag-region>
        <div>
            <span>使用 ESC 键停止录制</span> <br>
            <span>当前状态: {{ record_status }}</span>
        </div>
        <button @click="doRecord('keyboard')">键盘</button>
        <button @click="doRecord('mouse')">鼠标</button>

        <div>{{ result }}</div>
    </div>
</template>

<style lang="scss" scoped>
.record-view {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>