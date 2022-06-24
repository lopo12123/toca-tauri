<script lang="ts" setup>
import { XMLBuilder, XMLParser } from "fast-xml-parser";
import { XmlObj } from "@/scripts/useXml";
import { ref } from "vue";

const xml = ref('')
const obj: XmlObj = {
    Toca: {
        Action: [
            // mouse move
            { type: 'absolute', delay: 122, xy: [ 0, 0 ] },
            { type: 'relative', delay: 1000, xy: [ 95, 100 ] },
            // mouse click
            { type: 'left', delay: 333, xy: [ 50, 50 ], db: true },
            { type: 'right', delay: 333, xy: [ 100, 100 ], db: false },
            // key event
            { type: 'click', delay: 0, key: 'c' },
            { type: 'press', delay: 1000, key: '3', duration: 100 }
        ]
    }
}

const doParse = () => {
    console.log(new XMLParser().parse(xml.value))
}

const doBuild = () => {
    xml.value = new XMLBuilder({}).build(obj)
    console.log(xml.value)
}
</script>

<template>
    <div class="test">
        <button @click="doParse">doParse</button>
        <button @click="doBuild">doBuild</button>
    </div>
</template>

<style lang="scss" scoped>
.test {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>