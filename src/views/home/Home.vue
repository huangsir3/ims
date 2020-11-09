<template>
    <div class="home">
        <div class="datetime">
            <div class="fr font14 mt10">
                <div>{{ datetime | formatDate("yyyy-MM-dd") }}</div>
                <div>{{ datetime | formatDay() }}</div>
            </div>
            <div class="time fr font40 mr10">
                {{ datetime | formatDate("hh:mm:ss") }}
            </div>
        </div>
        <ul>
            <li class="collect">
                <router-link to="/collect">采集系统</router-link>
            </li>
            <li class="check">
                <router-link to="/check">检测系统</router-link>
            </li>
            <li class="approve">
                <router-link to="/approve">审批系统</router-link>
            </li>
            <li class="manage">
                <router-link to="/manage">管理系统</router-link>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            datetime: "",
            userName: "超级管理员",
            int: null
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
    methods: {}
};
</script>

<style lang="scss" scoped>
.home {
    height: 100%;
    background: url("../../assets/img/home/home_bg.png") center center no-repeat
        #edf5fb;
    background-size: 100% 100%;
}
.datetime {
    position: fixed;
    top: 15px;
    right: 15px;
}
.time {
    height: 60px;
    line-height: 60px;
    font-weight: bold;
}
ul {
    text-align: center;
    padding-top: 200px;
    li {
        display: inline-block;
        width: 320px;
        height: 420px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        margin: 0 15px 15px 15px;
        border-radius: 10px;
        border: 1px solid #a9dafc;
        font-size: 24px;

        &.collect {
            background-image: url("../../assets/img/home/collect.png");
        }
        &.check {
            background-image: url("../../assets/img/home/check.png");
        }
        &.approve {
            background-image: url("../../assets/img/home/approve.png");
        }
        &.manage {
            background-image: url("../../assets/img/home/manage.png");
        }

        a {
            display: inline-block;
            width: 100%;
            height: 100%;
            line-height: 760px;
            color: #212121;
        }

        &:hover {
            box-shadow: 0px 5px 15px 0px rgba(36, 67, 147, 0.2);
            font-weight: bold;
        }
    }
}
</style>
