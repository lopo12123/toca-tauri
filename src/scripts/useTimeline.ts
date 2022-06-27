import { EvCode, EvMap, EvMapItem, EvStoreStruct } from "@/scripts/useEv";
import {
    Binding,
    Diagram,
    GraphObject,
    Group,
    Node,
    Panel,
    Point,
    Shape,
    Size,
    Spot,
    TextBlock,
    ToolManager
} from "gojs";
import { obj2xml, StorageStruct, xml2obj } from "@/scripts/useXml";

// region 绘图使用的配置对象
type GraphNode_head = {
    // id(事件值 code)
    key: EvCode
    // 标签名(事件值或自定义映射名)
    text: string
    isGroup: true
    // 所处位置 "x 0"
    loc: string
    // 虚线长度
    duration: number
    self?: EvStoreStruct
}
type GraphNode_ev = {
    // 所属事件(事件值或自定义映射名)
    code: EvCode | string
    // 所处位置 "x y"
    loc: string
    // 矩形高度
    duration: number
    // 原始数据 - 用于恢复、导出
    self: EvStoreStruct
}
type GraphNode = GraphNode_head | GraphNode_ev
// endregion

// region gojs 部分
const STATIC_ARGS = {
    // 组的宽度
    GroupWidth: 100,
    // 组的间距
    GroupGap: 50,
    // 标签的高度
    LabelHeight: 30,
    // 时间轴的虚线间隔
    TimelineDashGap: 5,
    // 事件盒子的宽度
    EvBoxWidth: 10,
}
const $make = GraphObject.make;
const createTimelineGraph = (elId: string, nodes: GraphNode[]) => {
    const diagram = $make(Diagram, elId, {
        allowCopy: false,
        isReadOnly: true,
        "toolManager.mouseWheelBehavior": ToolManager.WheelZoom,
        "resizingTool.isGridSnapEnabled": true,
        "draggingTool.gridSnapCellSize": new Size(STATIC_ARGS.TimelineDashGap, STATIC_ARGS.TimelineDashGap),
        "draggingTool.isGridSnapEnabled": true,
        "undoManager.isEnabled": true
    })

    // region 标签 和 虚线
    diagram.groupTemplate = $make(
        Group, 'Vertical', {
            locationSpot: Spot.Top
        },
        // 双向绑定坐标位置
        new Binding('location', 'loc', Point.parse),
        $make(
            Panel, "Auto", {
                name: 'Header'
            },
            // 背景框
            $make(
                Shape, 'Rectangle', {
                    width: STATIC_ARGS.GroupWidth,
                    height: STATIC_ARGS.LabelHeight,
                    fill: '#2da0ff',
                    stroke: '#001c33',
                    strokeWidth: 1,
                }
            ),
            // 文字内容
            $make(
                TextBlock, {
                    margin: 5,
                    stroke: '#fff',
                    font: '10pt Source Sans Pro, sans-serif'
                },
                new Binding('text', 'text')
            )
        ),
        // 虚线
        $make(
            Shape, {
                figure: "LineV",
                fill: null,
                stroke: "gray",
                strokeDashArray: [ STATIC_ARGS.TimelineDashGap, STATIC_ARGS.TimelineDashGap ],
                width: 1,
                alignment: Spot.Center,
                portId: "",
                fromLinkable: true,
                fromLinkableDuplicates: true,
                toLinkable: true,
                toLinkableDuplicates: true,
            },
            new Binding('height', 'duration')
        )
    )
    // endregion

    // region 节点
    diagram.nodeTemplate = $make(
        Node, {
            locationSpot: Spot.Top,
            locationObjectName: "SHAPE",
            selectionObjectName: "SHAPE",
            resizable: false,
        },
        // 绑定位置
        new Binding('location', 'loc', Point.parse),
        // 形状
        $make(
            Shape, "Rectangle", {
                name: 'SHAPE',
                fill: '#fff',
                stroke: '#333',
                width: STATIC_ARGS.EvBoxWidth
            },
            new Binding('height', 'duration')
        )
    )
    // endregion

    // @ts-ignore 去掉组的选中效果
    diagram.groupSelectionAdornmentTemplate = null
    // @ts-ignore 去掉事件盒子的选中效果
    diagram.nodeSelectionAdornmentTemplate = null

    // 赋值
    diagram.model.nodeDataArray = nodes

    return diagram
}

