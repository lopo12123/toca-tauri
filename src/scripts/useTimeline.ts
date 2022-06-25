import { EvCode, EvMap, EvStoreStruct } from "@/scripts/useEv";
import { Binding, Diagram, GraphObject, Group, Node, Panel, Point, Shape, Size, Spot, TextBlock } from "gojs";

// 绘图使用的配置对象
type GraphObjNode_head = {
    // id(事件名)
    key: string
    // 展示文字(事件值或自定义映射名)
    text: string
    isGroup: true
    // 所处位置 "x 0"
    loc: string
    // 虚线长度
    duration: number
}
type GraphObjNode_ev = {
    // 所属事件(事件值或自定义映射名)
    group: EvCode | string
    // 所处位置 "x y"
    loc: string
    // 矩形高度
    duration: number
    toolTip: {
        evName: string
        position: [ number, number ]
    }
}

// region gojs 部分
const $make = GraphObject.make;
export const makeTimelineGraph = (elId: string, nodes: (GraphObjNode_head | GraphObjNode_ev)[]) => {
    const diagram = $make(
        Diagram, elId, {
            allowCopy: false,
            isReadOnly: true,
            "resizingTool.isGridSnapEnabled": true,
            "draggingTool.gridSnapCellSize": new Size(1, 1),
            "draggingTool.isGridSnapEnabled": true,
            "undoManager.isEnabled": true
        }
    )

    // region 表头 label 和 虚线
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
                    width: 100,
                    height: 30,
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
                strokeDashArray: [ 5, 5 ],
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
                width: 10
            },
            new Binding('height', 'duration')
        )
    )
    // @ts-ignore 去掉选中效果
    diagram.nodeSelectionAdornmentTemplate = null
    // endregion

    // 赋值
    diagram.model.nodeDataArray = nodes

    return diagram
}

// endregion

class TimelineGraph {
    #diagram: Diagram | null = null
    #keyMap: EvMap | null

    constructor(keyMap: EvMap | null) {
        this.#keyMap = keyMap
    }

    fromObj(nodes: EvStoreStruct[]) {

    }

    toObj() {

    }

    fromJson() {

    }

    toJson() {

    }

    fromXml() {

    }

    toXml() {

    }

    render() {

    }

    dispose() {

    }
}

export {
    TimelineGraph
}