<script lang="ts" setup>
// const record_status = ref<string>('waiting')
// const doKeyRecord = () => {
//     record_status.value = 'recording'
//     invoke('record_keyboard', { signal: 'Escape' })
//         .then((res: any) => {
//             record_status.value = 'done'
//             console.log(res)
//         })
//         .catch((err: any) => {
//             record_status.value = 'error'
//             console.log(err)
//         })
// }
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