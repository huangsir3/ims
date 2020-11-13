<template>
    <div class="nav">
        <div class="header-title">
            <img src="@/assets/img/logo.png" alt="" />{{ currentSystem }}
        </div>
        <el-menu
            :default-active="itemActive"
            menu-trigger="click"
            @select="select"
            :unique-opened="true"
            class="el-menu-vertical-demo"
            background-color="#001529"
            text-color="#aaa"
            active-text-color="#fff"
        >
            <template v-for="(item, index) in navList">
                <el-menu-item
                    :index="index + ''"
                    :key="index"
                    v-if="
                        roleId == 'superAdmin' ||
                            (roleId == 'admin' && item.system == '管理系统') ||
                            (roleId == 'cjr' && item.system == '采集系统') ||
                            (roleId == 'jcr' && item.system == '检测系统') ||
                            (roleId == 'spr' && item.system == '审批系统')
                    "
                >
                    <i class="mr5 iconfont" :class="item.icon"></i>
                    <span slot="title">{{ item.title }}</span>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
</template>

<script>
export default {
    props: ["itemActive"],
    data() {
        return {
            roleId: "",
            navList: [
                {
                    title: "采样数据",
                    icon: "iconcaiyangshuju",
                    link: "/collect/sampling",
                    system: "采集系统"
                },
                {
                    title: "检测数据",
                    icon: "iconjianceshuju",
                    link: "/collect/check",
                    system: "采集系统"
                },
                {
                    title: "采样数据",
                    icon: "iconcaiyangshuju",
                    link: "/check/sampling",
                    system: "检测系统"
                },
                {
                    title: "检测数据",
                    icon: "iconjianceshuju",
                    link: "/check/check",
                    system: "检测系统"
                },
                {
                    title: "审批样本",
                    icon: "iconshenpiyangben",
                    link: "/approve/approveSpecimen",
                    system: "审批系统"
                },
                {
                    title: "用户管理",
                    icon: "iconyonghuguanli",
                    link: "/manage/user",
                    system: "管理系统"
                },
                {
                    title: "采样点管理",
                    icon: "iconcaiyangdian",
                    link: "/manage/samplingPoint",
                    system: "管理系统"
                },
                {
                    title: "实验室管理",
                    icon: "iconshiyanguanli",
                    link: "/manage/laboratory",
                    system: "管理系统"
                },
                {
                    title: "数据字典管理",
                    icon: "iconshujuzidian",
                    link: "/manage/dict",
                    system: "管理系统"
                },
                {
                    title: "报表管理",
                    icon: "iconbaobiao",
                    link: "/manage/report",
                    system: "管理系统"
                },
                {
                    title: "操作日志",
                    icon: "iconrizhi",
                    link: "/manage/log",
                    system: "管理系统"
                } /*,
                {
                    title: "角色管理",
                    icon: "iconyonghuguanli",
                    link: "/manage/role",
                    system: "管理系统"
                }*/
            ]
        };
    },
    computed: {
        currentSystem: function() {
            return this.navList[Number.parseInt(this.itemActive)].system;
        }
    },
    created() {
        // 获取用户信息
        let userInfo = JSON.parse(sessionStorage.getItem("USERINFO"));
        this.roleId = userInfo.roleId;
    },
    methods: {
        select(index) {
            let path = this.navList[Number.parseInt(index)].link;
            console.log(path);
            if (this.$route.path == path) {
                location.reload();
            } else {
                this.$router.push(path);
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.el-menu-item.is-active {
    background-color: #1890ff !important;
}
.nav {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: $nav-width;
    background-color: #001529;
    z-index: 9;
}
.header-title {
    height: $header-height;
    line-height: $header-height;
    padding-left: 20px;
    font-size: 20px;
    background: #002140;
    color: #fff;
    font-weight: 600;
    img {
        vertical-align: -3px;
        margin-right: 8px;
        height: 50%;
    }
}
.el-menu {
    border: none;
}
</style>
