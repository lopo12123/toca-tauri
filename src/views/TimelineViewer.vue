<script lang="ts" setup>
import { StorageStruct } from "@/scripts/useXml";
import TimelineGraphBox from "@/layouts/TimelineGraphBox.vue";
import { TimelineGraph } from "@/scripts/useTimeline";
import { onMounted, ref, shallowRef } from "vue";
import { EvStoreStruct, EvCode, EvName } from "@/scripts/useEv";

// region test
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
                delay: 130_000,
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
                db: true,
                xy: [ 100, 100 ]
            },
            {
                type: 'right',
                code: 'MouseDBLeft',
                delay: 400,
                xy: [ 1346, 2287 ]
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
const mock_xml = '<Toca><EvMap><code>A</code><name>key A</name></EvMap><EvMap><code>B</code><name>key B</name></EvMap><Action><type>click</type><code>A</code><delay>300</delay></Action><Action><type>press</type><code>B</code><delay>400</delay><duration>300</duration></Action><Action><type>left</type><code>MouseLeft</code><delay>300</delay><xy>100</xy><xy>100</xy></Action><Action><type>right</type><code>MouseDBLeft</code><delay>400</delay><xy>200</xy><xy>200</xy></Action><Action><type>absolute</type><code>MoveAbsolute</code><delay>300</delay><xy>300</xy><xy>300</xy></Action><Action><type>relative</type><code>MoveRelative</code><delay>300</delay><xy>400</xy><xy>400</xy></Action><HASH>b4947a9840b4bf58168d1d93ed14a68f3ffe114e8686fa72f41524dc5bebcda3</HASH></Toca>'
// endregion

const mapList = ref<{ [k: string]: string }>({})
const evList = ref<EvStoreStruct[]>([])
const getEvName = (code: EvCode) => {
    return mapList.value[code] ?? EvName[code]
}
const getEvDelay = (delay: number) => {
    if(delay < 100) return `${ delay }ms`
    else if(delay < 60_000) return `${ delay / 1000 }s`
    else return `${ (delay / 60_000).toFixed(1) }m`
}

const instanceRef = shallowRef<TimelineGraph | null>(null)
const afterRender = (instance: TimelineGraph | null) => {
    instanceRef.value = instance
}

// 加载 xml 内容到列表
const loadXmlObj = (xmlObj: StorageStruct) => {
    const mapper: { [k: string]: string } = {}
    xmlObj.Toca.EvMap?.forEach(({ code, name }) => {
        mapper[code] = name
    })
    mapList.value = mapper
    evList.value = xmlObj.Toca.Action
}

onMounted(() => {
    loadXmlObj(mock_obj)
})
</script>

<template>
    <div class="timeline-viewer">
        <div class="list-layout">
            <div class="mapper-list">

            </div>
            <div class="ev-list">
                <div class="title-line">
                    <div class="ev-idx" title="序号">序号</div>
                    <div class="ev-delay" title="间隔">间隔</div>
                    <div class="ev-name" title="事件">事件</div>
                    <div class="ev-pos" title="触发位置(鼠标事件)">位置</div>
                    <div class="ev-db" title="是否双击">双击</div>
                    <div class="ev-duration" title="持续时间(按键事件)">持续</div>
                </div>
                <div class="item-line" v-for="(item, idx) in evList" :key="idx">
                    <div class="ev-idx">{{ idx + 1 }}</div>
                    <div class="ev-delay" :title="getEvDelay(item.delay)">
                        {{ getEvDelay(item.delay) }}
                    </div>
                    <div class="ev-name" :title="getEvName(item.code)">
                        {{ getEvName(item.code) }}
                    </div>
                    <div class="ev-pos" :title="item.xy">{{ item.xy?.join(',') ?? '-' }}</div>
                    <div class="ev-db">{{ item.db ? '√' : '-' }}</div>
                    <div class="ev-duration" :title="item.duration ?? '无持续时间'">
                        {{ item.duration ?? '-' }}
                    </div>
                </div>
            </div>
        </div>
        <div class="graph-layout">
            <TimelineGraphBox
                :source="{type: 'xml', data: mock_xml}"
                @after-render="afterRender"/>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use "src/styles/mixin";

.timeline-viewer {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .list-layout {
        position: relative;
        width: 320px;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

        .mapper-list {
            @include mixin.scrollBarStyle();
            position: relative;
            width: 100%;
            height: calc(40% - 1px);
            border-bottom: solid 1px var(--separator-stroke);
            overflow: hidden auto;
        }

        .ev-list {
            @include mixin.scrollBarStyle();
            position: relative;
            width: 100%;
            height: 60%;
            font-size: 0.875rem;
            overflow: hidden auto;

            .ev-idx {
                width: 10%;
            }

            .ev-delay {
                width: 15%;
            }

            .ev-name {
                width: 25%;
            }

            .ev-pos {
                width: 25%;
            }

            .ev-db {
                width: 10%;
            }

            .ev-duration {
                width: 10%;
            }
        }

        %line-base {
            position: relative;
            width: calc(100% - 1rem);
            padding: 0 0.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;

            > div {
                @include mixin.textInLine;
            }
        }

        .title-line {
            @extend %line-base;
            height: 1.5rem;
            line-height: 1.5rem;
            background-color: var(--list-title-background);
        }

        .item-line {
            @extend %line-base;
        }
    }

    .graph-layout {
        position: relative;
        width: calc(100% - 281px);
        height: 100%;
        border-left: solid 1px var(--separator-stroke);
    }
}
</style>