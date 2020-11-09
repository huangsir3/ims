<template>
    <div class="">
        <Header></Header>
        <Nav itemActive="3"></Nav>
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
                                v-model="form.sampleCode1"
                                :clearable="true"
                                class="input-barcode"
                            ></el-input>
                            ~
                            <el-input
                                placeholder="样本编号2"
                                v-model="form.sampleCode2"
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
                        <el-form-item label="实验室编号">
                            <el-input
                                v-model="form.labCode"
                                :clearable="true"
                                placeholder="实验室编号"
                            ></el-input>
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
                        <el-form-item label="检测项目">
                            <el-select
                                v-model="form.checkType"
                                :clearable="true"
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="(item, index) in sampleTypes"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="检测完成时间">
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
                        <el-form-item label="核酸检测结果">
                            <el-select
                                v-model="form.checkResult"
                                :clearable="true"
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="(item, index) in checkResults"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="IgM检测结果">
                            <el-select
                                v-model="form.IgMResult"
                                :clearable="true"
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="(item, index) in IgMResults"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="IgG检测结果">
                            <el-select
                                v-model="form.IgGResult"
                                :clearable="true"
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="(item, index) in IgGResults"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="当前状态">
                            <el-select
                                v-model="form.checkStatus"
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
                            ><i class="el-icon-download"></i> 导出</el-button
                        >
                        <el-button
                            size="mini"
                            type="primary"
                            class="mb10"
                            @click="scanCodeInput()"
                            ><i class="el-icon-download"></i>
                            批量收样</el-button
                        >
                        <el-button
                            size="mini"
                            type="primary"
                            class="mb10"
                            @click="pushAll()"
                            ><i class="el-icon-upload2"></i> 批量推送 ({{
                                sendMultipleSelection.length
                            }})</el-button
                        >
                        <el-button
                            size="mini"
                            type="primary"
                            class="mb10"
                            @click="inputResult()"
                            ><i class="el-icon-plus"></i>
                            扫码导入检测结果</el-button
                        >
                        <el-button
                            size="mini"
                            type="primary"
                            class="mb10"
                            @click="enterResult()"
                            ><i class="el-icon-plus"></i> 批量录入 ({{
                                enterMultipleSelection.length
                            }})</el-button
                        >
                        <el-button
                            size="mini"
                            type="primary"
                            class="mb10"
                            @click="batchDownload()"
                            ><i class="el-icon-download"></i>
                            批量导出部分检测报告 ({{
                                printMultipleSelection.length
                            }})</el-button
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
                        width="80"
                    ></el-table-column>
                    <el-table-column
                        prop="sampleCode"
                        label="样本编号"
                        align="center"
                        width="130"
                    ></el-table-column>
                    <el-table-column
                        prop="labCode"
                        label="实验室编号"
                        align="center"
                        width="100"
                    ></el-table-column>
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
                            {{ scope.row.checkType | getSampleTypeName(that) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="人员类别" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.personnel | getPersonName(that) }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="corporateName"
                        label="送检单位"
                        align="center"
                    ></el-table-column>
                    <el-table-column label="当前状态" align="center" width="90">
                        <template slot-scope="scope">
                            <el-tag
                                size="small"
                                type="info"
                                v-if="scope.row.checkStatus == 1"
                                >{{
                                    scope.row.checkStatus | getStatusName(that)
                                }}</el-tag
                            >
                            <el-tag
                                size="small"
                                type="warning"
                                v-else-if="scope.row.checkStatus == 2"
                                >{{
                                    scope.row.checkStatus | getStatusName(that)
                                }}</el-tag
                            >
                            <el-tag
                                size="small"
                                v-else-if="scope.row.checkStatus == 3"
                                >{{
                                    scope.row.checkStatus | getStatusName(that)
                                }}</el-tag
                            >
                            <el-tag
                                size="small"
                                type="success"
                                v-else-if="scope.row.checkStatus == 4"
                                >{{
                                    scope.row.checkStatus | getStatusName(that)
                                }}</el-tag
                            >
                            <el-tag
                                size="small"
                                type="danger"
                                v-else-if="scope.row.checkStatus == 5"
                                >{{
                                    scope.row.checkStatus | getStatusName(that)
                                }}</el-tag
                            >
                        </template>
                    </el-table-column>
                    <el-table-column label="审核状态" align="center" width="90">
                        <template slot-scope="scope">
                            <el-tag
                                size="small"
                                type="info"
                                v-if="scope.row.submitStatus == 1"
                                >{{
                                    scope.row.submitStatus | getStatusName(that)
                                }}</el-tag
                            >
                            <el-tag
                                size="small"
                                type="warning"
                                v-else-if="scope.row.submitStatus == 2"
                                >{{
                                    scope.row.submitStatus | getStatusName(that)
                                }}</el-tag
                            >
                            <el-tag
                                size="small"
                                v-else-if="scope.row.submitStatus == 3"
                                >{{
                                    scope.row.submitStatus | getStatusName(that)
                                }}</el-tag
                            >
                            <el-tag
                                size="small"
                                type="success"
                                v-else-if="scope.row.submitStatus == 4"
                                >{{
                                    scope.row.submitStatus | getStatusName(that)
                                }}</el-tag
                            >
                            <el-tag
                                size="small"
                                type="danger"
                                v-else-if="scope.row.submitStatus == 5"
                                >{{
                                    scope.row.submitStatus | getStatusName(that)
                                }}</el-tag
                            >
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="核酸检测结果"
                        align="center"
                        width="100"
                    >
                        <template slot-scope="scope">
                            {{
                                scope.row.checkResult
                                    ? scope.row.checkResult
                                    : scope.row.igMResult
                                    ? "IgM抗体:" +
                                      scope.row.igMResult +
                                      ",IgG抗体:" +
                                      scope.row.igGResult
                                    : ""
                            }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="sampleCollectionTime"
                        label="收样时间"
                        width="90"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="checkTime"
                        label="检测完成时间"
                        width="95"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="remark"
                        label="退回理由"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        label="操作"
                        fixed="right"
                        align="center"
                        width="340"
                    >
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                type="success"
                                @click="handleSee(scope.$index, scope.row)"
                                >查看</el-button
                            >
                            <el-button
                                size="mini"
                                type="warning"
                                @click="handleEdit(scope.$index, scope.row)"
                                >编辑</el-button
                            >
                            <el-button
                                size="mini"
                                type="primary"
                                @click="handleEnter(scope.$index, scope.row)"
                                :disabled="
                                    !(
                                        scope.row.checkStatus == '1' ||
                                        scope.row.checkStatus == '2' ||
                                        scope.row.checkStatus == '3'
                                    )
                                "
                                >录入</el-button
                            >
                            <el-button
                                size="mini"
                                type="primary"
                                @click="handleSend(scope.$index, scope.row)"
                                :disabled="
                                    !(
                                        (scope.row.submitStatus == '0' ||
                                            scope.row.submitStatus == '3') &&
                                        scope.row.checkStatus == '4'
                                    )
                                "
                                >推送</el-button
                            >
                            <el-button
                                size="mini"
                                type="danger"
                                @click="handleReturn(scope.$index, scope.row)"
                                :disabled="
                                    !(
                                        scope.row.submitStatus == '0' ||
                                        scope.row.submitStatus == '3'
                                    )
                                "
                                >退回</el-button
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
            >
                <el-form
                    :model="infoForm"
                    size="small"
                    :disabled="!tbDialog.isEdit"
                    ref="infoForm"
                    status-icon
                    label-width="100px"
                >
                    <div>
                        <p class="form-box-title mt0">
                            <span class="icon"></span>基本信息
                        </p>
                        <el-row>
                            <el-col :lg="12">
                                <el-form-item label="样本编号">
                                    <el-input
                                        v-model="infoForm.sampleCode"
                                        :disabled="true"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :lg="12">
                                <el-form-item label="姓名">
                                    <el-input
                                        v-model="infoForm.name"
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
                                <el-form-item label="采样次数">
                                    <el-input
                                        v-model="infoForm.samplingTimes"
                                        :clearable="true"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :lg="12">
                                <el-form-item label="送检单位">
                                    <el-select
                                        v-model="infoForm.corporateName"
                                        placeholder="请选择"
                                        class="display-block"
                                    >
                                        <el-option
                                            v-for="(item,
                                            index) in corporateNames"
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
                            <el-col :lg="24">
                                <el-form-item label="退回理由">
                                    <el-input
                                        v-model="infoForm.remark"
                                        :clearable="true"
                                        type="textarea"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                    <div>
                        <p class="form-box-title">
                            <span class="icon"></span>检测基本信息
                        </p>
                        <el-row>
                            <el-col :lg="12">
                                <el-form-item label="实验室编码">
                                    <el-input
                                        v-model="infoForm.labCode"
                                        :clearable="true"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :lg="12">
                                <el-form-item label="检测完成时间">
                                    <el-input
                                        v-model="infoForm.checkTime"
                                        :clearable="true"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :lg="12">
                                <el-form-item label="检测人员">
                                    <el-input
                                        v-model="infoForm.experimenter"
                                        :clearable="true"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :lg="12">
                                <el-form-item label="检测项目">
                                    <el-select
                                        v-model="infoForm.checkType"
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
                        </el-row>
                    </div>
                    <div>
                        <p class="form-box-title">
                            <span class="icon"></span>检测结果信息
                        </p>
                        <template
                            v-if="
                                infoForm.sampleName == '6' ||
                                    infoForm.sampleName == '19'
                            "
                        >
                            <el-row>
                                <el-col :lg="12">
                                    <el-form-item label="抗体检测方法">
                                        <el-select
                                            v-model="infoForm.checkMethod"
                                            placeholder="请选择"
                                            class="display-block"
                                        >
                                            <el-option
                                                v-for="(item,
                                                index) in checkMethods"
                                                :key="index"
                                                :label="item.name"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :lg="12">
                                    <el-form-item label="IgM抗体检测结果">
                                        <el-select
                                            v-model="infoForm.igMResult"
                                            placeholder="请选择"
                                            class="display-block"
                                        >
                                            <el-option
                                                v-for="(item,
                                                index) in checkResults1"
                                                :key="index"
                                                :label="item.name"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col
                                    :lg="12"
                                    v-show="
                                        infoForm.checkMethod != '胶体金法' &&
                                            infoForm.igMResult == '阳性'
                                    "
                                >
                                    <el-form-item label="S/CO值:">
                                        <el-input
                                            v-model="infoForm.igMSCO"
                                            :clearable="true"
                                            placeholder="S/CO值"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :lg="12">
                                    <el-form-item label="IgG抗体检测结果">
                                        <el-select
                                            v-model="infoForm.igGResult"
                                            placeholder="请选择"
                                            class="display-block"
                                        >
                                            <el-option
                                                v-for="(item,
                                                index) in checkResults1"
                                                :key="index"
                                                :label="item.name"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col
                                    :lg="12"
                                    v-show="
                                        infoForm.checkMethod != '胶体金法' &&
                                            infoForm.igGResult == '阳性'
                                    "
                                >
                                    <el-form-item label="S/CO值:">
                                        <el-input
                                            v-model="infoForm.igGSCO"
                                            :clearable="true"
                                            placeholder="S/CO值"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </template>
                        <template v-else>
                            <el-row>
                                <el-col :lg="8">
                                    <el-form-item label="ORF_LAB基因检测结果">
                                        <el-select
                                            v-model="infoForm.orf_lab_result"
                                            placeholder="请选择"
                                        >
                                            <el-option
                                                v-for="(item,
                                                index) in checkResults1"
                                                :key="index"
                                                :label="item.name"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :lg="8">
                                    <el-form-item label="CT值">
                                        <el-input
                                            v-model="infoForm.orf_lab_value"
                                            :clearable="true"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :lg="8">
                                    <el-form-item label="ORF_LAB基因试剂厂商">
                                        <el-select
                                            v-model="
                                                infoForm.orf_lab_manufacturer
                                            "
                                            placeholder="请选择"
                                        >
                                            <el-option
                                                v-for="(item,
                                                index) in manufactors"
                                                :key="index"
                                                :label="item.name"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :lg="8">
                                    <el-form-item label="N基因检测结果">
                                        <el-select
                                            v-model="infoForm.n_result"
                                            placeholder="请选择"
                                        >
                                            <el-option
                                                v-for="(item,
                                                index) in checkResults1"
                                                :key="index"
                                                :label="item.name"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :lg="8">
                                    <el-form-item label="CT值">
                                        <el-input
                                            v-model="infoForm.n_value"
                                            :clearable="true"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :lg="8">
                                    <el-form-item label="N基因检测试剂厂商">
                                        <el-select
                                            v-model="infoForm.n_manufacturer"
                                            placeholder="请选择"
                                        >
                                            <el-option
                                                v-for="(item,
                                                index) in manufactors"
                                                :key="index"
                                                :label="item.name"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :lg="8">
                                    <el-form-item label="E基因检测结果">
                                        <el-select
                                            v-model="infoForm.e_result"
                                            placeholder="请选择"
                                        >
                                            <el-option
                                                v-for="(item,
                                                index) in checkResults1"
                                                :key="index"
                                                :label="item.name"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :lg="8">
                                    <el-form-item label="CT值">
                                        <el-input
                                            v-model="infoForm.e_value"
                                            :clearable="true"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :lg="8">
                                    <el-form-item label="E基因检测试剂厂商">
                                        <el-select
                                            v-model="infoForm.e_manufacturer"
                                            placeholder="请选择"
                                        >
                                            <el-option
                                                v-for="(item,
                                                index) in manufactors"
                                                :key="index"
                                                :label="item.name"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :lg="24">
                                    <el-form-item label="总体检测">
                                        <el-select
                                            v-model="infoForm.checkResult"
                                            placeholder="请选择"
                                        >
                                            <el-option
                                                v-for="(item,
                                                index) in checkResults1"
                                                :key="index"
                                                :label="item.name"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </template>
                        <el-row>
                            <el-col :lg="24">
                                <el-form-item label="说明">
                                    <el-input
                                        v-model="infoForm.remark"
                                        :clearable="true"
                                        type="textarea"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
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
                title="退回理由"
                :visible.sync="returnBackDialog.dialogVisible"
                width="30%"
                :append-to-body="true"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                v-loading.lock="returnBackDialog.loading"
                element-loading-background="rgba(255, 255, 255, 0.5)"
            >
                <el-form
                    :model="returnBackForm"
                    ref="returnBackForm"
                    size="small"
                    label-width="80px"
                >
                    <el-row>
                        <el-col :lg="24">
                            <el-form-item
                                label="退回理由"
                                prop="remark"
                                :rules="[
                                    { required: true, message: '不能为空' }
                                ]"
                            >
                                <el-input
                                    v-model="returnBackForm.remark"
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
                        @click="returnBackDialog.dialogVisible = false"
                        >取消</el-button
                    >
                    <el-button
                        type="primary"
                        size="small"
                        @click="returnBackDialogBtnSure"
                        >确定</el-button
                    >
                </span>
            </el-dialog>
            <el-dialog
                title="输入检测结果"
                :visible.sync="enterResultDialog.dialogVisible"
                width="50%"
                :append-to-body="true"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                v-loading.lock="enterResultDialog.loading"
                element-loading-background="rgba(255, 255, 255, 0.5)"
            >
                <el-form
                    :model="enterResultForm"
                    ref="enterResultForm"
                    size="small"
                    label-width="120px"
                >
                    <el-row>
                        <el-col :lg="24">
                            <el-form-item label="系统采样编号">
                                <el-input
                                    v-model="enterResultForm.sampleCode"
                                    type="textarea"
                                    :disabled="!enterResultForm.isEdit"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="12">
                            <el-form-item label="样本类型">
                                <el-select
                                    v-model="enterResultForm.sampleType"
                                    placeholder="请选择"
                                    class="display-block"
                                    @change="changeSampleType"
                                    :disabled="!enterResultForm.isEdit"
                                >
                                    <el-option
                                        v-for="(item, index) in cTypes"
                                        :key="index"
                                        :label="item.name"
                                        :value="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="24">
                            <el-form-item label="样本名称">
                                <el-radio-group
                                    v-model="enterResultForm.sampleName"
                                    @change="changeSampleName"
                                    :disabled="!enterResultForm.isEdit"
                                >
                                    <el-radio
                                        v-for="(item, index) in sampleNames2"
                                        :key="index"
                                        :label="item.value"
                                        >{{ item.name }}</el-radio
                                    >
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <div>
                        <p class="form-box-title">
                            <span class="icon"></span>检测信息
                        </p>
                        <template
                            v-if="
                                enterResultForm.sampleName == '6' ||
                                    enterResultForm.sampleName == '19'
                            "
                        >
                            <div class="fontWeight">
                                新型冠状病毒抗体检测IgM、IgG
                            </div>
                            <div class="form-child">
                                <el-row>
                                    <el-col :lg="12">
                                        <el-form-item label="检测方法:">
                                            <el-select
                                                v-model="
                                                    enterResultForm.checkMethod
                                                "
                                                placeholder="请选择"
                                                class="display-block"
                                                @change="changeMethod"
                                            >
                                                <el-option
                                                    v-for="(item,
                                                    index) in checkMethods"
                                                    :key="index"
                                                    :label="item.name"
                                                    :value="item.value"
                                                ></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :lg="12">
                                        <el-form-item label="IgM:">
                                            <el-radio-group
                                                v-model="
                                                    enterResultForm.igMResult
                                                "
                                            >
                                                <el-radio
                                                    v-for="(item,
                                                    index) in checkResults1"
                                                    :key="index"
                                                    :label="item.value"
                                                    >{{ item.name }}</el-radio
                                                >
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                    <el-col
                                        :lg="10"
                                        v-show="
                                            enterResultForm.checkMethod !=
                                                '胶体金法' &&
                                                enterResultForm.igMResult ==
                                                    '阳性'
                                        "
                                    >
                                        <el-form-item label="S/CO值:">
                                            <el-input
                                                v-model="enterResultForm.igMSCO"
                                                :clearable="true"
                                                placeholder="S/CO值"
                                            ></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :lg="12">
                                        <el-form-item label="IgG:">
                                            <el-radio-group
                                                v-model="
                                                    enterResultForm.igGResult
                                                "
                                            >
                                                <el-radio
                                                    v-for="(item,
                                                    index) in checkResults1"
                                                    :key="index"
                                                    :label="item.value"
                                                    >{{ item.name }}</el-radio
                                                >
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                    <el-col
                                        :lg="10"
                                        v-show="
                                            enterResultForm.checkMethod !=
                                                '胶体金法' &&
                                                enterResultForm.igGResult ==
                                                    '阳性'
                                        "
                                    >
                                        <el-form-item label="S/CO值:">
                                            <el-input
                                                v-model="enterResultForm.igGSCO"
                                                :clearable="true"
                                                placeholder="S/CO值"
                                            ></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </div>
                        </template>
                        <template v-else>
                            <div class="fontWeight">
                                新型冠状病毒（SARS-CoV-2）核酸检测
                            </div>
                            <div class="form-child">
                                <el-row>
                                    <el-col :xs="24">
                                        <el-form-item label="ORF-Lab基因:">
                                            <el-switch
                                                v-model="
                                                    enterResultForm.ORF_lab_checked
                                                "
                                            ></el-switch>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row style="margin-left: 120px;">
                                    <el-col
                                        :lg="13"
                                        v-show="enterResultForm.ORF_lab_checked"
                                    >
                                        <el-form-item class="no-label">
                                            <el-radio-group
                                                v-model="
                                                    enterResultForm.ORF_lab_result
                                                "
                                            >
                                                <el-radio
                                                    v-for="(item,
                                                    index) in checkResults1"
                                                    :key="index"
                                                    :label="item.value"
                                                    >{{ item.name }}</el-radio
                                                >
                                            </el-radio-group>
                                            <el-input
                                                v-model="
                                                    enterResultForm.ORF_lab_value
                                                "
                                                v-show="
                                                    enterResultForm.ORF_lab_checked &&
                                                        enterResultForm.ORF_lab_result ==
                                                            '阳性'
                                                "
                                                :clearable="true"
                                                class="my-form-input-inline"
                                                placeholder="CT值"
                                            ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col
                                        :lg="10"
                                        v-show="enterResultForm.ORF_lab_checked"
                                    >
                                        <el-form-item
                                            label="生产厂家"
                                            label-width="70px"
                                        >
                                            <el-select
                                                v-model="
                                                    enterResultForm.ORF_lab_manufacturer
                                                "
                                                placeholder="请选择"
                                            >
                                                <el-option
                                                    v-for="(item,
                                                    index) in manufactors"
                                                    :key="index"
                                                    :label="item.name"
                                                    :value="item.value"
                                                ></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :xs="24">
                                        <el-form-item label="N基因:">
                                            <el-switch
                                                v-model="
                                                    enterResultForm.n_checked
                                                "
                                            ></el-switch>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row style="margin-left: 120px;">
                                    <el-col
                                        :lg="13"
                                        v-show="enterResultForm.n_checked"
                                    >
                                        <el-form-item class="no-label">
                                            <el-radio-group
                                                v-model="
                                                    enterResultForm.n_result
                                                "
                                            >
                                                <el-radio
                                                    v-for="(item,
                                                    index) in checkResults1"
                                                    :key="index"
                                                    :label="item.value"
                                                    >{{ item.name }}</el-radio
                                                >
                                            </el-radio-group>
                                            <el-input
                                                v-model="
                                                    enterResultForm.n_value
                                                "
                                                v-show="
                                                    enterResultForm.n_checked &&
                                                        enterResultForm.n_result ==
                                                            '阳性'
                                                "
                                                :clearable="true"
                                                class="my-form-input-inline"
                                                placeholder="CT值"
                                            ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col
                                        :lg="10"
                                        v-show="enterResultForm.n_checked"
                                    >
                                        <el-form-item
                                            label="生产厂家"
                                            label-width="70px"
                                        >
                                            <el-select
                                                v-model="
                                                    enterResultForm.n_manufacturer
                                                "
                                                placeholder="请选择"
                                            >
                                                <el-option
                                                    v-for="(item,
                                                    index) in manufactors"
                                                    :key="index"
                                                    :label="item.name"
                                                    :value="item.value"
                                                ></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :xs="24">
                                        <el-form-item label="E基因:">
                                            <el-switch
                                                v-model="
                                                    enterResultForm.e_checked
                                                "
                                            ></el-switch>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row style="margin-left: 120px;">
                                    <el-col
                                        :lg="13"
                                        v-show="enterResultForm.e_checked"
                                    >
                                        <el-form-item class="no-label">
                                            <el-radio-group
                                                v-model="
                                                    enterResultForm.e_result
                                                "
                                            >
                                                <el-radio
                                                    v-for="(item,
                                                    index) in checkResults1"
                                                    :key="index"
                                                    :label="item.value"
                                                    >{{ item.name }}</el-radio
                                                >
                                            </el-radio-group>
                                            <el-input
                                                v-model="
                                                    enterResultForm.e_value
                                                "
                                                v-show="
                                                    enterResultForm.e_checked &&
                                                        enterResultForm.e_result ==
                                                            '阳性'
                                                "
                                                :clearable="true"
                                                class="my-form-input-inline"
                                                placeholder="CT值"
                                            ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col
                                        :lg="10"
                                        v-show="enterResultForm.e_checked"
                                    >
                                        <el-form-item
                                            label="生产厂家"
                                            label-width="70px"
                                        >
                                            <el-select
                                                v-model="
                                                    enterResultForm.e_manufacturer
                                                "
                                                placeholder="请选择"
                                            >
                                                <el-option
                                                    v-for="(item,
                                                    index) in manufactors"
                                                    :key="index"
                                                    :label="item.name"
                                                    :value="item.value"
                                                ></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :xs="24">
                                        <el-form-item label="总体:">
                                            <el-radio-group
                                                v-model="
                                                    enterResultForm.checkResult
                                                "
                                            >
                                                <el-radio
                                                    v-for="(item,
                                                    index) in checkResults1"
                                                    :key="index"
                                                    :label="item.value"
                                                    >{{ item.name }}</el-radio
                                                >
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </div>
                        </template>
                    </div>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button
                        size="small"
                        @click="enterResultDialog.dialogVisible = false"
                        >取消</el-button
                    >
                    <el-button
                        type="primary"
                        size="small"
                        @click="enterResultDialogBtnSure"
                        >确定</el-button
                    >
                </span>
            </el-dialog>
            <el-dialog
                title="收样"
                :visible.sync="codeInputDialog.dialogVisible"
                width="70%"
                :append-to-body="true"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                v-loading.lock="codeInputDialog.loading"
                element-loading-background="rgba(255, 255, 255, 0.5)"
            >
                <el-form
                    :model="codeInputForm"
                    ref="codeInputForm"
                    size="small"
                    label-width="100px"
                >
                    <el-row>
                        <el-col :lg="24">
                            <el-form-item label="系统采样编号">
                                <el-input
                                    v-model="codeInputForm.sampleCode"
                                    :clearable="true"
                                    type="textarea"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="24">
                            <el-form-item>
                                <el-button type="primary" @click="onSearchCode"
                                    >查询</el-button
                                >
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-table
                    ref="multipleTable2"
                    :data="codeInputDialogTableData"
                    size="small"
                    style="width: 100%"
                    @selection-change="handleSelectionChange2"
                >
                    <el-table-column type="selection" width="50" fixed="left">
                    </el-table-column>
                    <el-table-column
                        type="index"
                        label="序号"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="sampleCode"
                        label="样本编号"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="name"
                        label="姓名"
                        align="center"
                    ></el-table-column>
                    <el-table-column label="状态" align="center">
                        <template slot-scope="scope">
                            <el-tag
                                size="small"
                                type="info"
                                v-if="scope.row.checkStatus == 1"
                                >{{
                                    scope.row.checkStatus | getStatusName(that)
                                }}</el-tag
                            >
                            <el-tag
                                size="small"
                                type="warning"
                                v-else-if="scope.row.checkStatus == 2"
                                >{{
                                    scope.row.checkStatus | getStatusName(that)
                                }}</el-tag
                            >
                            <el-tag
                                size="small"
                                v-else-if="scope.row.checkStatus == 3"
                                >{{
                                    scope.row.checkStatus | getStatusName(that)
                                }}</el-tag
                            >
                            <el-tag
                                size="small"
                                type="success"
                                v-else-if="scope.row.checkStatus == 4"
                                >{{
                                    scope.row.checkStatus | getStatusName(that)
                                }}</el-tag
                            >
                            <el-tag
                                size="small"
                                type="danger"
                                v-else-if="scope.row.checkStatus == 5"
                                >{{
                                    scope.row.checkStatus | getStatusName(that)
                                }}</el-tag
                            >
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="corporateName"
                        label="送检单位"
                        align="center"
                    ></el-table-column>
                    <el-table-column label="样本名称" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.sampleName | getSampleName(that) }}
                        </template>
                    </el-table-column>
                </el-table>
                <span slot="footer" class="dialog-footer">
                    <el-button
                        size="small"
                        @click="codeInputDialog.dialogVisible = false"
                        >取消</el-button
                    >
                    <el-button
                        type="primary"
                        size="small"
                        @click="codeInputDialogBtnSure"
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
                sampleCode1: "",
                sampleCode2: "",
                name: "",
                labCode: "",
                sampleName: "",
                checkType: "",
                time: "",
                corporateName: "",
                checkResult: "",
                IgMResult: "",
                IgGResult: "",
                statusCode: "",
                nameOrderBy: false
            },
            infoForm: {},
            returnBackForm: {
                remark: ""
            },
            enterResultForm: {
                isEdit: false,
                sampleCode: "",
                sampleType: "",
                sampleName: "",
                checkType: "",
                checkMethod: "胶体金法",
                igMResult: "阴性",
                igMSCO: "",
                igGResult: "阴性",
                igGSCO: "",
                ORF_lab_checked: false,
                ORF_lab_result: "阴性",
                ORF_lab_value: "",
                ORF_lab_manufacturer: "",
                n_checked: false,
                n_result: "阴性",
                n_value: "",
                n_manufacturer: "",
                e_checked: false,
                e_result: "阴性",
                e_value: "",
                e_manufacturer: "",
                checkResult: ""
            },
            codeInputForm: {
                sampleCode: ""
            },
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
            checkResults1: [
                { name: "阴性", value: "阴性" },
                { name: "阳性", value: "阳性" }
            ],
            checkResults: [
                { name: "全部", value: "" },
                { name: "阴性", value: "阴性" },
                { name: "阳性", value: "阳性" }
            ],
            IgMResults: [
                { name: "全部", value: "" },
                { name: "阴性", value: "阴性" },
                { name: "阳性", value: "阳性" }
            ],
            IgGResults: [
                { name: "全部", value: "" },
                { name: "阴性", value: "阴性" },
                { name: "阳性", value: "阳性" }
            ],
            tableData: [],
            multipleSelection: [],
            sendMultipleSelection: [],
            enterMultipleSelection: [],
            printMultipleSelection: [],
            tbDialog: {
                isEdit: false,
                dialogVisible: false,
                dialogTitle: "查看采样信息"
            },
            cTypes: [],
            sampleNames2: [],
            checkMethods: [],
            manufactors: [],
            enterResultDialog: {
                dialogVisible: false,
                loading: false
            },
            returnBackDialog: {
                dialogVisible: false,
                loading: false
            },
            codeInputDialog: {
                dialogVisible: false,
                loading: false
            },
            codeInputDialogTableData: [],
            multipleSelection2: []
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

        // 数据字典--样本类型
        this.findDictionaryChildList({
            dictionary_code: "29782064eae14696b461f102cad89c27"
        });

        // 数据字典--检测方法
        this.findDictionaryChildList({
            dictionary_code: "64b02ba0bb204d3fada301f74c047b46"
        });

        // 数据字典--生产厂家
        this.findDictionaryChildList({
            dictionary_code: "d1b98995bc1841ca97ef2c31776af5b9"
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
                sampleCode1: "",
                sampleCode2: "",
                name: "",
                labCode: "",
                time: "",
                sampleName: "",
                personnel: "",
                checkResult: "",
                IgMResult: "",
                IgGResult: "",
                checkStatus: "",
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
                        case "64b02ba0bb204d3fada301f74c047b46":
                            this.checkMethods = json.data.data;
                            break;
                        case "29782064eae14696b461f102cad89c27":
                            this.cTypes = json.data.data;
                            break;
                        case "d1b98995bc1841ca97ef2c31776af5b9":
                            this.manufactors = json.data.data;
                            break;
                    }
                })
                .catch(() => {});
        },
        // 获取表格数据
        getTableData() {
            let param = {
                sampleCode: this.form.barCode1 + "~" + this.form.barCode2,
                name: this.form.name,
                labCode: this.form.labCode,
                sampleName: this.form.sampleName,
                checkType: this.form.checkType,
                corporateName: this.form.corporateName,
                checkResult: this.form.checkResult,
                IgMResult: this.form.IgMResult,
                IgGResult: this.form.IgGResult,
                checkStatus: this.form.checkStatus,
                checkTime1: this.form.time
                    ? this.formatDate(this.form.time[0])
                    : "",
                checkTime2: this.form.time
                    ? this.formatDate(this.form.time[1])
                    : ""
            };

            this.loading = true;
            checkApi
                .getSampleCheckData()
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
            this.tbDialog.isEdit = false;
            this.tbDialog.dialogVisible = true;
            this.tbDialog.dialogTitle = "查看检测报告";
            this.infoForm = JSON.parse(JSON.stringify(row));
        },
        // 表格编辑
        handleEdit(index, row) {
            this.tbDialog.isEdit = true;
            this.tbDialog.dialogVisible = true;
            this.tbDialog.dialogTitle = "编辑检测报告";
            this.infoForm = JSON.parse(JSON.stringify(row));
        },
        // 表格录入
        handleEnter(index, row) {
            this.enterResultDialog.dialogVisible = true;
            this.infoForm = JSON.parse(JSON.stringify(row));

            // 初始化录入的值
            this.enterResultForm = {
                isEdit: false,
                sampleCode: this.infoForm.sampleCode,
                sampleType: this.infoForm.ctype,
                sampleName: this.infoForm.sampleName,
                checkType: this.infoForm.checkType,
                checkMethod: "胶体金法",
                igMResult: "阴性",
                igMSCO: "",
                igGResult: "阴性",
                igGSCO: "",
                ORF_lab_checked: false,
                ORF_lab_result: "阴性",
                ORF_lab_value: "",
                ORF_lab_manufacturer: "",
                n_checked: false,
                n_result: "阴性",
                n_value: "",
                n_manufacturer: "",
                e_checked: false,
                e_result: "阴性",
                e_value: "",
                e_manufacturer: "",
                checkResult: ""
            };

            checkApi
                .getListByCheckNo({ typeCode: this.enterResultForm.sampleType })
                .then(json => {
                    setTimeout(() => {
                        this.sampleNames2 = json.data.data;
                    }, 1000);
                })
                .catch(() => {});
        },
        // 表格推送
        handleSend(index, row) {
            this.infoForm = JSON.parse(JSON.stringify(row));
            this.$confirm("确定推送此数据么?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    let checkCode = this.infoForm.checkCode;
                    console.log(checkCode);

                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
                    }, 1000);
                })
                .catch(() => {});
        },
        // 表格退回
        handleReturn(index, row) {
            this.infoForm = JSON.parse(JSON.stringify(row));

            this.returnBackDialog.dialogVisible = true;

            this.$nextTick(() => {
                this.$refs["returnBackForm"].resetFields();
            });
        },
        // 表格退回--确定按钮
        returnBackDialogBtnSure() {
            this.$refs["returnBackForm"].validate(valid => {
                if (valid) {
                    let param = {
                        sampleCode: this.infoForm.sampleCode,
                        remark: this.returnBackForm.remark
                    };
                    console.log(param);

                    this.returnBackDialog.loading = true;
                    setTimeout(() => {
                        this.returnBackDialog.loading = false;

                        this.returnBackDialog.dialogVisible = false;
                    }, 1000);
                } else {
                    return false;
                }
            });
        },
        // 表格查看--确定按钮
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
                    codes.push(item.sampleCode)
                );
                param = {
                    codes: codes,
                    exportType: 1
                };
            } else {
                param = {
                    sampleCode: this.form.barCode1 + "~" + this.form.barCode2,
                    name: this.form.name,
                    labCode: this.form.labCode,
                    sampleName: this.form.sampleName,
                    checkType: this.form.checkType,
                    corporateName: this.form.corporateName,
                    checkResult: this.form.checkResult,
                    IgMResult: this.form.IgMResult,
                    IgGResult: this.form.IgGResult,
                    checkStatus: this.form.checkStatus,
                    checkTime1: this.form.time
                        ? this.formatDate(this.form.time[0])
                        : "",
                    checkTime2: this.form.time
                        ? this.formatDate(this.form.time[1])
                        : "",
                    /*                    orderMap: {
                                            name: $("#identity").is(':checked') ? "desc": "",
                                        },*/
                    exportType: 2
                };
            }
            console.log(param);
        },
        // 批量收样
        scanCodeInput() {
            this.codeInputForm.sampleCode = "";
            this.codeInputDialogTableData = [];

            this.codeInputDialog.dialogVisible = true;
        },
        // 批量收样--查询按钮
        onSearchCode() {
            if (!this.codeInputForm.sampleCode) {
                this.$message({
                    showClose: true,
                    message: "请先输入样本编码",
                    type: "error",
                    duration: 2000
                });
                return;
            }

            let codes = this.codeInputForm.sampleCode.split(",");

            this.codeInputDialog.loading = true;
            checkApi
                .getSampleDatabyCode()
                .then(json => {
                    setTimeout(() => {
                        this.codeInputDialogTableData = json.data.data;
                        this.codeInputDialog.loading = false;
                    }, 1000);
                })
                .catch(() => {});
        },
        // 批量收样--表格多选
        handleSelectionChange2(val) {
            this.multipleSelection2 = val;
        },
        // 批量收样--确定按钮
        codeInputDialogBtnSure() {
            let num = this.multipleSelection2.length;
            if (!num) {
                this.$message({
                    showClose: true,
                    message: "至少选择一条录入",
                    type: "error",
                    duration: 2000
                });
                return;
            }

            this.$confirm(`您当前选择了${num}条数据，确定收样么?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    let checkDOs = this.multipleSelection2;
                    console.log(checkDOs);

                    this.codeInputDialog.loading = true;
                    setTimeout(() => {
                        this.codeInputDialog.loading = false;

                        this.codeInputDialog.dialogVisible = false;
                    }, 1000);
                })
                .catch(() => {});
        },
        // 批量推送
        pushAll() {
            let num = this.sendMultipleSelection.length;
            if (!num) {
                this.$message({
                    showClose: true,
                    message: "至少选择一条推送",
                    type: "error",
                    duration: 2000
                });
                return;
            }

            this.$confirm(`您当前选择了${num}条数据，确定收推送么?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    let ids = [];
                    let sampleCodes = [];

                    this.sendMultipleSelection.forEach(item => {
                        ids.push(item.id);
                        sampleCodes.push(item.sampleCode);
                    });

                    console.log(ids);
                    console.log(sampleCodes);

                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
                    }, 1000);
                })
                .catch(() => {});
        },
        // 扫码导入检测结果
        inputResult() {
            // 初始化录入的值
            this.enterResultForm = {
                isEdit: true,
                sampleCode: "",
                sampleType: "1",
                sampleName: "",
                checkType: "",
                checkMethod: "胶体金法",
                igMResult: "阴性",
                igMSCO: "",
                igGResult: "阴性",
                igGSCO: "",
                ORF_lab_checked: false,
                ORF_lab_result: "阴性",
                ORF_lab_value: "",
                ORF_lab_manufacturer: "",
                n_checked: false,
                n_result: "阴性",
                n_value: "",
                n_manufacturer: "",
                e_checked: false,
                e_result: "阴性",
                e_value: "",
                e_manufacturer: "",
                checkResult: ""
            };

            checkApi
                .getListByCheckNo({ typeCode: this.enterResultForm.sampleType })
                .then(json => {
                    setTimeout(() => {
                        this.sampleNames2 = json.data.data;
                    }, 1000);
                })
                .catch(() => {});

            this.enterResultDialog.dialogVisible = true;
        },
        // 批量录入
        enterResult() {
            let sameSamples = this.enterMultipleSelection.filter(
                (item, index, arr) => item.sampleName == arr[0].sampleName
            );
            if (
                !sameSamples.length ||
                sameSamples.length != this.enterMultipleSelection.length
            ) {
                this.$message({
                    showClose: true,
                    message: "请勾选相同样本进行录入",
                    type: "error",
                    duration: 2000
                });
                return;
            }

            // 初始化录入的值
            let sampleCodes = [];
            this.enterMultipleSelection.forEach(item =>
                sampleCodes.push(item.sampleCode)
            );

            this.enterResultForm = {
                isEdit: false,
                sampleCode: sampleCodes.join(),
                sampleType: this.enterMultipleSelection[0].ctype,
                sampleName: this.enterMultipleSelection[0].sampleName,
                checkType: this.enterMultipleSelection[0].checkType,
                checkMethod: "胶体金法",
                igMResult: "阴性",
                igMSCO: "",
                igGResult: "阴性",
                igGSCO: "",
                ORF_lab_checked: false,
                ORF_lab_result: "阴性",
                ORF_lab_value: "",
                ORF_lab_manufacturer: "",
                n_checked: false,
                n_result: "阴性",
                n_value: "",
                n_manufacturer: "",
                e_checked: false,
                e_result: "阴性",
                e_value: "",
                e_manufacturer: "",
                checkResult: ""
            };

            checkApi
                .getListByCheckNo({ typeCode: this.enterResultForm.sampleType })
                .then(json => {
                    setTimeout(() => {
                        this.sampleNames2 = json.data.data;
                    }, 1000);
                })
                .catch(() => {});

            this.enterResultDialog.dialogVisible = true;
        },
        // 录入--样本类型改变事件
        changeSampleType(currentVal) {
            this.enterResultForm.sampleType = currentVal;
            this.enterResultForm.sampleName = "";
            checkApi
                .getListByCheckNo({ typeCode: currentVal })
                .then(json => {
                    setTimeout(() => {
                        this.sampleNames2 = json.data.data;
                    }, 1000);
                })
                .catch(() => {});
        },
        // 录入--样本名称改变事件
        changeSampleName(currentVal) {
            this.enterResultForm.sampleName = currentVal;
            if (currentVal == "6" || currentVal == "19") {
                this.enterResultForm.checkType = "NUCLEICACID"; // 新型冠状病毒抗体检测
            } else {
                this.enterResultForm.checkType = "ANTIBODY"; // 新型冠状病毒核酸检测
            }
        },
        // 录入--检测方法改变事件
        changeMethod(currentVal) {
            console.log(currentVal);
        },
        // 录入--确定按钮
        enterResultDialogBtnSure() {
            // 校验 系统采样编号
            if (!this.enterResultForm.sampleCode) {
                this.$message({
                    showClose: true,
                    message: "请输入系统采样编号",
                    type: "error",
                    duration: 2000
                });
                return;
            }

            // 校验 样本名称
            if (!this.enterResultForm.sampleName) {
                this.$message({
                    showClose: true,
                    message: "请选择样本名称",
                    type: "error",
                    duration: 2000
                });
                return;
            }

            let param = {
                sampleCode: this.enterResultForm.sampleCode,
                checkType: this.enterResultForm.checkType,
                result: {}
            };

            if (
                this.enterResultForm.sampleName == "6" ||
                this.enterResultForm.sampleName == "19"
            ) {
                param.result = {
                    checkMethod: this.enterResultForm.checkMethod,
                    igMResult: this.enterResultForm.igMResult,
                    igMSCO: "",
                    igGResult: this.enterResultForm.igGResult,
                    igGSCO: ""
                };

                // 校验 检测方法
                if (this.enterResultForm.checkMethod != "胶体金法") {
                    if (
                        this.enterResultForm.igMResult == "阳性" &&
                        !this.enterResultForm.igMSCO.trim()
                    ) {
                        this.$message({
                            showClose: true,
                            message: "请输入IgM的S/CO值！",
                            type: "error",
                            duration: 2000
                        });
                        return;
                    }

                    if (
                        this.enterResultForm.igGResult == "阳性" &&
                        !this.enterResultForm.igGSCO.trim()
                    ) {
                        this.$message({
                            showClose: true,
                            message: "请输入IgG的S/CO值！",
                            type: "error",
                            duration: 2000
                        });
                        return;
                    }
                    param.result.igMSCO = this.enterResultForm.igMSCO;
                    param.result.igGSCO = this.enterResultForm.igGSCO;
                }
            } else {
                // 校验 ORF-Lab基因
                if (this.enterResultForm.ORF_lab_checked) {
                    if (this.enterResultForm.ORF_lab_result == "阳性") {
                        if (!this.enterResultForm.ORF_lab_value.trim()) {
                            this.$message({
                                showClose: true,
                                message: "请输入ORF_LAB的阳性值！",
                                type: "error",
                                duration: 2000
                            });
                            return;
                        }
                        param.result.ORF_lab_value = this.enterResultForm.ORF_lab_value;
                    } else {
                        param.result.ORF_lab_value = "";
                    }

                    if (!this.enterResultForm.ORF_lab_manufacturer) {
                        this.$message({
                            showClose: true,
                            message: "请选择ORF_LAB的生产厂商！",
                            type: "error",
                            duration: 2000
                        });
                        return;
                    }
                    param.result.ORF_lab_result = this.enterResultForm.ORF_lab_result;
                    param.result.ORF_lab_manufacturer = this.enterResultForm.ORF_lab_manufacturer;
                }

                // 校验 N基因
                if (this.enterResultForm.n_checked) {
                    if (this.enterResultForm.n_result == "阳性") {
                        if (!this.enterResultForm.n_value.trim()) {
                            this.$message({
                                showClose: true,
                                message: "请输入N基因的阳性值！",
                                type: "error",
                                duration: 2000
                            });
                            return;
                        }
                        param.result.n_value = this.enterResultForm.n_value;
                    } else {
                        param.result.n_value = "";
                    }

                    if (!this.enterResultForm.n_manufacturer) {
                        this.$message({
                            showClose: true,
                            message: "请选择N基因的生产厂商！",
                            type: "error",
                            duration: 2000
                        });
                        return;
                    }
                    param.result.n_result = this.enterResultForm.n_result;
                    param.result.n_manufacturer = this.enterResultForm.n_manufacturer;
                }

                // 校验 E基因
                if (this.enterResultForm.e_checked) {
                    if (this.enterResultForm.e_result == "阳性") {
                        if (!this.enterResultForm.e_value.trim()) {
                            this.$message({
                                showClose: true,
                                message: "请输入E基因的阳性值！",
                                type: "error",
                                duration: 2000
                            });
                            return;
                        }
                        param.result.e_value = this.enterResultForm.e_value;
                    } else {
                        param.result.e_value = "";
                    }

                    if (!this.enterResultForm.e_manufacturer) {
                        this.$message({
                            showClose: true,
                            message: "请选择E基因的生产厂商！",
                            type: "error",
                            duration: 2000
                        });
                        return;
                    }
                    param.result.e_result = this.enterResultForm.e_result;
                    param.result.e_manufacturer = this.enterResultForm.e_manufacturer;
                }

                // 校验 总体检测结果
                if (!this.enterResultForm.checkResult) {
                    this.$message({
                        showClose: true,
                        message: "请选择一个总体检测结果！",
                        type: "error",
                        duration: 2000
                    });
                    return;
                }
                param.result.checkResult = this.enterResultForm.checkResult;
            }

            console.log(param);
        },
        // 批量导出部分检测报告
        batchDownload() {
            if (!this.printMultipleSelection.length) {
                this.$message({
                    showClose: true,
                    message: "请勾选需要导出的报告",
                    type: "error",
                    duration: 2000
                });
                return;
            }
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
    },
    watch: {
        multipleSelection(val) {
            let sendSelection = [];
            let enterSelection = [];
            let printSelection = [];
            val.forEach(item => {
                if (
                    item.checkStatus == "4" &&
                    (item.submitStatus == "0" || item.submitStatus == "3")
                ) {
                    sendSelection.push(item);
                }

                if (item.checkStatus == "3") {
                    enterSelection.push(item);
                }

                if (item.checkStatus == "4" && item.submitStatus == "2") {
                    printSelection.push(item);
                }
            });

            this.sendMultipleSelection = JSON.parse(
                JSON.stringify(sendSelection)
            );
            this.enterMultipleSelection = JSON.parse(
                JSON.stringify(enterSelection)
            );
            this.printMultipleSelection = JSON.parse(
                JSON.stringify(printSelection)
            );
        }
    }
};
</script>

<style lang="scss" scoped>
.form-child {
    background: #eee;
    margin-top: 20px;
    padding-top: 20px;
    padding-right: 20px;

    .my-form-input-inline {
        display: inline-block;
        width: 30%;
        margin-left: 20px;
    }
}
</style>
