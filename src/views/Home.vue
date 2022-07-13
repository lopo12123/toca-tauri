<script lang="ts" setup>
import { useRouter } from "vue-router";
import { open } from "@tauri-apps/api/shell";
import { useNotification } from "@/scripts/useNotification";

const router = useRouter()

const openLink = (link: 'project' | 'mit' | 'issue' | 'mail' | 'video') => {
    switch(link) {
        case "project":
            open('https://github.com/lopo12123/toca-tauri')
                .catch(() => {
                    useNotification('打开浏览器失败')
                })
            break
        case "mit":
            open('https://mit-license.org/')
                .catch(() => {
                    useNotification('打开浏览器失败')
                })
            break
        case "issue":
            open('https://github.com/lopo12123/toca-tauri/issues')
                .catch(() => {
                    useNotification('打开浏览器失败')
                })
            break
        case "mail":
            open('mailto:lopo@zju.edu.cn?subject=something-about-toca')
                .catch(() => {
                    useNotification('打开邮件失败')
                })
            break
        case "video":
            useNotification('暂无')
            break
    }
}

const makeChoice = (choice: 'record' | 'display') => {
    if(choice === 'record') router.push({ name: 'RecordView' })
    else if(choice === 'display') router.push({ name: 'DisplayView' })
}
</script>

<template>
    <div class="home">
        <div class="links">
            <div class="link" title="Bug或其他问题"
                 @click="openLink('issue')">
                <i class="iconfont icon-jiaocheng-1"/>
                <span>问题</span>
            </div>
            <div class="link" title="意见/建议"
                 @click="openLink('mail')">
                <i class="iconfont icon-youxiang"></i>
                <span>反馈</span>
            </div>
            <div class="link" title="使用方法"
                 @click="openLink('video')">
                <i class="iconfont icon-shipin"></i>
                <span>视频</span>
            </div>
        </div>

        <div class="overview">
            <div class="logo">a logo here.</div>
<!--            <div class="license">-->
<!--                <div class="inner">-->
<!--                    The-->
<!--                    <span class="link-text" @click="openLink('project')">project</span>-->
<!--                    is licensed under-->
<!--                    <span class="link-text" @click="openLink('mit')">"MIT"</span>.-->
<!--                </div>-->
<!--            </div>-->
        </div>
        <div class="options">
            <div class="option-btn" @click="makeChoice('record')">录制</div>
            <div class="option-btn" @click="makeChoice('display')">播放</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use "src/styles/mixin";

.home {
    position: relative;
    width: calc(100% - 1rem);
    height: calc(100% - 1rem);
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .overview {
        position: relative;
        width: 7rem;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .license {
            position: relative;
            width: 100%;
            background-color: var(--background-color);

            .inner {
                //@include mixin.textInLine;
                position: relative;
                font-size: 0.875rem;
                font-style: italic;
                word-break: break-word;

                .link-text {
                    text-decoration: underline;
                    cursor: pointer;
                }
            }
        }
    }

    .links {
        position: relative;
        width: 3rem;
        height: 100%;
        padding: 0 0.5rem;
        border: solid 1px var(--separator-stroke);
        border-radius: 0.25rem;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

        .link {
            &:hover {
                text-decoration: underline;
            }

            span {
                margin-left: 0.25rem;
                font-size: 0.875rem;
            }
        }
    }

    .options {
        position: relative;
        width: 5rem;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

        .option-btn {
            position: relative;
            width: calc(5rem - 2px);
            height: 1.5rem;
            border: solid 1px var(--border-color);
            border-radius: 2px;
            user-select: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;

            &:hover {
                background-color: var(--background-color__dark);
            }
        }
    }
}
</style>