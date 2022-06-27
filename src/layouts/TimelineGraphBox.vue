<script lang="ts" setup>
import { TimelineGraph } from "@/scripts/useTimeline";
import { onBeforeUnmount, onMounted, shallowRef } from "vue";

const emits = defineEmits<{
    (ev: 'after-init', instance: TimelineGraph | null): void
}>()

const diagramRef = shallowRef<TimelineGraph | null>(null)

onMounted(() => {
    diagramRef.value = new TimelineGraph('graph-el')
    emits('after-init', diagramRef.value)
})
onBeforeUnmount(() => {
    diagramRef.value?.dispose()
})
</script>

<template>
    <div class="timeline-graph-box">
        <div id="graph-el"></div>
    </div>
</template>

<style lang="scss" scoped>
@use "src/styles/mixin";

.timeline-graph-box {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    #graph-el {
        @include mixin.scrollBarStyle();
        width: 100%;
        height: 100%;
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