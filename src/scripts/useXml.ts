import { XMLBuilder, XMLParser } from "fast-xml-parser";
import { EvMapItem, EvStoreStruct } from "@/scripts/useEv";

type StorageStruct = {
    // xml 根标签
    Toca: {
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
 * @description obj -> xml
 * @param obj
 */
const obj2xml = (obj: StorageStruct) => {
    return new XMLBuilder({}).build(obj)
}

export type { StorageStruct }
export { xml2obj, obj2xml }