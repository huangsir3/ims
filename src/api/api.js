// import Vue from "vue";
import axios from "axios";
// import qs from "qs";

const instance = axios.create({
    // baseURL: "/api",
    headers: {
        "content-type": "application/json;charset=UTF-8"
    },
    withCredentials: true
});

// 添加请求拦截器
instance.interceptors.request.use(
    config => {
        // 在发送请求之前做某些
        /*!config.headers.tenantId && (config.headers.tenantId = window.omsConfig.tenantId);
        !config.headers.openId && (config.headers.openId = localStorage.getItem("omsOpenId"));
        config.headers.source = 2;*/
        return config;
    },
    error => {
        // 请求错误时做某些事
        return Promise.reject(error);
    }
);

// 添加响应拦截器
instance.interceptors.response.use(
    response => {
        return response;
        // 对响应数据做某些事
        /*if (response.data.status.success) {
            if (
                response.data.resultBody &&
                response.data.resultBody.code &&
                response.data.resultBody.msg
            ) {
                if (response.data.resultBody.code == 200) {
                    Notify({
                        message: response.data.resultBody.msg,
                        duration: 3000,
                        background: "#1989fa"
                    });
                    return response;
                } else {
                    Notify({
                        message: response.data.resultBody.msg,
                        duration: 3000,
                        background: "#f44"
                    });
                    return Promise.reject(response);
                }
            } else {
                return response;
            }
        } else {
            return Promise.reject(response);
        }*/
    },
    error => {
        // 响应错误时做某些事
        return Promise.reject(error);
    }
);
/* 公共api*/
const commonApi = {
    // 采集所在疾控单位
    findSamplingListAll: () => {
        return instance.get("samplingUnitData.json");
    },
    // 检测所在所在实验室
    findLaboratoryListAll: () => {
        return instance.get("laboratoryData.json");
    },
    // 区域列表
    findAreaAddressList: () => {
        return instance.get("areaAddressListData.json");
    },
    // 数据字典
    findDictionaryChildList: param => {
        switch (param.dictionary_code) {
            case "d71f21d97a11483eb5bd2478bdbe3735":
                return instance.get("STATUS.json");
            case "5b1cf46663bf498e9cd443bbccc8c8d7":
                return instance.get("CHECK_TYPE.json");
            case "958d9f021aa64ccbae1bfe1d167bd679":
                return instance.get("SAMPLE_NAME.json");
            case "7d4e7734040149da9215380e099a473b":
                return instance.get("PERSONNEL.json");
            case "64b02ba0bb204d3fada301f74c047b46":
                return instance.get("CHECKMETHOD.json");
            case "d1b98995bc1841ca97ef2c31776af5b9":
                return instance.get("MANUFACTOR.json");
            case "29782064eae14696b461f102cad89c27":
                return instance.get("SAMPLE_TYPE.json");
            case "21ae09cf98b742d1aaa9edc3df55cfad":
                return instance.get("CHECK_METHOD_ACID.json");
            default:
                return instance.get("none.json");
        }
    }
};

/* 登录/注册页面 */
// const loginRegistrApi = {};

/* 采样系统 */
const collectApi = {
    // 采样数据
    getSampleData: params => {
        return instance.get("samplingData.json");
        // return instance.post("/barCode/findList", params);
    },
    // 检测数据
    getSampleCheckData: () => {
        return instance.get("sampleCheckData.json");
    },
    // 获取当前属于哪个疾控中心
    getSam: () => {
        return instance.get("corporateData.json");
    },
    // 根据id，返回样本编号
    printView: () => {
        return instance.get("barCodes.json");
    }
};

/* 检测系统 */
const checkApi = {
    // 采样数据
    getSampleData: () => {
        return instance.get("samplingData.json");
    },
    // 检测数据
    getSampleCheckData: () => {
        return instance.get("sampleCheckData1.json");
    },
    // 根据code获取采样数据
    getSampleDatabyCode: () => {
        return instance.get("sampleData.json");
    },
    // 根据样本类型获取样本列表
    getListByCheckNo: param => {
        switch (param.typeCode) {
            case "1":
                return instance.get("sampleData1.json");
            case "2":
                return instance.get("sampleData2.json");
            default:
                return instance.get("none.json");
        }
    }
};

/* 审批系统 */
const approveApi = {
    // 审批表格数据
    getTableData: () => {
        return instance.get("approveData.json");
    }
};

/* 管理系统 */
const manageApi = {
    // 用户管理--用户表格列表
    findUserList: () => {
        return instance.get("userListData.json");
    },
    // 采样点管理--区域表格列表
    areaList: () => {
        return instance.get("areaListData.json");
    },
    // 实验室管理--实验室表格列表
    findLaboratoryList: () => {
        return instance.get("laboratoryListData.json");
    },
    // 数据字典--数据字典表格列表
    findDictionaryList: () => {
        return instance.get("dictionaryListData.json");
    },
    // 操作日志--日志表格列表
    logList: () => {
        return instance.get("logListData.json");
    }
};

export { commonApi, collectApi, checkApi, approveApi, manageApi };
