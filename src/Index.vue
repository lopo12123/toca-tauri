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
    width: calc(100vw - 2px);
    height: calc(100vh - 2px);
    border: solid 1px var(--separator-stroke);
    background-color: var(--background);
    color: var(--text-color);
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>