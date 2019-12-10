import Vue from "vue";
import Vuex from "vuex";
import app from "./modules/app";
import zhts from "./modules/zhts";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isTstg: true,
    scrollTop: 0
  },
  getters: {},
  mutations: {
    changeBar(state, id) {
      if (id == "tstg") {
        state.isTstg = true;
      } else {
        state.isTstg = false;
      }
    },
    rewriteTop(state, top) {
      state.scrollTop = top;
    }
  },
  actions: {},
  modules: {
    app,
    zhts
  }
});
