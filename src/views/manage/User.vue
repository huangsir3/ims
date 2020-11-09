<template>
    <div class="">
        <Header></Header>
        <Nav itemActive="5"></Nav>
        <div
            class="pageContent"
            v-loading.fullscreen.lock="loading"
            element-loading-background="rgba(255, 255, 255, 0.5)"
        >
            <el-card class="box-card">
                <div class="box-search">
                    <el-form
                        :inline="true"
                        :model="form"
                        size="small"
                        label-width="100px"
                    >
                        <el-form-item label="姓名">
                            <el-input
                                v-model="form.name"
                                :clearable="true"
                                placeholder="姓名"
                            ></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSearch"
                                >查询</el-button
                            >
                            <el-button type="warning" @click="onReset"
                                >重置</el-button
                            >
                        </el-form-item>
                    </el-form>
                </div>
                <div class="clearfix mt20">
                    <el-button
                        size="mini"
                        type="primary"
                        class="mb10"
                        @click="handleAdd()"
                        ><i class="el-icon-plus"></i> 新增用户</el-button
                    >
                </div>
                <el-table :data="tableData" size="small" style="width: 100%">
                    <el-table-column
                        type="index"
                        label="序号"
                        width="100"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="userName"
                        label="姓名"
                        align="center"
                        width="150"
                    ></el-table-column>
                    <el-table-column
                        prop="loginName"
                        label="登入账号"
                        align="center"
                        width="150"
                    ></el-table-column>
                    <el-table-column
                        prop="phone"
                        label="电话"
                        align="center"
                        width="200"
                    ></el-table-column>
                    <el-table-column
                        prop="roleName"
                        label="角色名称"
                        align="center"
                        width="200"
                    ></el-table-column>
                    <el-table-column label="性别" width="100" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.sex | getSexName }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="corporate_name"
                        label="采集点地址"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="laboratory_name"
                        label="实验室地址"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        label="操作"
                        fixed="right"
                        align="center"
                        width="210"
                    >
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                @click="handleEdit(scope.$index, scope.row)"
                                >编辑</el-button
                            >
                            <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)"
                                >删除</el-button
                            >
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    class="mt20"
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page.currentPage"
                    :page-sizes="page.pageSizes"
                    :page-size="page.pageSize"
                    :total="page.total"
                    layout="total, sizes, prev, pager, next, jumper"
                >
                </el-pagination>
            </el-card>
            <el-dialog
                :title="tbDialog.dialogTitle"
                :visible.sync="tbDialog.dialogVisible"
                width="50%"
                :append-to-body="true"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                v-loading.lock="tbDialog.loading"
                element-loading-background="rgba(255, 255, 255, 0.5)"
            >
                <el-form
                    :model="infoForm"
                    ref="infoForm"
                    size="small"
                    :rules="rules"
                    label-width="100px"
                >
                    <el-row>
                        <el-col :lg="12">
                            <el-form-item label="姓名" prop="userName">
                                <el-input
                                    v-model="infoForm.userName"
                                    :clearable="true"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="12">
                            <el-form-item label="性别">
                                <el-select
                                    v-model="infoForm.sex"
                                    placeholder="请选择"
                                    class="display-block"
                                >
                                    <el-option
                                        v-for="(item, index) in sexs"
                                        :key="index"
                                        :label="item.name"
                                        :value="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="12">
                            <el-form-item label="登入账号" prop="loginName">
                                <el-input
                                    v-model="infoForm.loginName"
                                    :clearable="true"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="12">
                            <el-form-item label="登入密码" prop="pwd">
                                <el-input
                                    v-model="infoForm.pwd"
                                    type="password"
                                    autocomplete="off"
                                    :clearable="true"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="12">
                            <el-form-item label="电话" prop="phone">
                                <el-input
                                    v-model="infoForm.phone"
                                    autocomplete="off"
                                    :clearable="true"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="12">
                            <el-form-item label="角色">
                                <el-select
                                    v-model="infoForm.roleId"
                                    placeholder="请选择"
                                    class="display-block"
                                >
                                    <el-option
                                        v-for="(item, index) in roles"
                                        :key="index"
                                        :label="item.name"
                                        :value="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="12" v-if="infoForm.roleId == 'cjr'">
                            <el-form-item
                                label="所在疾控单位"
                                prop="samplingUnitID"
                            >
                                <el-select
                                    v-model="infoForm.samplingUnitID"
                                    placeholder="请选择"
                                    class="display-block"
                                >
                                    <el-option
                                        v-for="(item, index) in samplingUnits"
                                        :key="index"
                                        :label="item.corporate_name"
                                        :value="item.uuid"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="12" v-if="infoForm.roleId == 'jcr'">
                            <el-form-item label="所在实验室" prop="cdcCode">
                                <el-select
                                    v-model="infoForm.cdcCode"
                                    placeholder="请选择"
                                    class="display-block"
                                >
                                    <el-option
                                        v-for="(item, index) in laboratorys"
                                        :key="index"
                                        :label="item.name"
                                        :value="item.code"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button
                        type="warning"
                        size="small"
                        @click="dialogBtnReset"
                        >重置</el-button
                    >
                    <el-button
                        type="primary"
                        size="small"
                        @click="dialogBtnSure"
                        >确定</el-button
                    >
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { commonApi, manageApi } from "@/api/api";
import Header from "@/components/Header.vue";
import Nav from "@/components/Nav.vue";

