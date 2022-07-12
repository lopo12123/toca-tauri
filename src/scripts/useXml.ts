import SHA256 from "crypto-js/sha256";
import { XMLBuilder, XMLParser } from "fast-xml-parser";

type KeyboardAction = {
    evs: {
        code: string
        press: boolean
        timestamp: number
    }[]
    till: number
}
type MouseAction = {
    evs: {
        ev_name: 1 | 2 | 3 | 4 | 5 | 6
        position: [ number, number ]
        timestamp: number
    }[]
    till: number
}
type XMLStruct = {
    hash: string
    action_type: 'keyboard' | 'mouse'
    action: KeyboardAction | MouseAction
}

/**
 * @description 校验文件 hash 和 类型 是否正确
 * @param xml_obj
 * @param action_type
 */
const verify = (xml_obj: XMLStruct, action_type: 'keyboard' | 'mouse'): boolean => {
    try {
        const hash_again = SHA256(JSON.stringify(xml_obj.action)) + ''
        return hash_again === xml_obj.hash && action_type === xml_obj.action_type
    }
    catch (e) {
        return false
    }
}

const obj_to_xml = (action_obj: KeyboardAction | MouseAction, action_type: 'keyboard' | 'mouse'): string | null => {
    try {
        const hash = SHA256(JSON.stringify(action_obj)) + ''
        const xml_obj: XMLStruct = {
            hash,
            action_type,
            action: action_obj
        }
        return new XMLBuilder({}).build(xml_obj)
    }
    catch (e) {
        return null
    }
}

const xml_to_obj = (xml_str: string, verify: boolean = false): XMLStruct | null => {
    try {
        const xml_obj = new XMLParser().parse(xml_str) as XMLStruct
        if(verify) {

        }

        return xml_obj
    }
    catch (e) {
        return null
    }
}

// import { XMLBuilder, XMLParser } from "fast-xml-parser";
//
//
// /**
//  * @description xml -> obj
//  * @param xml
//  */
// const xml2obj = (xml: string): any => {
//     return new XMLParser().parse(xml)
// }
//
// /**
//  * @description obj -> xml 每次都会重新计算 hash 值
//  * @param obj
//  */
// const obj2xml = (obj: any) => {
//     obj.Toca.HASH = hash_of_obj(obj)
//     return new XMLBuilder({}).build(obj)
// }
//
// /**
//  * @description 根据 obj 的 EvMap 和 Action 字段计算 hash
//  * @param obj
//  */
// const hash_of_obj = (obj: StorageStruct) => {
//     const str_to_hash = new XMLBuilder({}).build({
//         Toca: {
//             EvMap: obj.Toca.EvMap,
//             Action: obj.Toca.Action
//         }
//     } as StorageStruct)
//     return SHA256(str_to_hash) + ''
// }
//
// /**
//  * @description 校验 obj
//  * @param obj
//  */
// const verify_obj = (obj: StorageStruct) => {
//     try {
//         // 读取得到
//         const hash_in_obj = obj.Toca.HASH
//         // 计算得到
//         const hash_from_obj = hash_of_obj(obj)
//
//         return hash_in_obj === hash_from_obj
//     }
//     catch (e) {
//         return false
//     }
// }
//
// /**
//  * @description 校验 xml
//  * @param xml
//  */
// const verify_xml = (xml: string) => {
//     try {
//         const obj = xml2obj(xml)
//         return verify_obj(obj)
//     }
//     catch (e) {
//         return false
//     }
// }
//
// /**
//  * @description 根据参数自动校验
//  * @param source
//  */
// function verify(source: { type: 'xml', data: string } | { type: 'obj', data: StorageStruct }) {
//     if(source.type === 'xml') return verify_xml(source.data)
//     else return verify_obj(source.data)
// }
//
// export type { StorageStruct }
// export {
//     xml2obj, obj2xml,
//     verify, verify_obj, verify_xml
// }

export {}