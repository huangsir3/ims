<template>
    <div class="">
        <Header></Header>
        <Nav itemActive="7"></Nav>
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
                        <el-form-item label="实验室名称">
                            <el-input
                                v-model="form.name"
                                :clearable="true"
                                placeholder="实验室名称"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="实验室地址">
                            <el-input
                                v-model="form.address"
                                :clearable="true"
                                placeholder="实验室地址"
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
                        ><i class="el-icon-plus"></i> 新增实验室</el-button
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
                        prop="name"
                        label="实验室名称"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="address"
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
                    <div slot="empty">
                        <div class="pt20">
                            <img src="@/assets/img/none.png" />
                        </div>
                        <div><span>暂无数据</span></div>
                    </div>
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
                width="30%"
                :append-to-body="true"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                v-loading.fullscreen.lock="tbDialog.loading"
                element-loading-background="rgba(255, 255, 255, 0.5)"
            >
                <el-form
                    :model="infoForm"
                    ref="infoForm"
                    size="small"
                    :rules="rules"
                    label-width="120px"
                >
                    <el-row>
                        <el-col :lg="24">
                            <el-form-item label="实验室名称" prop="name">
                                <el-input
                                    v-model="infoForm.name"
                                    :clearable="true"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="24">
                            <el-form-item label="实验室地址" prop="address">
                                <el-input
                                    v-model="infoForm.address"
                                    :clearable="true"
                                ></el-input>
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

export default {
    components: { Header, Nav },
    data() {
        return {
            loading: false,
            form: {
                name: "",
                address: ""
            },
            infoForm: {},
            infoForm_bak: {},
            page: {
                pageSizes: [10, 20, 30, 50, 100],
                pageSize: 10,
                total: 400,
                currentPage: 1
            },
            tableData: [],
            tbDialog: {
                dialogVisible: false,
                dialogTitle: "编辑实验室",
                loading: false
            },
            rules: {
                name: [{ required: true, message: "不能为空" }],
                address: [{ required: true, message: "不能为空" }]
            }
        };
    },
    created() {
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
                name: "",
                address: ""
            };
        },
        // 获取表格数据
        getTableData() {
            let param = {
                name: this.form.name,
                address: this.form.address
            };

            this.loading = true;
            manageApi
                .findLaboratoryList()
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
            this.tbDialog.dialogTitle = "新增实验室";
            this.tbDialog.dialogVisible = true;
            this.infoForm = {
                region: "",
                corporate_name: ""
            };
            this.infoForm_bak = JSON.parse(JSON.stringify(this.infoForm));
            this.$nextTick(() => {
                this.$refs["infoForm"].resetFields();
            });
        },
        // 表格编辑
        handleEdit(index, row) {
            this.tbDialog.dialogTitle = "编辑实验室";
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
                    if (this.tbDialog.dialogTitle == "编辑实验室") {
                        isEdit = true;
                        title = "确认修改？";
                    } else {
                        isEdit = false;
                        title = "确认新增？";
                    }
                    this.$confirm(title)
                        .then(() => {
                            let param = {
                                name: this.infoForm.name,
                                address: this.infoForm.address
                            };
                            if (isEdit) {
                                console.log("编辑实验室");
                            } else {
                                console.log("新增实验室");
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
    }
};
</script>

<style lang="scss" scoped></style>
