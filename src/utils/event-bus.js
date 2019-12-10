import Vue from "vue";
const Bus = new Vue();
Vue.use(Bus);
Vue.prototype.$bus = Bus;

