import "@/styles/index.scss";
import { createApp } from "vue";
import { router } from "@/routers";
import App from "./App.vue";

createApp(App)
    .use(router)
    .mount('#app')
