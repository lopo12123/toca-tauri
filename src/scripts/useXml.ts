// region action 类型
import { XMLBuilder, XMLParser } from "fast-xml-parser";

type Action_mouse_move = {
    type: 'absolute' | 'relative'
    delay: number
    xy: [ number, number ]
}
type Action_mouse_click = {
    type: 'left' | 'right'
    delay: number
    xy: [ number, number ]
    db: boolean
}
type Action_key = {
    type: 'click'
    delay: number
    key: string,
} | {
    type: 'press'
    delay: number
    key: string,
    duration: number
}
/**
 * @description 全部的 action 类型
 */
type ActionType = Action_mouse_move | Action_mouse_click | Action_key

// endregion

type XmlObj = {
    // xml 根标签
    Toca: {
        Action: ActionType[]
    }
}

/**
 * @description xml -> obj
 * @param xml
 */
const xml2obj = (xml: string): XmlObj => {
    return new XMLParser().parse(xml)
}

/**
 * @description obj -> xml
 * @param obj
 */
const obj2xml = (obj: XmlObj) => {
    return new XMLBuilder({}).build(obj)
}

export type { XmlObj }
export { xml2obj, obj2xml }