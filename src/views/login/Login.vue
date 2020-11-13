<template>
    <div class="login">
        <div class="logo"></div>
        <div class="box-login">
            <h3 class="loginTitle">
                <span class="logoImg"></span>南京市生物样本监测检验信息管理系统
            </h3>
            <div class="mt30">
                <el-input placeholder="登录账号" v-model="loginName">
                    <el-button
                        slot="prepend"
                        icon="icon iconfont iconwode"
                    ></el-button>
                </el-input>
            </div>
            <div class="mt15">
                <el-input placeholder="登录密码" type="password" v-model="pwd">
                    <el-button
                        slot="prepend"
                        icon="icon iconfont iconmima"
                    ></el-button>
                </el-input>
            </div>
            <div class="mt30">
                <el-button type="primary" style="width:100%;" @click="login"
                    >登录</el-button
                >
            </div>
        </div>
    </div>
</template>

<script>
//import { loginRegistrApi } from "@/api/api";
export default {
    data() {
        return {
            loginName: "",
            pwd: ""
        };
    },
    mounted() {
        // 绑定enter事件
        this.enterKeyup();
    },
    destroyed() {
        // 销毁enter事件
        this.enterKeyupDestroyed();
    },
    methods: {
        // 登录
        login() {
            if (!this.loginName.trim()) {
                this.$message({
                    type: "error",
                    message: "请输入登录账号",
                    duration: 2000,
                    showClose: true
                });

                return;
            }

            if (!this.pwd.trim()) {
                this.$message({
                    type: "error",
                    message: "请输入登录密码",
                    duration: 2000,
                    showClose: true
                });

                return;
            }

            let userInfo = {
                userName: "黄sir",
                loginName: "huang",
                roleId: "superAdmin",
                roleName: "超级管理员"
            };

            /*
             * 角色roleId取值：
             * 超级管理员："superAdmin"
             * 管理员："admin"
             * 采集人员："cjr"
             * 检测人员："jcr"
             * 审批人员："spr"
             * */

            sessionStorage.setItem("USERINFO", JSON.stringify(userInfo));

            let path = "";

            switch (userInfo.roleId) {
                case "superAdmin":
                    path = "/collect";
                    break;
                case "admin":
                    path = "/manage";
                    break;
                case "cjr":
                    path = "/collect";
                    break;
                case "jcr":
                    path = "/check";
                    break;
                case "spr":
                    path = "/approve";
                    break;
            }
            // 跳转
            this.$router.push(path);
        },
        // 绑定enter事件
        enterKeyup() {
            document.addEventListener("keyup", this.enterKey);
        },
        enterKey(e) {
            let eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
            if (eCode == 13) {
                this.login();
            }
        },
        enterKeyupDestroyed() {
            document.removeEventListener("keyup", this.enterKey);
        }
    }
};
</script>

<style lang="scss">
.login {
    position: relative;
    width: 100%;
    height: 100%;
    background-position: center center;
    background-size: contain;
    background: url("../../assets/img/login_bg.jpg");

    .logo {
        display: inline-block;
        width: 500px;
        height: 60px;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        position: absolute;
        top: 10px;
        left: 20px;
        background: url(../../assets/img/l_logo.png);
        background-position: center;
    }

    .box-login {
        position: fixed;
        top: 50%;
        left: 50%;
        width: 500px;
        transform: translate(-50%, -50%);
        border-radius: 4px;
        background: #fff;
        padding: 40px;
    }

    .loginTitle {
        text-align: center;
        font-size: 22px;

        .logoImg {
            display: inline-block;
            margin-right: 5px;
            width: 30px;
            height: 30px;
            vertical-align: bottom;
            background: url(../../assets/img/s_logo.jpg);
            background-position: center center;
            background-size: 100%;
        }
    }
}
</style>
