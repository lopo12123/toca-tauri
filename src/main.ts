// style
import "element-plus/dist/index.css";
import "@/actors/iconfont.css";
import "@/fonts/iconfont.css";
import "@/styles/theme.scss";
import "@/styles/index.scss";
import "@/fonts/fonts.scss";

// core
import { createApp } from "vue";

// plugin
import ElementPlus from "element-plus";
import { createPinia } from "pinia";
import { router } from "@/routers";
import Index from "./Index.vue";

createApp(Index)
    .use(router)
    .use(createPinia())
    .use(ElementPlus)
    .mount('#app')
