/**
 * @description 事件名称
 */
const EvName: { [k in EvCode]: string } = {
    A: '按键A', B: '按键B', C: '按键C',
    D: '按键D', E: '按键E', F: '按键F',
    G: '按键G', H: '按键H', I: '按键I',
    J: '按键J', K: '按键K', L: '按键L',
    M: '按键M', N: '按键N', O: '按键O',
    P: '按键P', Q: '按键Q', R: '按键R',
    S: '按键S', T: '按键T', U: '按键U',
    V: '按键V', W: '按键W', X: '按键X',
    Y: '按键Y', Z: '按键Z',
    UP: '上↑', RIGHT: '右→',
    DOWN: '下↓', LEFT: '左←',
    Control: 'Ctrl', Alt: 'Alt',
    Shift: 'Shift', Tab: 'Tab',
    Escape: 'Escape', CapsLock: 'CapsLock', Enter: 'Enter',
    MoveAbsolute: '鼠标移动(绝对位置)',
    MoveRelative: '鼠标移动(相对位置)',
    MouseLeft: '鼠标左键单击', MouseDBLeft: '鼠标左键双击',
    MouseRight: '鼠标右键单击', MouseDBRight: '鼠标右键双击'
}

/**
 * @description 事件类型 - 与 Rust 枚举类型对应
 */
type EvType = 'click' | 'press' | 'left' | 'right' | 'absolute' | 'relative'

/**
 * @description 事件值
 */
type EvCode = 'A' | 'B'
    | 'C' | 'D' | 'E' | 'F' | 'G' | 'H'
    | 'I' | 'J' | 'K' | 'L' | 'M' | 'N'
    | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T'
    | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'
    | 'UP' | 'RIGHT' | 'DOWN' | 'LEFT'
    | 'Control' | 'Alt' | 'Shift' | 'Tab'
    | 'Escape' | 'CapsLock' | 'Enter'
    | 'MoveAbsolute' | 'MoveRelative'
    | 'MouseLeft' | 'MouseDBLeft'
    | 'MouseRight' | 'MouseDBRight'

/**
 * @description 事件存储结构
 */
type EvStoreStruct = {
    // 事件类型
    type: EvType
    // 事件值
    code: EvCode
    // 到上一次触发的时间间隔
    delay: number
    // 鼠标事件(4) - 触发位置
    xy?: [ number, number ]
    // 鼠标点击事件(2) - 是否双击
    db?: boolean
    // 按键事件(1) - 长按按键持续事件
    duration?: number
}

/**
 * @description 单条事件映射
 */
type EvMapItem = {
    code: EvCode
    name: string
}

/**
 * @description 事件自定义名映射
 */
class EvMap {
    #map: Map<EvCode, string> = new Map()

    constructor(mappings?: EvMapItem[]) {
        mappings?.forEach(({ code, name }) => {
            this.#map.set(code, name)
        })
    }

    /**
     * @description 获取事件值的映射名(无映射则返回原事件值)
     * @param code 事件值
     */
    get(code: EvCode) {
        return this.#map.get(code) ?? code
    }

    /**
     * @description 添加映射, 新的映射会覆盖旧的映射
     * @param code 事件值
     * @param name 映射名
     */
    add(code: EvCode, name: string) {
        this.#map.set(code, name)
    }

    toList() {
        const mapList: EvMapItem[] = []
        this.#map.forEach((name, code) => {
            mapList.push({ name, code })
        })
        return mapList
    }
}

export type {
    EvType,
    EvCode,
    EvStoreStruct,
    EvMapItem
}
export {
    EvName,
    EvMap
}