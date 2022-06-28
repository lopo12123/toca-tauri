<script lang="ts" setup>
import { StorageStruct, verify_xml, xml2obj } from "@/scripts/useXml";
import TimelineGraphBox from "@/layouts/TimelineGraphBox.vue";
import { TimelineGraph } from "@/scripts/useTimeline";
import { onMounted, ref, shallowRef } from "vue";
import { EvStoreStruct, EvCode, EvName } from "@/scripts/useEv";
import { ElMessage } from "element-plus";

// region todo 测试数据
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

// region 列表展示 事件映射/事件序列
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
// endregion

// region 图像实例
const instanceRef = shallowRef<TimelineGraph | null>(null)
const afterRender = (instance: TimelineGraph | null) => {
    instanceRef.value = instance
}
// endregion

// region 加载 xml 内容到列表
const loadXmlStr = (xmlStr: string) => {
    loadXmlObj(xml2obj(xmlStr))
}
const loadXmlObj = (xmlObj: StorageStruct) => {
    const mapper: { [k: string]: string } = {}
    xmlObj.Toca.EvMap?.forEach(({ code, name }) => {
        mapper[code] = name
    })
    mapList.value = mapper
    evList.value = xmlObj.Toca.Action
}
// endregion

// region 交互选择并加载 xml 文件
const iptRef = ref<HTMLInputElement | null>(null)
const doUserSelect = () => {
    const ipt = iptRef.value
    if(!ipt) {
        ElMessage({
            type: 'info',
            message: '发生内部错误, 请退出后重试'
        })
    }
    else {
        ipt.dispatchEvent(new MouseEvent('click'))
        ipt.onchange = () => {
            if(!ipt.files) {
                ElMessage({
                    type: 'info',
                    message: '请选择文件'
                })
            }
            else {
                ElMessage({
                    type: 'info',
                    message: '解析中'
                })
                const reader = new FileReader()
                reader.onload = () => {
                    if(!verify_xml(reader.result as string)) {
                        ElMessage({
                            type: 'info',
                            message: '文件已被篡改'
                        })
                    }
                    else {
                        loadXmlStr(reader.result as string)
                        instanceRef.value?.fromXml(reader.result as string)
                        ElMessage.closeAll()
                    }
                }
                reader.readAsText(ipt.files[0])
            }
        }
    }
}
// endregion
</script>

<template>
    <div class="timeline-viewer">
        <input class="hidden-file-selector" ref="iptRef" type="file" accept=".xml">
        <div class="list-layout">
            <div class="mapper-list">
                <div class="title-line">
                    <div class="map-code">事件名</div>
                    <div class="map-name">映射名</div>
                </div>
                <div class="item-line" v-for="(val, key) in mapList" :key="'mapper-'+key">
                    <div class="map-code" :title="EvName[key]">{{ EvName[key] }}</div>
                    <div class="map-name" :title="val">{{ val }}</div>
                </div>
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
                <div class="item-line" v-for="(item, idx) in evList" :key="'ev-'+idx">
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
            <div class="select-file" @click="doUserSelect">
                <i class="iconfont icon-record"/>
                <span>载入配置文件</span>
            </div>
            <TimelineGraphBox @after-init="afterRender"/>
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

    .hidden-file-selector {
        position: absolute;
        z-index: -10;
        width: 1rem;
        height: 1rem;
        left: -5rem;
        top: -5rem;
        opacity: 0;
    }

    .list-layout {
        position: relative;
        width: 20rem;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

        .mapper-list {
            @include mixin.scrollBarStyle();
            position: relative;
            width: 100%;
            height: calc(30% - 1px);
            border-bottom: solid 1px var(--separator-stroke);
            overflow: hidden auto;

            .map-code {
                width: 45%;
            }

            .map-name {
                width: 45%;
            }
        }

        .ev-list {
            @include mixin.scrollBarStyle();
            position: relative;
            width: 100%;
            height: 70%;
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
        width: calc(100% - 20rem - 1px);
        height: 100%;
        border-left: solid 1px var(--separator-stroke);

        .select-file {
            @include mixin.pointer-hover;
            position: absolute;
            z-index: 10;
            width: 6.25rem;
            height: 1.5rem;
            top: 4.375rem;
            font-size: 0.75rem;
            line-height: 1.5rem;
            text-align: center;
            user-select: none;
            transform-origin: 0 0;
            transform: rotate(-45deg);

            &:hover {
                span {
                    text-decoration: underline;
                }
            }
        }
    }
}
</style>