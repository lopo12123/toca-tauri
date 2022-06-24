// style
import "element-plus/dist/index.css";
import "@/styles/light_dark.scss";
import "@/styles/index.scss";

// core
import { createApp } from "vue";

// plugin
import ElementPlus from "element-plus";
import { createPinia } from "pinia";
import { router } from "@/routers";
import App from "./App.vue";

createApp(App)
    .use(ElementPlus)
    .use(createPinia())
    .use(router)
    .mount('#app')
