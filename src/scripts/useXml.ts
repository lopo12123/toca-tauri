import SHA256 from "crypto-js/sha256";
import { XMLBuilder, XMLParser } from "fast-xml-parser";
import { EvMapItem, EvStoreStruct } from "@/scripts/useEv";

type StorageStruct = {
    // xml 根标签
    Toca: {
        // 校验值
        HASH?: string
        // 事件映射 (可选自定义内容)
        EvMap?: EvMapItem[]
        // 事件序列
        Action: EvStoreStruct[]
    }
}

/**
 * @description xml -> obj
 * @param xml
 */
const xml2obj = (xml: string): StorageStruct => {
    return new XMLParser().parse(xml)
}

/**
 * @description obj -> xml 每次都会重新计算 hash 值
 * @param obj
 */
const obj2xml = (obj: StorageStruct) => {
    obj.Toca.HASH = hash_of_obj(obj)
    return new XMLBuilder({}).build(obj)
}

/**
 * @description 根据 obj 的 EvMap 和 Action 字段计算 hash
 * @param obj
 */
const hash_of_obj = (obj: StorageStruct) => {
    const str_to_hash = new XMLBuilder({}).build({
        Toca: {
            EvMap: obj.Toca.EvMap,
            Action: obj.Toca.Action
        }
    } as StorageStruct)
    return SHA256(str_to_hash) + ''
}

/**
 * @description 校验 obj
 * @param obj
 */
const verify_obj = (obj: StorageStruct) => {
    try {
        // 读取得到
        const hash_in_obj = obj.Toca.HASH
        // 计算得到
        const hash_from_obj = hash_of_obj(obj)

        return hash_in_obj === hash_from_obj
    }
    catch (e) {
        return false
    }
}

/**
 * @description 校验 xml
 * @param xml
 */
const verify_xml = (xml: string) => {
    try {
        const obj = xml2obj(xml)
        return verify_obj(obj)
    }
    catch (e) {
        return false
    }
}

/**
 * @description 根据参数自动校验
 * @param source
 */
function verify(source: { type: 'xml', data: string } | { type: 'obj', data: StorageStruct }) {
    if(source.type === 'xml') return verify_xml(source.data)
    else return verify_obj(source.data)
}

export type { StorageStruct }
export {
    xml2obj, obj2xml,
    verify, verify_obj, verify_xml
}