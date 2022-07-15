<script lang="ts" setup>

const HomeList = [
    "1. A link jumps to the how-to video.",
    "2. Send me suggestions/comments using mail.",
    "3. Raise an issue on GitHub.",
    "4. A draggable bar to set the transparency of the app window.",
    "5. Enter the 'Playback' sub-interface.",
    "6. Enter the 'Record' sub-interface.",
    "7. One button click to show/hide the transparency adjustment bar.",
    "8. A switch to toggle whether the window is always-on-top.",
    "9. 'Minimize' button.",
    "10. 'Reload' button.",
    "11. 'Exit' button.",
]
const RecordList = [
    "1. A button click to export recorded events as files with 'toca' suffix.",
    "2. Back to the 'Home' interface.",
    "3. Duration of recording.",
    "4. This will show '录制中...' if recording is in progress.",
    "5. Customizable trigger key to stop recording. (default to 'Escape')",
    "6. Click to start recording 'keyboard' events.",
    "7. Click to start recording 'mouse' events.",
]
const DisplayList = [
    "1. Back to the 'Home' interface.",
    "2. Click to start playing the currently loaded event file.",
    "3. The remaining time of the currently loaded event file.",
    "4. This will show '播放中...' if playing is in progress.",
    "5. Displays whether 'keyboard' or 'mouse' events are currently playing.",
    "6. Select and load a mouse events file. (extended with '.m.toca')",
    "7. Select and load a keyboard events file. (extended with '.k.toca')"
]

const viewOnGithub = (issue: boolean) => {
    window.open('https://github.com/lopo12123/toca-tauri' + (issue ? '/issues' : ''), '__blank')
}
const mailToMe = () => {
    const anchor = document.createElement('a')
    anchor.href = 'mailto:lopo@zju.edu.cn?subject=about toca app'
    anchor.click()
}
const downloadApp = () => {
    window.open('https://github.com/lopo12123/toca-tauri/releases/download/v0.1.0/toca_0.1.0_x64_en-US.msi', '__blank')
}
</script>

<template>
    <div class="docs">
        <div class="banner">
            <div class="item hi-ud" @click="viewOnGithub(false)">
                在 GitHub 查看
            </div>
            <div class="item hi-ud" @click="viewOnGithub(true)">
                报告 Bug
            </div>
            <div class="item hi-ud" @click="mailToMe">
                建议 / 意见
            </div>
            <div class="item hi-ud" @click="downloadApp">
                下载 App
            </div>
        </div>
        <div class="doc-body">
            <div class="block">
                <div class="title-box">Home</div>
                <div class="img-box">
                    <img src="../assets/home.png" alt="home">
                </div>
                <div class="list-box">
                    <div class="line" :key="'home-'+idx"
                         v-for="(item, idx) in HomeList">
                        {{ item }}
                    </div>
                </div>
            </div>
            <div class="block">
                <div class="title-box">Record</div>
                <div class="img-box">
                    <img src="../assets/record.png" alt="record">
                </div>
                <div class="list-box">
                    <div class="line" :key="'record-'+idx"
                         v-for="(item, idx) in RecordList">
                        {{ item }}
                    </div>
                </div>
            </div>
            <div class="block">
                <div class="title-box">Playback</div>
                <div class="img-box">
                    <img src="../assets/display.png" alt="playback">
                </div>
                <div class="list-box">
                    <div class="line" :key="'playback-'+idx"
                         v-for="(item, idx) in DisplayList">
                        {{ item }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@mixin scrollBarStyle($color: #aaa) {
    &::-webkit-scrollbar {
        width: 6px !important;
        height: 6px !important;
    }
    &::-webkit-scrollbar-thumb {
        background-color: $color !important;
        border-radius: 10px !important;
    }
    &::-webkit-scrollbar-track {
        background-color: #00000000 !important;
        border-radius: 10px !important;
        opacity: 0 !important;
    }
}

// highlight-underline
.hi-ud {
    position: relative;

    &::before {
        content: "";
        position: absolute;
        width: 0;
        height: 2px;
        bottom: 0;
        left: 50%;
        border-radius: 2px;
        background-color: #777;
        transition: all 0.5s;
    }

    &:hover {
        &::before {
            width: 100%;
            left: 0;
        }
    }
}

.docs {
    position: relative;
    width: 60%;
    height: 100%;
    margin: 0 20%;
    background-color: #f8f8f8;
    color: #555;
    font-size: 0.875rem;

    .banner {
        position: relative;
        width: calc(100% - 2rem);
        height: 2.5rem;
        padding: 0 1rem;
        background-color: #f0f0f0;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .item {
            position: relative;
            height: 1.5rem;
            margin: 0 0.5rem;
            line-height: 1.5rem;
            user-select: none;
            cursor: pointer;
        }
    }

    .doc-body {
        @include scrollBarStyle();
        position: relative;
        width: calc(100% - 2rem);
        height: calc(100% - 2.5rem - 2rem);
        padding: 1rem;
        overflow: hidden auto;

        .block {
            position: relative;
            width: 100%;

            .title-box {
                position: relative;
                height: 1.5rem;
                text-align: center;
                line-height: 1.5rem;
                font-size: 1.5rem;
            }

            .img-box {
                position: relative;
                width: 100%;
                margin: 0.5rem 0;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .list-box {
                position: relative;
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: flex-start;

                .line {
                    position: relative;
                    width: 100%;
                    line-height: 1.5rem;
                    word-break: break-word;
                }
            }
        }
    }
}
</style>