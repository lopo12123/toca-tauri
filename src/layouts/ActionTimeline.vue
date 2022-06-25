<script lang="ts" setup>
import { makeTimelineGraph } from "@/scripts/useTimeline";
import { onMounted } from "vue";

const timeline_nodes = [
    {
        key: 'a',
        text: 'key A',
        isGroup: true,
        loc: '0 -30',
        duration: 100
    },
    {
        key: 'b',
        text: 'key B',
        isGroup: true,
        loc: '150 -30',
        duration: 100
    },
    {
        group: 'a',
        duration: 7,
        loc: '0 0'
    },
    {
        group: 'a',
        duration: 17,
        loc: '0 20'
    },
    {
        group: 'b',
        duration: 70,
        loc: '150 0'
    }
]

onMounted(() => {
    const diagram = makeTimelineGraph('timeline-box', timeline_nodes)
})
</script>

<template>
    <div class="root">
        <div id="timeline-box"></div>
    </div>
</template>

<style lang="scss" scoped>
.root {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    #timeline-box {
        width: 80%;
        height: 80%;
        border: solid 1px;
    }
}
</style>