// endregion

/**
 * @description 将 EvStoreStruct[] 转换成 nodeDataArray[]
 */
const EvStore_to_GraphNode = (storeArray: EvStoreStruct[], mapper?: EvMapItem[]): GraphNode[] => {
    const code_to_name = new EvMap(mapper)
    // 组的 x 位置
    const groupPos: {
        [k: string]: {
            x: number
            max: number
        }
    } = {}
    // 当前最右边的 x
    let next_group_x = 0
    // 全局时间tick
    let curr_t = 0

    // 用于 gojs 的 nodeDataArray
    const label_array: GraphNode_head[] = []
    const node_array: GraphNode_ev[] = []
    storeArray.forEach((item) => {
        // 新组则添加组标签
        if(groupPos[item.code] === undefined) {
            label_array.push({
                key: item.code,
                text: code_to_name?.get(item.code) ?? item.code,
                isGroup: true,
                loc: `${ next_group_x } ${ -STATIC_ARGS.LabelHeight }`,
                duration: 0
            })

            groupPos[item.code] = {
                x: next_group_x,
                max: item.duration ?? 0
            }
            next_group_x += STATIC_ARGS.GroupWidth + STATIC_ARGS.GroupGap
        }

        // 时间推进
        curr_t += item.delay ?? 0

        // 将当前事件所对应的节点添加到列表中
        node_array.push({
            code: item.code,
            loc: `${ groupPos[item.code].x } ${ curr_t }`,
            duration: item.duration ?? STATIC_ARGS.TimelineDashGap,
            self: item
        })
        groupPos[item.code].max = Math.max(groupPos[item.code].max, curr_t + (item.duration ?? 0))
    })
    // 设置时间轴长度
    const ev_queue_duration = Object.values(groupPos).reduce((prev, curr) => Math.max(prev, curr.max), 0)
    label_array.forEach(item => {
        item.duration = ev_queue_duration
    })

    return [ ...label_array, ...node_array ]
}

/**
 * @description 将 nodeDataArray[] 转换成 EvStoreStruct[]
 */
const GraphNode_to_EvStore = (graphNode: GraphNode[]): { storeArray: EvStoreStruct[], mapper?: EvMapItem[] } => {
    const mapper: EvMapItem[] = []
    const storeArray: EvStoreStruct[] = []

    graphNode.forEach(node => {
        if(node.self !== undefined) {
            storeArray.push(node.self)
        }
        else if((<GraphNode_head>node).key !== (<GraphNode_head>node).text) {
            mapper.push({ code: (<GraphNode_head>node).key, name: (<GraphNode_head>node).text })
        }
    })

    return { storeArray, mapper }
}

class TimelineGraph {
    /**
     * @description 容器id
     */
    readonly #elId: string

    /**
     * @description diagram 实例
     */
    #diagram: Diagram | null = null

    constructor(elId: string) {
        this.#elId = elId
    }

    fromObj(obj: StorageStruct) {
        if(!!this.#diagram) {
            this.#diagram.clear()
            this.#diagram.div = null
        }
        this.#diagram = createTimelineGraph(this.#elId, EvStore_to_GraphNode(obj.Toca.Action, obj.Toca.EvMap))
    }

    fromXml(xml: string) {
        if(!!this.#diagram) {
            this.#diagram.clear()
            this.#diagram.div = null
        }
        this.fromObj(xml2obj(xml))
    }

    toObj(): StorageStruct | null {
        if(!this.#diagram) return null
        else {
            const { storeArray, mapper } = GraphNode_to_EvStore(<GraphNode[]>this.#diagram.model.nodeDataArray)

            return {
                Toca: {
                    EvMap: mapper,
                    Action: storeArray
                }
            }
        }
    }

    toXml(): string | null {
        if(!this.#diagram) return null
        else {
            return obj2xml(<StorageStruct>this.toObj())
        }
    }

    zoomToFit() {
        this.#diagram?.zoomToFit()
    }

    dispose() {
        if(!!this.#diagram) {
            this.#diagram.clear()
            this.#diagram.div = null
            this.#diagram = null
        }
    }
}

export type {
    GraphNode_head,
    GraphNode_ev
}
export {
    TimelineGraph
}