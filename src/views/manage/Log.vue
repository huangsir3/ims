<template>
    <div class="">
        <Header></Header>
        <Nav itemActive="10"></Nav>
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
                        <el-form-item label="用户姓名">
                            <el-input
                                v-model="form.userName"
                                :clearable="true"
                                placeholder="用户姓名"
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
                <el-table
                    :data="tableData"
                    size="small"
                    style="width: 100%"
                    class="mt20"
                >
                    <el-table-column
                        type="index"
                        label="序号"
                        width="100"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="userName"
                        label="用户名"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="module"
                        label="操作模块"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="ipaddress"
                        label="IP地址"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="equipment"
                        label="操作设备"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="details"
                        label="操作详情"
                        align="center"
                    ></el-table-column>
                    <el-table-column label="操作类型" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.type | getTypeName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作结果" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.result | getResultName }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="startTime"
                        label="操作开始时间"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="endTime"
                        label="操作结束时间"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        label="操作过程时间"
                        header-align="center"
                        align="center"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.executeTime }}ms
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
                userName: ""
            },
            page: {
                pageSizes: [10, 20, 30, 50, 100],
                pageSize: 10,
                total: 400,
                currentPage: 1
            },
            tableData: []
        };
    },
    filters: {
        getResultName: value => {
            if (!value) return "";
            let global_results = [
                { name: "成功", value: "1" },
                { name: "失败", value: "0" }
            ];
            return global_results.filter(item => item.value == value)[0].name;
        },
        getTypeName: value => {
            if (!value) return "";
            let global_Types = [
                { name: "新增", value: "1" },
                { name: "删除", value: "2" },
                { name: "编辑", value: "3" },
                { name: "登入", value: "4" },
                { name: "登出", value: "5" }
            ];
            return global_Types.filter(item => item.value == value)[0].name;
        }
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
                userName: ""
            };
        },
        // 获取表格数据
        getTableData() {
            let param = {
                userName: this.form.userName
            };

            this.loading = true;
            manageApi
                .logList()
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
        }
    }
};
</script>

<style lang="scss" scoped></style>
