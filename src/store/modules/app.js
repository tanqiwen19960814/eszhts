import {
  UPDATE_INNERWIDTH,
  UPDATE_INNERHEIGHT,
  UPDATE_SCROLLHEIGHT
} from "../mutation-type";

export default {
  state: {
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    scrollHeight: window.document.body.scrollHeight
  },
  getters: {
    innerHeight: state => state.innerHeight,
    innerWidth: state => state.innerWidth,
    scrollHeight: state => state.scrollHeight
  },
  mutations: {
    [UPDATE_INNERWIDTH](state, payload) {
      state.innerWidth = payload;
    },
    [UPDATE_INNERHEIGHT](state, payload) {
      state.innerHeight = payload;
    },
    [UPDATE_SCROLLHEIGHT](state, payload) {
      state.scrollHeight = payload;
    }
  }
};
