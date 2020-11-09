/**
 * 根据时间戳转换成对应格式的时间
 * @param {string} value: 时间戳）
 * @param {string} fmt: 日期格式字符串
 */
export const formatDate = (value, fmt) => {
    if (!fmt) {
        fmt = "yyyy-MM-dd";
    }
    let date = null;
    if (typeof value === "object") {
        // new Date()
        date = value;
    } else if (typeof value === "number") {
        // 时间戳
        date = new Date(value);
    } else {
        // 时间格式字符串
        date = new Date(value.replace(/-/g, "/"));
    }

    let o = {
        "M+": date.getMonth() + 1, // 月份
        "d+": date.getDate(), // 日
        "h+": date.getHours(), // 小时
        "m+": date.getMinutes(), // 分
        "s+": date.getSeconds(), // 秒
        "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    }
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1
                    ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length)
            );
        }
    }
    return fmt;
};

/**
 * 根据时间戳转换成对应格式的时间
 * @param {string} value: 时间戳）
 */
export const formatDay = value => {
    let date = null;
    if (typeof value === "object") {
        // new Date()
        date = value;
    } else if (typeof value === "number") {
        // 时间戳
        date = new Date(value);
    } else {
        // 时间格式字符串
        date = new Date(value.replace(/-/g, "/"));
    }

    let day = date.getDay();
    let dayStr = "";
    switch (day) {
        case 0:
            dayStr = "周日";
            break;
        case 1:
            dayStr = "周一";
            break;
        case 2:
            dayStr = "周二";
            break;
        case 3:
            dayStr = "周三";
            break;
        case 4:
            dayStr = "周四";
            break;
        case 5:
            dayStr = "周五";
            break;
        case 6:
            dayStr = "周六";
            break;
    }

    return dayStr;
};
