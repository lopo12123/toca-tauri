<script lang="ts" setup>
import { TimelineGraph } from "@/scripts/useTimeline";
import { onBeforeUnmount, onMounted, PropType, shallowRef } from "vue";
import { StorageStruct } from "@/scripts/useXml";

export type TimelineGraphSourceProp = { type: 'xml', data: string } | { type: 'obj', data: StorageStruct }

const { source } = defineProps<{
    source: TimelineGraphSourceProp
}>()
const emits = defineEmits<{
    (ev: 'after-render', instance: TimelineGraph): void
}>()

const diagramRef = shallowRef<TimelineGraph | null>(null)

onMounted(() => {
    diagramRef.value = new TimelineGraph()

    try {
        if(source.type === 'xml') diagramRef.value.fromXml('graph-el', source.data)
        else diagramRef.value.fromObj('graph-el', source.data)
    }catch (e) {
        console.log(e)
    }

    emits('after-render', diagramRef.value)
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