import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
};

const routes = [
    {
        path: "/",
        redirect: { path: "/login" }
    },
    {
        path: "/login",
        component: () => import("../views/login/Login.vue")
    },
    {
        path: "/home",
        component: () => import("../views/home/Home.vue")
    },
    {
        // 采集系统
        path: "/collect",
        redirect: {
            path: "/collect/sampling"
        },
        component: {
            template: `<router-view></router-view>`
        },
        children: [
            {
                // 采样数据
                path: "sampling",
                component: () => import("../views/collect/Sampling.vue")
            },
            {
                // 检测数据
                path: "check",
                component: () => import("../views/collect/Check.vue")
            }
        ]
    },
    {
        // 检测系统
        path: "/check",
        redirect: {
            path: "/check/sampling"
        },
        component: {
            template: `<router-view></router-view>`
        },
        children: [
            {
                // 采样数据
                path: "sampling",
                component: () => import("../views/check/Sampling.vue")
            },
            {
                // 检测数据
                path: "check",
                component: () => import("../views/check/Check.vue")
            }
        ]
    },
    {
        // 审批系统
        path: "/approve",
        redirect: {
            path: "/approve/approveSpecimen"
        },
        component: {
            template: `<router-view></router-view>`
        },
        children: [
            {
                // 审批样本
                path: "approveSpecimen",
                component: () => import("../views/approve/ApproveSpecimen.vue")
            }
        ]
    },
    {
        // 管理系统
        path: "/manage",
        redirect: {
            path: "/manage/user"
        },
        component: {
            template: `<router-view></router-view>`
        },
        children: [
            {
                // 用户管理
                path: "user",
                component: () => import("../views/manage/User.vue")
            },
            {
                // 用户管理
                path: "role",
                component: () => import("../views/manage/Role.vue")
            },
            {
                // 采样点管理
                path: "samplingPoint",
                component: () => import("../views/manage/SamplingPoint.vue")
            },
            {
                // 实验室管理
                path: "laboratory",
                component: () => import("../views/manage/Laboratory.vue")
            },
            {
                // 数据字典管理
                path: "dict",
                component: () => import("../views/manage/Dict.vue")
            },
            {
                // 报表管理
                path: "report",
                component: () => import("../views/manage/Report.vue")
            },
            {
                // 操作日志
                path: "log",
                component: () => import("../views/manage/Log.vue")
            }
        ]
    }
];

const router = new VueRouter({
    routes
});

router.beforeEach((to, from, next) => {
    let userInfo_str = sessionStorage.getItem("USERINFO");
    if (!userInfo_str && to.path != "/login") {
        next("/");
    } else {
        next();
    }
});

export default router;
