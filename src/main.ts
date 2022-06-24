// style
import "@/styles/light_dark.scss";
import "@/styles/index.scss";

// core
import { createApp } from "vue";

// plugin
import { createPinia } from "pinia";
import { router } from "@/routers";
import App from "./App.vue";

createApp(App)
    .use(createPinia())
    .use(router)
    .mount('#app')
