<template>
    <div class="">
        <Header></Header>
        <Nav itemActive="4"></Nav>
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
                        <el-form-item label="样本编号">
                            <el-input
                                v-model="form.sample_code"
                                :clearable="true"
                                placeholder="样本编号"
                            ></el-input>
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
                                v-model="form.igMResult"
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
                                v-model="form.igGResult"
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
                        <el-button
                            size="mini"
                            type="primary"
                            @click="pushCheckAll()"
                            ><i class="el-icon-download"></i> 批量审批通过 ({{
                                multipleSelection.length
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
                                >{{ scope.row.sampleCode }}</el-link
                            >
                        </template>
                    </el-table-column>
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
                        width="100"
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
                        width="170"
                        show-overflow-tooltip
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
                        prop="checkTime"
                        label="检测完成时间"
                        align="center"
                        width="130"
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
                                type="primary"
                                @click="handleSend(scope.$index, scope.row)"
                                >通过</el-button
                            >
                            <el-button
                                size="mini"
                                type="danger"
                                @click="handleReturn(scope.$index, scope.row)"
                                >驳回</el-button
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
                            <el-col :lg="24">
                                <el-form-item label="驳回理由">
                                    <el-input
                                        v-model="infoForm.remark"
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
                            <el-col :lg="12">
                                <el-form-item label="实验室编码">
                                    <el-input
                                        v-model="infoForm.labCode"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :lg="12">
                                <el-form-item label="检测人员">
                                    <el-input
                                        v-model="infoForm.experimenter"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :lg="12">
                                <el-form-item label="收样时间">
                                    <el-input
                                        v-model="infoForm.checkTime"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :lg="12">
                                <el-form-item label="检测完成时间">
                                    <el-input
                                        v-model="infoForm.checkTime"
                                    ></el-input>
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
                                    <el-form-item
                                        label="IgM抗体检测结果"
                                        class="line-height20"
                                    >
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
                                    <el-form-item
                                        label="IgG抗体检测结果"
                                        class="line-height20"
                                    >
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
                                    <el-form-item
                                        label="ORF_LAB基因检测结果"
                                        class="line-height20"
                                    >
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
                                    <el-form-item
                                        label="ORF_LAB基因试剂厂商"
                                        class="line-height20"
                                    >
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
                                    <el-form-item
                                        label="N基因检测结果"
                                        class="line-height20"
                                    >
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
                                    <el-form-item
                                        label="N基因检测试剂厂商"
                                        class="line-height20"
                                    >
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
                                    <el-form-item
                                        label="E基因检测结果"
                                        class="line-height20"
                                    >
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
                                    <el-form-item
                                        label="E基因检测试剂厂商"
                                        class="line-height20"
                                    >
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
                        type="primary"
                        size="small"
                        @click="tbDialog.dialogVisible = false"
                        >确定</el-button
                    >
                </span>
            </el-dialog>
            <el-dialog
                title="驳回理由"
                :visible.sync="returnBackDialog.dialogVisible"
                width="30%"
                :append-to-body="true"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                v-loading.fullscreen.lock="returnBackDialog.loading"
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
                                label="驳回理由"
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
        </div>
    </div>
</template>

<script>
import { approveApi, commonApi } from "@/api/api";
import Header from "@/components/Header.vue";
import Nav from "@/components/Nav.vue";

export default {
    components: { Header, Nav },
    data() {
        return {
            that: this,
            loading: false,
            form: {
                sample_code: "",
                checkResult: "",
                igMResult: "",
                igGResult: ""
            },
            infoForm: {},
            returnBackForm: {
                remark: ""
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
            checkMethods: [],
            manufactors: [],
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
            tbDialog: {
                dialogVisible: false
            },
            returnBackDialog: {
                dialogVisible: false,
                loading: false
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
            this.getTableData();
        },
        // 重置
        onReset() {
            this.form = {
                sample_code: "",
                checkResult: "",
                igMResult: "",
                igGResult: ""
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
                sample_code: this.form.sample_code,
                checkResult: this.form.checkResult,
                igMResult: this.form.igMResult,
                igGResult: this.form.igGResult
            };

            this.loading = true;
            approveApi
                .getTableData()
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
        // 表格通过
        handleSend(index, row) {
            this.infoForm = JSON.parse(JSON.stringify(row));
            this.$confirm("确定通过此数据么?", "提示", {
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
        // 表格驳回
        handleReturn(index, row) {
            this.infoForm = JSON.parse(JSON.stringify(row));

            this.returnBackDialog.dialogVisible = true;

            this.$nextTick(() => {
                this.$refs["returnBackForm"].resetFields();
            });
        },
        // 表格驳回--确定按钮
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
                    sample_code: this.form.sample_code,
                    checkResult: this.form.checkResult,
                    igMResult: this.form.igMResult,
                    igGResult: this.form.igGResult,
                    exportType: 2
                };
            }
            console.log(param);
        },
        // 批量通过
        pushCheckAll() {
            let num = this.multipleSelection.length;
            if (!num) {
                this.$message({
                    showClose: true,
                    message: "暂无可通过数据",
                    type: "error",
                    duration: 2000
                });
                return;
            }

            this.$confirm(`确定通过这${num}条数据么?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    let checkCodes = [];
                    this.multipleSelection.forEach(item =>
                        checkCodes.push(item.checkCode)
                    );
                    console.log(checkCodes.join());

                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
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
