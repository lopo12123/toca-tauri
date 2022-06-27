<script lang="ts" setup>
import { StorageStruct } from "@/scripts/useXml";
import TimelineGraphBox from "@/layouts/TimelineGraphBox.vue";
import { TimelineGraph } from "@/scripts/useTimeline";
import { shallowRef } from "vue";

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
const mock_xml = ''//'<Toca><EvMap><code>A</code><name>key A</name></EvMap><EvMap><code>B</code><name>key B</name></EvMap><Action><type>click</type><code>A</code><delay>300</delay></Action><Action><type>press</type><code>B</code><delay>400</delay><duration>300</duration></Action><Action><type>left</type><code>MouseLeft</code><delay>300</delay><xy>100</xy><xy>100</xy></Action><Action><type>right</type><code>MouseDBLeft</code><delay>400</delay><xy>200</xy><xy>200</xy></Action><Action><type>absolute</type><code>MoveAbsolute</code><delay>300</delay><xy>300</xy><xy>300</xy></Action><Action><type>relative</type><code>MoveRelative</code><delay>300</delay><xy>400</xy><xy>400</xy></Action></Toca>'

const instanceRef = shallowRef<TimelineGraph | null>(null)
const afterRender = (instance: TimelineGraph) => {
    instanceRef.value = instance
}

</script>

<template>
    <div class="timeline-viewer">
        <div class="list-layout">

        </div>
        <div class="graph-layout">
            <TimelineGraphBox
                :source="{type: 'xml', data: mock_xml}"
                @after-render="afterRender"/>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.timeline-viewer {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .list-layout {
        //width: 100px;
        height: 100%;
    }

    .graph-layout {
        width: 80%;
        height: 100%;
    }
}
</style>