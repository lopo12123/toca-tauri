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
    Toca: {
        hash: string
        action_type: 'keyboard' | 'mouse'
        action: KeyboardAction | MouseAction
    }
}

/**
 * @description 校验文件 hash 和 类型 是否正确
 * @param xml_obj
 * @param action_type
 */
const doVerify = (xml_obj: XMLStruct, action_type: 'keyboard' | 'mouse'): boolean => {
    try {
        const hash_again = SHA256(JSON.stringify(xml_obj.Toca.action)) + ''
        return hash_again === xml_obj.Toca.hash && action_type === xml_obj.Toca.action_type
    }
    catch (e) {
        return false
    }
}

const obj2xml = (action_obj: KeyboardAction | MouseAction, action_type: 'keyboard' | 'mouse'): string | null => {
    try {
        const hash = SHA256(JSON.stringify(action_obj)) + ''
        const xml_obj: XMLStruct = {
            Toca: {
                hash,
                action_type,
                action: action_obj
            }
        }
        return new XMLBuilder({}).build(xml_obj)
    }
    catch (e) {
        return null
    }
}

const xml2obj = (xml_str: string, action_type: 'keyboard' | 'mouse', verify: boolean = false): XMLStruct | null => {
    try {
        const xml_obj = new XMLParser().parse(xml_str) as XMLStruct

        if(verify && !doVerify(xml_obj, action_type)) return null

        return xml_obj
    }
    catch (e) {
        return null
    }
}

const download_xml = (xml: string, action_type: 'keyboard' | 'mouse') => {
    const anchor = document.createElement('a')
    anchor.download = `${ action_type }_${ Date.now() }.toca`
    anchor.href = 'data:text/plain;charset=utf-8,' + xml
    anchor.click()
}

export {
    doVerify,
    xml2obj, obj2xml,
    download_xml
}