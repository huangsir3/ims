<template>
    <div class="header">
        <!--个人信息-->
        <el-dropdown trigger="click" @command="handleCommand">
            <div>
                <img
                    class="user-icon"
                    src="@/assets/img/user4-128x128.jpg"
                    alt=""
                />{{ userName
                }}<i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1"
                    ><i class="iconfont iconmima"></i>
                    修改密码</el-dropdown-item
                >
                <el-dropdown-item command="2"
                    ><i class="iconfont icontuichu"></i> 退出</el-dropdown-item
                >
            </el-dropdown-menu>
        </el-dropdown>

        <!--时间日期-->
        <div class="datetime fr mr10">
            <div class="fr font14 mt10">
                <div>{{ datetime | formatDate("yyyy-MM-dd") }}</div>
                <div>{{ datetime | formatDay() }}</div>
            </div>
            <div class="time fr font40 mr10">
                {{ datetime | formatDate("hh:mm:ss") }}
            </div>
        </div>

        <!--修改密码-->
        <el-dialog
            title="修改密码"
            :visible.sync="dialogVisible"
            width="30%"
            :append-to-body="true"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
        >
            <el-form
                :model="updatePwdForm"
                ref="updatePwdForm"
                :rules="rules"
                label-width="80px"
            >
                <el-form-item label="旧密码" prop="oldPaw">
                    <el-input
                        v-model="updatePwdForm.oldPaw"
                        type="password"
                        :clearable="true"
                        autocomplete="off"
                        placeholder="请输入旧密码"
                    ></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPwd">
                    <el-input
                        v-model="updatePwdForm.newPwd"
                        type="password"
                        :clearable="true"
                        autocomplete="off"
                        placeholder="请输入新密码"
                    ></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPwd">
                    <el-input
                        v-model="updatePwdForm.checkPwd"
                        type="password"
                        :clearable="true"
                        autocomplete="off"
                        placeholder="请确认密码"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="warning" size="small" @click="onReset"
                    >重置</el-button
                >
                <el-button type="primary" size="small" @click="onSubmit"
                    >修改</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        var validatePawd = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("不能为空"));
            } else if (value !== this.updatePwdForm.newPwd) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };
        return {
            datetime: "",
            userName: "超级管理员",
            dialogVisible: false,
            int: null,
            updatePwdForm: {
                oldPaw: "",
                newPwd: "",
                checkPwd: ""
            },
            rules: {
                oldPaw: [{ required: true, message: "不能为空" }],
                newPwd: [{ required: true, message: "不能为空" }],
                checkPwd: [{ required: true, validator: validatePawd }]
            }
        };
    },
    destroyed() {
        // 销毁enter事件
        clearInterval(this.int);
    },
    created() {
        this.datetime = Date.now();

        this.int = setInterval(() => {
            this.datetime = Date.now();
        }, 1000);
    },
    methods: {
        handleCommand(command) {
            if (command == "1") {
                // 修改密码
                this.dialogVisible = true;
                this.$nextTick(() => {
                    this.$refs["updatePwdForm"].resetFields();
                });
            } else {
                // 退出
                this.$router.replace("/login");
            }
        },
        onSubmit() {
            this.$refs["updatePwdForm"].validate(valid => {
                if (valid) {
                    this.$confirm("确认修改？")
                        .then(() => {
                            this.dialogVisible = false;
                        })
                        .catch(() => {});
                } else {
                    return false;
                }
            });
        },
        onReset() {
            this.$nextTick(() => {
                this.$refs["updatePwdForm"].resetFields();
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.header {
    position: fixed;
    top: 0;
    left: 200px;
    right: 0;
    height: 60px;
    background-color: #fff;
    border-bottom: 1px solid #edf5fb;
    z-index: 9;
}
.el-dropdown {
    float: right;
    height: 60px;
    line-height: 60px;
    padding: 0 15px;
    cursor: pointer;
    &:hover {
        background-color: #f7f7f7;
    }
}
.user-icon {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    vertical-align: -10px;
    margin-right: 10px;
}
.time {
    height: 60px;
    line-height: 60px;
    font-weight: bold;
}
</style>
