<script lang="ts" setup>
import { createTimelineGraph, TimelineGraph } from "@/scripts/useTimeline";
import { onMounted } from "vue";
import { EvStoreStruct } from "@/scripts/useEv";

const mock: EvStoreStruct[] = [
    {
        type: 'click',
        code: 'A',
        delay: 300,
    },
    {
        type: 'press',
        code: 'B',
        delay: 400,
        duration: 300
    },
    {
        type: 'left',
        code: 'MouseLeft',
        delay: 300,
        xy: [ 100, 100 ]
    },
    {
        type: 'right',
        code: 'MouseDBLeft',
        delay: 400,
        xy: [ 200, 200 ]
    },
    {
        type: 'absolute',
        code: 'MoveAbsolute',
        delay: 300,
        xy: [ 300, 300 ]
    },
    {
        type: 'relative',
        code: 'MoveRelative',
        delay: 300,
        xy: [ 400, 400 ]
    },
]

onMounted(() => {
    const timeline = new TimelineGraph('timeline-box')
    timeline.fromObj(mock)
})
</script>

<template>
    <div class="root">
        <div id="timeline-box"></div>
    </div>
</template>

<style lang="scss" scoped>
@use "src/styles/mixin";

.root {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    #timeline-box {
        @include mixin.scrollBarStyle();
        width: 80%;
        height: 80%;
        border: solid 1px;
        overflow: auto;

        :deep(canvas) {
            outline: none;
        }

        :deep(div) {
            @include mixin.scrollBarStyle();
            overflow: auto;
        }
    }
}
</style>