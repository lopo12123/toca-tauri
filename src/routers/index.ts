import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Index',
        component: () => import("@/views/Index.vue")
    },
    {
        path: '/test',
        name: 'Text',
        component: () => import("@/views/Test.vue")
    }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})