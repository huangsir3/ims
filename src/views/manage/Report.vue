<template>
    <div class="">
        <Header></Header>
        <Nav itemActive="9"></Nav>
        <div class="pageContent">
            报表管理
        </div>
    </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Nav from "@/components/Nav.vue";
export default {
    components: { Header, Nav },
    data() {
        return {};
    },
    created() {},
    methods: {}
};
</script>

<style lang="scss" scoped></style>