let global_roles = [
    { name: "超级管理员", value: "superAdmin" },
    { name: "管理人员", value: "admin" },
    { name: "采集人员", value: "cjr" },
    { name: "检测人员", value: "jcr" },
    { name: "审批人员", value: "spr" }
];

let global_sexs = [
    { name: "男", value: 0 },
    { name: "女", value: 1 }
];

export default {
    components: { Header, Nav },
    data() {
        var validatePhone = (rule, value, callback) => {
            if (value) {
                let reg = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/;
                if (!reg.test(value) || value.length != 11) {
                    callback(new Error("请输入正确手机号"));
                }
            } else {
                callback();
            }
        };
        var validateSamplingUnitID = (rule, value, callback) => {
            if (this.infoForm.roleId == "cjr" && !value) {
                callback(new Error("不能为空"));
            } else {
                callback();
            }
        };
        var validateCdcCode = (rule, value, callback) => {
            if (this.infoForm.roleId == "jcr" && !value) {
                callback(new Error("不能为空"));
            } else {
                callback();
            }
        };
        return {
            loading: false,
            form: {
                name: ""
            },
            infoForm: {},
            infoForm_bak: {},
            page: {
                pageSizes: [10, 20, 30, 50, 100],
                pageSize: 10,
                total: 400,
                currentPage: 1
            },
            roles: global_roles,
            sexs: global_sexs,
            samplingUnits: [],
            laboratorys: [],
            tableData: [],
            tbDialog: {
                dialogVisible: false,
                dialogTitle: "编辑用户",
                loading: false
            },
            rules: {
                userName: [{ required: true, message: "不能为空" }],
                loginName: [{ required: true, message: "不能为空" }],
                pwd: [{ required: true, message: "不能为空" }],
                phone: [{ validator: validatePhone }],
                samplingUnitID: [{ validator: validateSamplingUnitID }],
                cdcCode: [{ validator: validateCdcCode }]
            }
        };
    },
    created() {
        // 获取疾控单位
        this.getSamplingUnitList();

        // 获取实验室
        this.getLaboratoryList();

        // 获取表格数据
        this.getTableData();
    },
    methods: {
        // 查询
        onSearch() {
            this.getTableData();
        },
        // 重置
        onReset() {
            this.form = {
                name: ""
            };
        },
        // 获取疾控单位
        getSamplingUnitList() {
            commonApi
                .findSamplingListAll()
                .then(json => {
                    this.samplingUnits = json.data;
                })
                .catch(() => {});
        },
        // 获取实验室
        getLaboratoryList() {
            commonApi
                .findLaboratoryListAll()
                .then(json => {
                    this.laboratorys = json.data;
                })
                .catch(() => {});
        },
        // 获取表格数据
        getTableData() {
            let param = {
                name: this.form.name
            };

            this.loading = true;
            manageApi
                .findUserList()
                .then(json => {
                    setTimeout(() => {
                        this.tableData = json.data.data;
                        this.loading = false;
                    }, 1000);
                })
                .catch(() => {});
        },
        // 分页：每页 n 条
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        // 分页：当前页: n }
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        },
        // 表格新增
        handleAdd(index, row) {
            this.tbDialog.dialogTitle = "新增用户";
            this.tbDialog.dialogVisible = true;
            this.infoForm = {
                userName: "",
                sex: 0,
                loginName: "",
                pwd: "",
                phone: "",
                roleId: "admin",
                samplingUnitID: "",
                cdcCode: ""
            };
            this.infoForm_bak = JSON.parse(JSON.stringify(this.infoForm));
            this.$nextTick(() => {
                this.$refs["infoForm"].resetFields();
            });
        },
        // 表格编辑
        handleEdit(index, row) {
            this.tbDialog.dialogTitle = "编辑用户";
            this.tbDialog.dialogVisible = true;
            this.infoForm = JSON.parse(JSON.stringify(row));
            this.infoForm_bak = JSON.parse(JSON.stringify(row));

            this.$nextTick(() => {
                this.$refs["infoForm"].clearValidate();
            });
        },
        // 表格删除
        handleDelete(index, row) {
            this.infoForm = JSON.parse(JSON.stringify(row));
            this.$confirm("确定删除此数据么?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.loading = true;

                    setTimeout(() => {
                        this.loading = false;
                        this.$message({
                            showClose: true,
                            message: "删除成功",
                            type: "success",
                            duration: 2000
                        });
                    }, 1000);
                })
                .catch(() => {});
        },
        // 表格重置按钮
        dialogBtnReset() {
            this.infoForm = JSON.parse(JSON.stringify(this.infoForm_bak));
            this.$nextTick(() => {
                this.$refs["infoForm"].clearValidate();
            });
        },
        // 表格确定按钮
        dialogBtnSure() {
            this.$refs["infoForm"].validate(valid => {
                if (valid) {
                    let isEdit = false;
                    let title = "";
                    if (this.tbDialog.dialogTitle == "编辑用户") {
                        isEdit = true;
                        title = "确认修改？";
                    } else {
                        isEdit = false;
                        title = "确认新增？";
                    }
                    this.$confirm(title)
                        .then(() => {
                            let param = {
                                userName: this.infoForm.userName,
                                sex: this.infoForm.sex,
                                loginName: this.infoForm.loginName,
                                pwd: this.infoForm.pwd,
                                phone: this.infoForm.phone,
                                roleId: this.infoForm.roleId,
                                samplingUnitID: this.samplingUnitID,
                                cdcCode: this.cdcCode
                            };
                            if (isEdit) {
                                console.log("编辑用户");
                            } else {
                                console.log("新增用户");
                            }

                            this.tbDialog.loading = true;
                            setTimeout(() => {
                                this.tbDialog.loading = false;

                                this.tbDialog.dialogVisible = false;
                            }, 1000);
                        })
                        .catch(() => {});
                } else {
                    return false;
                }
            });
        }
    },
    filters: {
        getSexName: value => {
            if (!value) return "";
            return global_sexs.filter(item => item.value == value)[0].name;
        },
        getRoleName: value => {
            if (!value) return "";
            return global_roles.filter(item => item.value == value)[0].name;
        }
    }
};
</script>

<style lang="scss" scoped></style>
