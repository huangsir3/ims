<template>
    <div class="">
        <Header></Header>
        <Nav itemActive="0"></Nav>
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
                        <el-form-item label="操作状态">
                            <el-select
                                v-model="form.opState"
                                :clearable="true"
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="(item, index) in opStates"
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
                    <el-button
                        size="mini"
                        type="primary"
                        class="mb10"
                        @click="insertBarCode()"
                        ><i class="el-icon-plus"></i>
                        批量导入标签编号</el-button
                    >
                    <div class="fr">
                        <el-button
                            size="mini"
                            type="primary"
                            class="mb10"
                            @click="exportExcel()"
                            ><i class="el-icon-download"></i>
                            列表导出</el-button
                        >
                        <el-button
                            size="mini"
                            type="primary"
                            class="mb10"
                            @click="batchExport()"
                            ><i class="el-icon-download"></i>
                            基本信息模板下载</el-button
                        >
                        <el-button
                            size="mini"
                            type="primary"
                            class="mb10"
                            @click="importExcel()"
                            ><i class="el-icon-upload2"></i>
                            批量导入基本信息</el-button
                        >
                        <el-button
                            size="mini"
                            type="primary"
                            class="mb10"
                            @click="printSelect()"
                            ><i class="el-icon-printer"></i> 批量打印条形码 ({{
                                multipleSelection.length
                            }})</el-button
                        >
                        <el-button
                            size="mini"
                            type="primary"
                            class="mb10"
                            @click="printBetween()"
                            ><i class="el-icon-printer"></i>
                            区间打印条形码</el-button
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
                    <el-table-column label="操作状态" align="center">
                        <template slot-scope="scope">
                            <el-tag
                                size="small"
                                type="success"
                                v-if="scope.row.statusCode == 1"
                                >正常</el-tag
                            >
                            <el-tag size="small" type="danger" v-else
                                >已删除</el-tag
                            >
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="creationTime"
                        label="录入时间"
                        align="center"
                        width="140"
                    ></el-table-column>
                    <el-table-column
                        label="操作"
                        fixed="right"
                        align="center"
                        width="160"
                    >
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                :disabled="scope.row.statusCode=='4' || scope.row.statusCode=='5'"
                                @click="handleEdit(scope.$index, scope.row)"
                                >编辑</el-button
                            >
                            <el-button
                                size="mini"
                                type="danger"
                                :disabled="scope.row.statusCode=='3' || scope.row.statusCode=='4' || scope.row.statusCode=='5'"
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
                width="50%"
                :append-to-body="true"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                v-loading.fullscreen.lock="tbDialog.loading"
                element-loading-background="rgba(255, 255, 255, 0.5)"
            >
                <el-form
                    :model="infoForm"
                    size="small"
                    :disabled="!tbDialog.isEdit"
                    ref="infoForm"
                    :rules="rules"
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
                            <el-form-item label="姓名" prop="name">
                                <el-input
                                    v-model="infoForm.name"
                                    :clearable="true"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="12">
                            <el-form-item label="性别" prop="sex">
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
                                <el-input
                                    v-model="infoForm.age"
                                    :clearable="true"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="12">
                            <el-form-item label="证件号">
                                <el-input
                                    v-model="infoForm.identityCard"
                                    :clearable="true"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="12">
                            <el-form-item label="样本名称" prop="sampleName">
                                <el-select
                                    v-model="infoForm.sampleName"
                                    placeholder="请选择"
                                    class="display-block"
                                    @change="changeSample"
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
                                    :disabled="true"
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
                                    :clearable="true"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="12">
                            <el-form-item label="送检单位" prop="corporateName">
                                <el-select
                                    v-model="infoForm.corporateName"
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
                                    :clearable="true"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="12">
                            <el-form-item label="人员类别" prop="personnel">
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
                                    :clearable="true"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="24">
                            <el-form-item label="备注信息">
                                <el-input
                                    v-model="infoForm.remarks"
                                    :clearable="true"
                                    type="textarea"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button
                        size="small"
                        v-if="tbDialog.isEdit"
                        @click="tbDialog.dialogVisible = false"
                        >取消</el-button
                    >
                    <el-button
                        type="primary"
                        size="small"
                        @click="dialogBtnSure"
                        >确定</el-button
                    >
                </span>
            </el-dialog>
            <el-dialog
                title="批量生成标签"
                :visible.sync="markDialog.dialogVisible"
                width="30%"
                :append-to-body="true"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                v-loading.fullscreen.lock="markDialog.loading"
                element-loading-background="rgba(255, 255, 255, 0.5)"
            >
                <el-form
                    :model="markForm"
                    ref="markForm"
                    size="small"
                    label-width="100px"
                >
                    <el-form-item
                        label="检测单位"
                        prop="corporateName"
                        :rules="[{ required: true, message: '不能为空' }]"
                    >
                        <el-select
                            v-model="markForm.corporateName"
                            placeholder="请选择"
                            class="display-block"
                        >
                            <el-option
                                v-for="(item, index) in corporateNames"
                                :key="index"
                                :label="item.name"
                                :value="item.name"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="检测数量"
                        prop="generatedQuantity"
                        :rules="[{ required: true, message: '不能为空' }]"
                    >
                        <el-input
                            v-model="markForm.generatedQuantity"
                            :clearable="true"
                        ></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button
                        size="small"
                        @click="markDialog.dialogVisible = false"
                        >取消</el-button
                    >
                    <el-button type="primary" size="small" @click="markBtnSure"
                        >确定</el-button
                    >
                </span>
            </el-dialog>
            <el-dialog
                title="输入区间"
                :visible.sync="checkprintDialog.dialogVisible"
                width="30%"
                :append-to-body="true"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                v-loading.fullscreen.lock="checkprintDialog.loading"
                element-loading-background="rgba(255, 255, 255, 0.5)"
            >
                <el-form
                    :model="checkprintForm"
                    ref="checkprintForm"
                    size="small"
                    label-width="60px"
                >
                    <el-form-item
                        label="起始"
                        prop="num1"
                        :rules="[{ required: true, message: '不能为空' }]"
                    >
                        <el-input
                            v-model="checkprintForm.num1"
                            :clearable="true"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                        label="截止"
                        prop="num2"
                        :rules="[{ required: true, message: '不能为空' }]"
                    >
                        <el-input
                            v-model="checkprintForm.num2"
                            :clearable="true"
                        ></el-input>
                    </el-form-item>
                </el-form>
                <div
                    class="ml20 el-link"
                    :class="[
                        checkprintDialog.checkCode == 0
                            ? 'el-link--success'
                            : 'el-link--danger'
                    ]"
                >
                    {{ checkprintDialog.checkMsg }}
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button
                        size="small"
                        @click="checkprintDialog.dialogVisible = false"
                        >取消</el-button
                    >
                    <el-button
                        type="warning"
                        size="small"
                        @click="checkprintBtnCheck"
                        >检查</el-button
                    >
                    <el-button
                        type="primary"
                        size="small"
                        @click="checkprintBtnSure"
                        >确定</el-button
                    >
                </span>
            </el-dialog>
            <el-dialog
                title="条形码打印预览"
                :visible.sync="barcodeDialog.dialogVisible"
                width="800px"
                :append-to-body="true"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
            >
                <el-row id="printBarcode">
                    <el-col
                        :xs="12"
                        :sm="12"
                        :md="12"
                        :lg="12"
                        v-for="(item, index) in barcodeValues"
                        :key="index"
                        class="text-center"
                    >
                        <!--<VueBarcode :value="item" :class="index % 2 == 0 ? 'fl' : 'fr'" :fontSize="30"></VueBarcode>-->
                        <VueBarcode :value="item" :fontSize="30"></VueBarcode>
                    </el-col>
                </el-row>

                <span slot="footer" class="dialog-footer">
                    <el-button
                        size="small"
                        @click="barcodeDialog.dialogVisible = false"
                        >取消</el-button
                    >
                    <el-button
                        type="warning"
                        size="small"
                        @click="barcodeExportBtnSure"
                        >导出为PDF</el-button
                    >
                    <el-button
                        type="primary"
                        size="small"
                        v-print="'#printBarcode'"
                        >打印</el-button
                    >
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Nav from "@/components/Nav.vue";
import VueBarcode from "vue-barcode";

