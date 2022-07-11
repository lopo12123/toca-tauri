import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: () => import("@/views/Home.vue")
    },
    {
        path: '/record-view',
        name: 'RecordView',
        component: () => import("@/views/RecordView.vue")
    },
    {
        path: '/display-view',
        name: 'DisplayView',
        component: () => import("@/views/DisplayView.vue")
    }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})