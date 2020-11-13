<template>
    <div class="">
        <Header></Header>
        <Nav itemActive="2"></Nav>
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
                        <el-form-item label="样本区间">
                            <el-input
                                placeholder="样本编号1"
                                v-model="form.barCode1"
                                :clearable="true"
                                class="input-barcode"
                            ></el-input>
                            ~
                            <el-input
                                placeholder="样本编号2"
                                v-model="form.barCode2"
                                :clearable="true"
                                class="input-barcode"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="姓名">
                            <el-input
                                v-model="form.name"
                                :clearable="true"
                                placeholder="姓名"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="证件号">
                            <el-input
                                v-model="form.identityCard"
                                :clearable="true"
                                placeholder="证件号"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="采样地点">
                            <el-input
                                v-model="form.samplingDi"
                                :clearable="true"
                                placeholder="采样地点"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="当前状态">
                            <el-select
                                v-model="form.statusCode"
                                :clearable="true"
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="(item, index) in status"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="录入时间">
                            <el-date-picker
                                v-model="form.time"
                                type="daterange"
                                range-separator="~"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                class="input-time"
                            >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="送检单位">
                            <el-select
                                v-model="form.corporateName"
                                :clearable="true"
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="(item, index) in corporateNames"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="样本名称">
                            <el-select
                                v-model="form.sampleName"
                                :clearable="true"
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="(item, index) in sampleNames"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="人员类别">
                            <el-select
                                v-model="form.personnel"
                                :clearable="true"
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="(item, index) in personnels"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            style="display: block;margin-left: 100px;"
                        >
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
                    <div class="fr">
                        <el-button
                            size="mini"
                            type="primary"
                            class="mb10"
                            @click="exportExcel()"
                            ><i class="el-icon-download"></i>
                            列表导出</el-button
                        >
                    </div>
                </div>
                <el-table
                    ref="multipleTable"
                    :data="tableData"
                    size="small"
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column type="selection" width="50" fixed="left">
                    </el-table-column>
                    <el-table-column
                        type="index"
                        label="序号"
                        align="center"
                        width="50"
                    ></el-table-column>
                    <el-table-column
                        label="样本编号"
                        align="center"
                        width="145"
                    >
                        <template slot-scope="scope">
                            <el-link
                                @click="handleSee(scope.$index, scope.row)"
                                >{{ scope.row.barCode }}</el-link
                            >
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="姓名"
                        align="center"
                        :sortable="true"
                    ></el-table-column>
                    <el-table-column
                        label="样本名称"
                        align="center"
                        width="110"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.sampleName | getSampleName(that) }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="检测项目"
                        align="center"
                        prop="sampleType"
                    >
                        <template slot-scope="scope">
                            {{ scope.row.sampleType | getSampleTypeName(that) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="人员类别" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.personnel | getPersonName(that) }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="samplingDi"
                        label="采样地点"
                        align="center"
                    ></el-table-column>
                    <el-table-column label="当前状态" align="center" width="90">
                        <template slot-scope="scope">
                            <el-tag
                                size="small"
                                type="info"
                                v-if="scope.row.statusCode == 1"
                                >{{
                                    scope.row.statusCode | getStatusName(that)
                                }}</el-tag
                            >
                            <el-tag
                                size="small"
                                type="warning"
                                v-else-if="scope.row.statusCode == 2"
                                >{{
                                    scope.row.statusCode | getStatusName(that)
                                }}</el-tag
                            >
                            <el-tag
                                size="small"
                                v-else-if="scope.row.statusCode == 3"
                                >{{
                                    scope.row.statusCode | getStatusName(that)
                                }}</el-tag
                            >
                            <el-tag
                                size="small"
                                type="success"
                                v-else-if="scope.row.statusCode == 4"
                                >{{
                                    scope.row.statusCode | getStatusName(that)
                                }}</el-tag
                            >
                            <el-tag
                                size="small"
                                type="danger"
                                v-else-if="scope.row.statusCode == 5"
                                >{{
                                    scope.row.statusCode | getStatusName(that)
                                }}</el-tag
                            >
                        </template>
                    </el-table-column>
                    <!--<el-table-column
                        label="操作"
                        fixed="right"
                        align="center"
                        width="240"
                    >
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                type="success"
                                @click="handleSee(scope.$index, scope.row)"
                                >查看</el-button
                            >
                        </template>
                    </el-table-column>-->
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
                title="查看详情"
                :visible.sync="tbDialog.dialogVisible"
                width="50%"
                :append-to-body="true"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
            >
                <el-form
                    :model="infoForm"
                    size="small"
                    :disabled="true"
                    ref="infoForm"
                    status-icon
                    label-width="100px"
                >
                    <el-row>
                        <el-col :lg="12">
                            <el-form-item label="样本编号">
                                <el-input
                                    v-model="infoForm.barCode"
                                    :disabled="true"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="12">
                            <el-form-item label="姓名">
                                <el-input v-model="infoForm.name"></el-input>
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
                            <el-form-item label="年龄">
                                <el-input v-model="infoForm.age"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="12">
                            <el-form-item label="证件号">
                                <el-input
                                    v-model="infoForm.identityCard"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="12">
                            <el-form-item label="样本名称">
                                <el-select
                                    v-model="infoForm.sampleName"
                                    placeholder="请选择"
                                    class="display-block"
                                >
                                    <el-option
                                        v-for="(item, index) in sampleNames"
                                        :key="index"
                                        :label="item.name"
                                        :value="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="12">
                            <el-form-item label="检测项目">
                                <el-select
                                    v-model="infoForm.sampleType"
                                    placeholder="请选择"
                                    class="display-block"
                                >
                                    <el-option
                                        v-for="(item, index) in sampleTypes"
                                        :key="index"
                                        :label="item.name"
                                        :value="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="12">
                            <el-form-item label="采样次数">
                                <el-input
                                    v-model="infoForm.samplingTimes"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="12">
                            <el-form-item label="送检单位">
                                <el-select
                                    v-model="infoForm.corporateName"
                                    :clearable="true"
                                    placeholder="请选择"
                                    class="display-block"
                                >
                                    <el-option
                                        v-for="(item, index) in corporateNames"
                                        :key="index"
                                        :label="item.name"
                                        :value="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="12">
                            <el-form-item label="采样地点">
                                <el-input
                                    v-model="infoForm.samplingDi"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="12">
                            <el-form-item label="人员类别">
                                <el-select
                                    v-model="infoForm.personnel"
                                    placeholder="请选择"
                                    class="display-block"
                                >
                                    <el-option
                                        v-for="(item, index) in personnels"
                                        :key="index"
                                        :label="item.name"
                                        :value="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="12">
                            <el-form-item label="密接姓名">
                                <el-input
                                    v-model="infoForm.closeName"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="24">
                            <el-form-item label="备注信息">
                                <el-input
                                    v-model="infoForm.remarks"
                                    type="textarea"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
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
import { checkApi, commonApi } from "@/api/api";
import Header from "@/components/Header.vue";
import Nav from "@/components/Nav.vue";

export default {
    components: { Header, Nav },
    data() {
        return {
            that: this,
            loading: false,
            form: {
                barCode1: "",
                barCode2: "",
                name: "",
                identityCard: "",
                samplingDi: "",
                statusCode: "",
                time: "",
                corporateName: "",
                sampleName: "",
                personnel: "",
                nameOrderBy: false
            },
            infoForm: {},
            page: {
                pageSizes: [10, 20, 30, 50, 100],
                pageSize: 10,
                total: 400,
                currentPage: 1
            },
            status: [],
            sampleNames: [],
            sampleTypes: [],
            personnels: [],
            corporateNames: [
                {
                    name: "玄武区疾控中心",
                    value: "0102"
                },
                {
                    name: "建邺区疾控中心",
                    value: "0105"
                },
                {
                    name: "六合区疾控中心",
                    value: "0116"
                },
                {
                    name: "秦淮区疾控中心",
                    value: "0104"
                },
                {
                    name: "浦口区疾控中心",
                    value: "0111"
                }
            ],
            sexs: [
                { name: "男", value: "男" },
                { name: "女", value: "女" }
            ],
            tableData: [],
            multipleSelection: [],
            tbDialog: {
                dialogVisible: false
            }
        };
    },
    created() {
        // 数据字典--状态
        this.findDictionaryChildList({
            dictionary_code: "d71f21d97a11483eb5bd2478bdbe3735"
        });

        // 数据字典--样本名称
        this.findDictionaryChildList({
            dictionary_code: "958d9f021aa64ccbae1bfe1d167bd679"
        });

        // 数据字典--检测项目
        this.findDictionaryChildList({
            dictionary_code: "5b1cf46663bf498e9cd443bbccc8c8d7"
        });

        // 数据字典--人员类别
        this.findDictionaryChildList({
            dictionary_code: "7d4e7734040149da9215380e099a473b"
        });

        // 获取表格数据
        this.getTableData();
    },
    methods: {
        // 查询
        onSearch() {
            // 获取表格数据
            this.getTableData();
        },
        // 重置
        onReset() {
            this.form = {
                barCode1: "",
                barCode2: "",
                name: "",
                identityCard: "",
                samplingDi: "",
                statusCode: "",
                time: "",
                corporateName: "",
                sampleName: "",
                personnel: "",
                nameOrderBy: false
            };
        },
        // 数据字典
        findDictionaryChildList(param) {
            commonApi
                .findDictionaryChildList(param)
                .then(json => {
                    switch (param.dictionary_code) {
                        case "d71f21d97a11483eb5bd2478bdbe3735":
                            this.status = json.data.data;
                            break;
                        case "958d9f021aa64ccbae1bfe1d167bd679":
                            this.sampleNames = json.data.data;
                            break;
                        case "5b1cf46663bf498e9cd443bbccc8c8d7":
                            this.sampleTypes = json.data.data;
                            break;
                        case "7d4e7734040149da9215380e099a473b":
                            this.personnels = json.data.data;
                            break;
                    }
                })
                .catch(() => {});
        },
        // 获取表格数据
        getTableData() {
            let param = {
                barCode: this.form.barCode1 + "~" + this.form.barCode2,
                name: this.form.name,
                identityCard: this.form.identityCard,
                samplingDi: this.form.samplingDi,
                statusCode: this.form.statusCode,
                time: this.form.time
                    ? this.formatDate(this.form.time[0]) +
                      " ~ " +
                      this.formatDate(this.form.time[1])
                    : "",
                corporateName: this.form.corporateName,
                sampleName: this.form.sampleName,
                personnel: this.form.personnel
            };

            this.loading = true;
            checkApi
                .getSampleData()
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
        // 表格多选
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 表格查看
        handleSee(index, row) {
            this.tbDialog.dialogVisible = true;
            this.infoForm = JSON.parse(JSON.stringify(row));
        },
        // 表格编辑确定按钮
        dialogBtnSure() {
            this.tbDialog.dialogVisible = false;
        },
        // 导出
        exportExcel() {
            // 检测是否有导出数据
            if (!this.tableData.length) {
                this.$message({
                    showClose: true,
                    message: "暂无可导出数据",
                    type: "error",
                    duration: 2000
                });
                return;
            }

            // 如果勾选就导出勾选项，如果不勾选导出所有查询结果
            let param = null;
            if (this.multipleSelection.length) {
                let codes = [];
                this.multipleSelection.forEach(item =>
                    codes.push(item.barCode)
                );
                param = {
                    codes: codes,
                    exportType: 1
                };
            } else {
                param = {
                    barCode: this.form.barCode1 + "~" + this.form.barCode2,
                    name: this.form.name,
                    identityCard: this.form.identityCard,
                    samplingDi: this.form.samplingDi,
                    statusCode: this.form.statusCode,
                    time: this.form.time
                        ? this.formatDate(this.form.time[0]) +
                          " ~ " +
                          this.formatDate(this.form.time[1])
                        : "",
                    corporateName: this.form.corporateName,
                    sampleName: this.form.sampleName,
                    personnel: this.form.personnel,
                    /*                    orderMap: {
                                            name: $("#identity").is(':checked') ? "desc": "",
                                        },*/
                    exportType: 2
                };
            }
            console.log(param);
        }
    },
    filters: {
        getStatusName: (value, that) => {
            if (!value) return "";
            return that.status.filter(item => item.value == value)[0].name;
        },
        getSampleName: (value, that) => {
            if (!value) return "";
            return that.sampleNames.filter(item => item.value == value)[0].name;
        },
        getSampleTypeName: (value, that) => {
            if (!value) return "";
            return that.sampleTypes.filter(item => item.value == value)[0].name;
        },
        getPersonName: (value, that) => {
            if (!value) return "";
            return that.personnels.filter(item => item.value == value)[0].name;
        }
    }
};
</script>

<style lang="scss" scoped></style>
