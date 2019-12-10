import Vue from "vue";
import {
  SOCKET_ONOPEN,
  SOCKET_ONCLOSE,
  SOCKET_ONERROR,
  SOCKET_ONMESSAGE,
  SOCKET_RECONNECT,
  SOCKET_RECONNECT_ERROR,
  TSJC,
  WJID,
  AJSN
} from "../mutation-type";

export default {
  state: {
    isConnected: false,
    message: null,
    reconnectError: false,
    tsjc: "-1",
    wjId: null,
    ajSn: null
  },
  getters: {
    isConnected: state => state.isConnected,
    message: state => state.message,
    reconnectError: state => state.reconnectError,
    tsjc: state => state.tsjc,
    storeWjId: state => state.wjId,
    storeAjSn: state => state.ajSn
  },
  mutations: {
    [SOCKET_ONOPEN](state, event) {
      console.log("ws open");
      state.isConnected = true;
    },
    [SOCKET_ONCLOSE](state, event) {
      console.log("ws close");
      state.isConnected = false;
    },
    [SOCKET_ONERROR](state, event) {
      console.log("ws error");
      console.error(state, event);
    },
    [SOCKET_ONMESSAGE](state, message) {
      console.log(message);
      state.message = message;
    },
    [SOCKET_RECONNECT](state, count) {
      console.info(state, "reconnect:" + count);
    },
    [SOCKET_RECONNECT_ERROR](state) {
      console.info("reconnect fail");
      state.reconnectError = true;
    },
    [TSJC](state, message) {
      console.info("change tsjc:" + message);
      state.tsjc = message;
    },
    [WJID](state, message) {
      console.info("change wjId:" + message);
      state.wjId = message;
    },
    [AJSN](state, message) {
      console.info("change ajSn:" + message);
      state.ajSn = message;
    }
  },
  actions: {
    changeTsjc({ commit }, payload) {
      commit(TSJC, payload);
    },
    changeWjId({ commit }, payload) {
      commit(WJID, payload);
    },
    changeAjSn({ commit }, payload) {
      commit(AJSN, payload);
    },
    sendCommand(context, message) {
      Vue.prototype.$socket.sendObj(message);
    }
  }
};
