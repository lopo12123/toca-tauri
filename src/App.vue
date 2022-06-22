<script setup lang="ts">
import { invoke } from "@tauri-apps/api";

const doGreet = () => {
    invoke('greet', { msg: 'hello' })
        .then((res) => {
            console.log('res', res)
        })
        .catch((err) => {
            console.log('failed to invoke greet')
        })
}
</script>

<template>
    <div class="app">
        <button @click="doGreet">greet</button>
    </div>
</template>

<style>
.app {
    position: relative;
    width: 100vw;
    height: 100vh;
}
</style>
