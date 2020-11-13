import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import * as filters from "./filters/filters";
import ElementUI from "element-ui";
import md5 from 'js-md5';
import Print from "vue-print-nb";
import "@/assets/fonts/iconfont.css";
import "@/assets/style/common.scss";

Vue.config.productionTip = false;
Vue.prototype.$md5 = md5;
Vue.use(ElementUI);
Vue.use(Print);

// 注册全局过滤器
Object.keys(filters).forEach(k => {
    Vue.filter(k, filters[k]);
    Vue.prototype[k] = filters[k];
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
