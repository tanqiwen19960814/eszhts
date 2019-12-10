import Vue from "vue";
import ElementUI from "element-ui";
import App from "./App.vue";
import router from "@/router";
import store from "@/store";
import "./assets/icons";
import ajax from "@/utils/ajax";
import api from "@/api";
import "@/utils/event-bus.js";
// 页面初始化时加载时需要执行的方法
import boostrap from "@/utils/boostrap";
//使用animate.css动态库
import "animate.css";
import VueAwesomeSwiper from "vue-awesome-swiper";
// require styles
import "swiper/dist/css/swiper.css";
Vue.use(VueAwesomeSwiper);
Vue.use(ElementUI);
Vue.config.productionTip = false;

Vue.prototype.$http = ajax;
Vue.prototype.$api = api;

const vm = new Vue({
  store,
  router,
  render: h => h(App),
  mounted() {
    boostrap();
  }
}).$mount("#app");
