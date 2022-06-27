<script lang="ts" setup>
import { TimelineGraph } from "@/scripts/useTimeline";
import { onBeforeUnmount, onMounted, shallowRef } from "vue";
import { StorageStruct } from "@/scripts/useXml";

const diagramRef = shallowRef<TimelineGraph | null>(null)

const mock_obj: StorageStruct = {
    Toca: {
        EvMap: [
            { code: 'A', name: 'key A' },
            { code: 'B', name: 'key B' },
        ],
        Action: [
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
    }
}
const mock_xml = '<Toca><EvMap><code>A</code><name>key A</name></EvMap><EvMap><code>B</code><name>key B</name></EvMap><Action><type>click</type><code>A</code><delay>300</delay></Action><Action><type>press</type><code>B</code><delay>400</delay><duration>300</duration></Action><Action><type>left</type><code>MouseLeft</code><delay>300</delay><xy>100</xy><xy>100</xy></Action><Action><type>right</type><code>MouseDBLeft</code><delay>400</delay><xy>200</xy><xy>200</xy></Action><Action><type>absolute</type><code>MoveAbsolute</code><delay>300</delay><xy>300</xy><xy>300</xy></Action><Action><type>relative</type><code>MoveRelative</code><delay>300</delay><xy>400</xy><xy>400</xy></Action></Toca>'

const demo_obj = () => {
    diagramRef.value = new TimelineGraph()
    diagramRef.value.fromObj('graph-el', mock_obj)

}
const demo_xml = () => {
    diagramRef.value = new TimelineGraph()
    diagramRef.value.fromXml('graph-el', mock_xml)

    setTimeout(() => {
        diagramRef.value?.toObj()
    }, 1000)
}

onMounted(() => {
    // demo_obj()
    demo_xml()

    setTimeout(() => {
        const recover_obj = diagramRef.value?.toObj()
        const recover_xml = diagramRef.value?.toXml()
        console.log(recover_xml)
        console.log(mock_xml)
    }, 1000)
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