import { collectApi, commonApi } from "@/api/api";
import htmlToPdf from "@/utils/htmlToPdf";

export default {
    components: { Header, Nav, VueBarcode },
    data() {
        return {
            that: this,
            loading: false,
            form: {
                barCode1: "",
                barCode2: "",
                name: "",
                samplingDi: "",
                statusCode: "",
                time: [new Date(), new Date()],
                sampleName: "",
                personnel: "",
                opState: "正常",
                nameOrderBy: false
            },
            infoForm: {},
            corporateName: "",
            markForm: {
                corporateName: "",
                generatedQuantity: 100
            },
            markForm_bak: {},
            checkprintForm: {
                num1: "",
                num2: ""
            },
            page: {
                pageSizes: [10, 20, 30, 50, 100],
                pageSize: 10,
                total: 400,
                currentPage: 1
            },
            opStates: [
                { name: "正常", value: "正常" },
                { name: "已删除", value: "已删除" }
            ],
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
                isEdit: false,
                dialogVisible: false,
                dialogTitle: "查看采样信息",
                loading: false
            },
            rules: {
                name: [{ required: true, message: "不能为空" }],
                sex: [{ required: true, message: "不能为空" }],
                sampleName: [{ required: true, message: "不能为空" }],
                corporateName: [{ required: true, message: "不能为空" }],
                personnel: [{ required: true, message: "不能为空" }]
            },
            markDialog: {
                dialogVisible: false,
                loading: false
            },
            checkprintDialog: {
                dialogVisible: false,
                checkMsg: "",
                checkCode: 0,
                loading: false
            },
            barcodeValues: [],
            barcodeDialog: {
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

        // 获取当前所属疾控中心
        this.getSam();

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
                samplingDi: "",
                statusCode: "",
                time: [new Date(), new Date()],
                sampleName: "",
                personnel: "",
                opState: "正常",
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
        // 获取当前所属疾控中心
        getSam() {
            collectApi
                .getSam()
                .then(json => {
                    this.markForm.corporateName = json.data.data.corporate_name;
                    this.markForm.generatedQuantity = 100;
                    this.markForm_bak = JSON.parse(
                        JSON.stringify(this.markForm)
                    );
                })
                .catch(() => {});
        },
        // 获取表格数据
        getTableData() {
            let param = {
                barCode: this.form.barCode1 + "~" + this.form.barCode2,
                name: this.form.name,
                samplingDi: this.form.samplingDi,
                statusCode: this.form.statusCode,
                sampleName: this.form.sampleName,
                personnel: this.form.personnel,
                time: this.form.time
                    ? this.formatDate(this.form.time[0]) +
                      " ~ " +
                      this.formatDate(this.form.time[1])
                    : "",
                page: this.page.currentPage,
                limit: this.page.pageSize
            };
            this.loading = true;
            collectApi
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

            // 获取表格数据
            this.getTableData();
        },
        // 表格多选
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 表格查看
        handleSee(index, row) {
            this.tbDialog.isEdit = false;
            this.tbDialog.dialogVisible = true;
            this.tbDialog.dialogTitle = "查看采样信息";
            this.infoForm = JSON.parse(JSON.stringify(row));

            this.$nextTick(() => {
                this.$refs["infoForm"].clearValidate();
            });
        },
        // 表格编辑
        handleEdit(index, row) {
            this.tbDialog.isEdit = true;
            this.tbDialog.dialogVisible = true;
            this.tbDialog.dialogTitle = "编辑采样信息";
            this.infoForm = JSON.parse(JSON.stringify(row));

            this.$nextTick(() => {
                this.$refs["infoForm"].clearValidate();
            });
        },
        // 表格删除
        handleDelete(index, row) {
            this.infoForm = row;
            this.$confirm("确定删除这条采样数据么?", "提示", {
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
        // 表格编辑--确定按钮
        dialogBtnSure() {
            if (!this.tbDialog.isEdit) {
                this.tbDialog.dialogVisible = false;
                return;
            }

            this.$refs["infoForm"].validate(valid => {
                if (valid) {
                    this.$confirm("确认修改？")
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
        },
        // 表格编辑--样本名称改变事件
        changeSample(currentVal) {
            // 血液、血液（复核）
            if (currentVal == 6 || currentVal == 19) {
                this.infoForm.sampleType = "NUCLEICACID";
            } else {
                this.infoForm.sampleType = "ANTIBODY";
            }
        },
        // 批量导入标签编号
        insertBarCode() {
            this.markForm = JSON.parse(JSON.stringify(this.markForm_bak));

            this.markDialog.dialogVisible = true;

            this.$nextTick(() => {
                this.$refs["markForm"].clearValidate();
            });
        },
        // 批量导入标签编号--确定按钮
        markBtnSure() {
            this.$refs["markForm"].validate(valid => {
                if (valid) {
                    let param = {
                        corporateName: this.markForm.corporateName,
                        generatedQuantity: this.markForm.generatedQuantity
                    };

                    this.markDialog.loading = true;
                    setTimeout(() => {
                        this.markDialog.loading = false;

                        this.markDialog.dialogVisible = false;
                    }, 1000);
                } else {
                    return false;
                }
            });
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
                    samplingDi: this.form.samplingDi,
                    statusCode: this.form.statusCode,
                    sampleName: this.form.sampleName,
                    personnel: this.form.personnel,
                    time: this.form.time
                        ? this.formatDate(this.form.time[0]) +
                          " ~ " +
                          this.formatDate(this.form.time[1])
                        : "",
                    /*                    orderMap: {
                        name: $("#identity").is(':checked') ? "desc": "",
                    },*/
                    exportType: 2
                };
            }
            console.log(param);
        },
        // 导出数据模板下载
        batchExport() {},
        // 批量导入基本信息
        importExcel() {},
        // 批量打印条形码
        printSelect() {
            if (!this.multipleSelection.length) {
                this.$message({
                    showClose: true,
                    message: "暂无勾选数据",
                    type: "error",
                    duration: 2000
                });
                return;
            }

            //            let ids = [];
            //            this.multipleSelection.forEach(item => ids.push(item.id));
            //            console.log(ids.join());
            this.barcodeValues = [];
            this.multipleSelection.forEach(item =>
                this.barcodeValues.push(item.barCode)
            );

            this.barcodeDialog.dialogVisible = true;
        },
        // 批量打印条形码--导出PDF按钮
        barcodeExportBtnSure() {
            htmlToPdf.downloadPDF(
                document.querySelector("#printBarcode"),
                "条形码"
            );
        },
        // 区间打印条形码
        printBetween() {
            this.checkprintDialog.checkMsg = "";
            this.checkprintDialog.dialogVisible = true;

            this.$nextTick(() => {
                this.$refs["checkprintForm"].resetFields();
            });
        },
        // 区间打印--检查按钮
        checkprintBtnCheck() {
            this.$refs["checkprintForm"].validate(valid => {
                if (valid) {
                    let param = {
                        num1: this.checkprintForm.num1,
                        num2: this.checkprintForm.num2
                    };
                    // 根据num1和num2接口调用，返回code

                    let code = Math.floor(Math.random() * 5 - 1);
                    this.checkprintDialog.checkCode = code;
                    switch (code) {
                        case 0:
                            this.checkprintDialog.checkMsg = "检查通过";
                            break;
                        case 1:
                            this.checkprintDialog.checkMsg =
                                "此区间有已打印条形码";
                            break;
                        case 2:
                            this.checkprintDialog.checkMsg =
                                "此区间没有可打印的条形码";
                            break;
                        case 3:
                            this.checkprintDialog.checkMsg =
                                "此区间有未生成的条形码，不能打印";
                            break;
                        case -1:
                            this.checkprintDialog.checkMsg =
                                "请输入正确的区间（示例：00001-00010）";
                            break;
                    }
                } else {
                    return false;
                }
            });
        },
        // 区间打印--确定按钮
        checkprintBtnSure() {
            this.$refs["checkprintForm"].validate(valid => {
                if (valid) {
                    let param = {
                        num1: this.checkprintForm.num1,
                        num2: this.checkprintForm.num2
                    };
                    // 根据num1和num2接口调用，返回code和id
                    let data = "2109,2110";
                    let ids = data;

                    let code = Math.floor(Math.random() * 5 - 1);
                    this.checkprintDialog.checkCode = code;
                    switch (code) {
                        case 0:
                            this.checkprintDialog.checkMsg = "检查通过";
                            this.getCheckprintBarcode(ids);
                            break;
                        case 1:
                            this.checkprintDialog.checkMsg =
                                "此区间有已打印条形码";
                            break;
                        case 2:
                            this.checkprintDialog.checkMsg =
                                "此区间没有可打印的条形码";
                            break;
                        case 3:
                            this.checkprintDialog.checkMsg =
                                "此区间有未生成的条形码，不能打印";
                            break;
                        case -1:
                            this.checkprintDialog.checkMsg =
                                "请输入正确的区间（示例：00001-00010）";
                            break;
                    }
                } else {
                    return false;
                }
            });
        },
        // 区间打印--确定按钮--检测通过，函数调用
        getCheckprintBarcode(ids) {
            // 根据id接口调用，返回样本编号

            this.checkprintDialog.loading = true;
            collectApi
                .printView()
                .then(json => {
                    setTimeout(() => {
                        this.barcodeValues = json.data.data;
                        this.checkprintDialog.loading = false;

                        this.checkprintDialog.dialogVisible = false;

                        this.barcodeDialog.dialogVisible = true;
                    }, 1000);
                })
                .catch(() => {});
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
