// style
import "element-plus/dist/index.css";
import "@/actors/iconfont.css";
import "@/fonts/iconfont.css";
import "@/styles/theme.scss";
import "@/styles/index.scss";

// core
import { createApp } from "vue";

// plugin
import ElementPlus from "element-plus";
import { createPinia } from "pinia";
import { router } from "@/routers";
import Index from "./Index.vue";

document.documentElement.className = 'elder-' + (localStorage.getItem('elderMode') ?? 'disable')

createApp(Index)
    .use(ElementPlus)
    .use(createPinia())
    .use(router)
    .mount('#app')
