<template>
    <div class="">
        <Header></Header>
        <Nav itemActive="9"></Nav>
        <div class="pageContent">
            <el-tabs type="border-card">
                <el-tab-pane label="报表设计" :style="`height:${height}`">
                    <div :style="`height:${height}`">
                        <iframe
                            :src="src"
                            frameborder="no"
                            style="width: 100%;height: 100%"
                            scrolling="auto"
                        />
                    </div>
                </el-tab-pane>
                <el-tab-pane label="帮助文档">
                    <el-container>
                        <el-aside width="200px">
                            <ReportMenu v-on:childTell="parentListen"></ReportMenu>
                        </el-aside>
                        <el-main :style="`height:${height}`">
                            <ReportDetail :itemIndex="itemIndex"></ReportDetail>
                        </el-main>
                    </el-container>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Nav from "@/components/Nav.vue";
import ReportMenu from "@/components/ReportMenu.vue";
import ReportDetail from "@/components/ReportDetail.vue";
export default {
    components: { Header, Nav, ReportMenu, ReportDetail },
    data() {
        return {
            itemIndex: "1-1",
            src: "http://192.168.23.31:9999/ureport/designer",
            height: document.documentElement.clientHeight - 175 + "px"
        };
    },
    created() {},
    mounted: function() {
        window.onresize = () => {
            this.height = document.documentElement.clientHeight - 175 + "px";
        };
    },
    destroyed() {
        window.onresize = null;
    },
    methods: {
        parentListen:function(data){
            this.itemIndex = data;
        }
    }
};
</script>

<style lang="scss" scoped></style>
