<template>
  <el-container class="base_layouts">
    <el-header class="zhts_header">
      <div class="logo">
        <svg-icon icon-class="fahui"
                  class-name="logo_icon"></svg-icon>
        <span class="appname">智慧庭审</span>
        <span v-if="role==='1'&&bigSrceen"
              class="subtitle">实现无纸化、智能化、网络化、阳光化庭审</span>
      </div>
      <ul class="menu_ul">
        <li v-for="m in menus"
            :key="m.path"
            :index="m.path">
          <el-link v-if="m.disabled"
                   class="router_link"
                   disabled>{{m.label}}</el-link>
          <router-link v-else
                       :to="m.path"
                       class="router_link"
                       disabled
                       replace>{{m.label}}</router-link>
        </li>
      </ul>
      <div class="header_right">
        <span class="spend">
          <font color="#C0DCFF">本次庭审用时：</font>{{spend}}
        </span>
        <span class="dateTime">
          <p class="date">{{dateTime.date}}</p>
          <span class="hour">{{dateTime.hour}}</span>
          <span class="colon">:</span>
          <span class="minute">{{dateTime.minute}}</span>
        </span>
      </div>
    </el-header>
    <el-main class="zhts_main">
      <div class="main_bar">
        <div class="bar_btn_list">
          <div v-for="btn in barBtns"
               :key="btn.id"
               :class="{'bar_btn':true,'actived':activedBarBtn == btn.id}"
               @click="handleBarBtnClick(btn.id)">
            <div class="btn_icon">
              <svg-icon :icon-class="btn.icon"
                        class-name="btn_svg_icon"></svg-icon>
            </div>
            <p class="btn_label">{{btn.label}}</p>
          </div>
        </div>
        <div class="shortcut_list">
          <!-- <transition mode="out-in"
                      enter-active-class="animated rotateInDownLeft faster"
                      leave-active-class="animated rotateOutDownLeft faster">
            <div v-if="shortcutVisiable"
                 style="width:120px;height:120px;background:transparent;position:absolute;bottom:0;display:flex;">
              <div style="flex:1;">

              </div>
              <div style="flex:1;display:flex;align-items:flex-start">
                <el-tooltip content="返回"
                            placement="right">
                  <el-button type="success"
                             icon="el-icon-back"
                             @click="handleBack"
                             circle></el-button>
                </el-tooltip>
              </div>
              <div style="flex:1;display:flex;align-items:flex-end">
                <el-tooltip content="退出"
                            placement="right">
                  <el-button type="danger"
                             icon="el-icon-close"
                             @click="handleClose"
                             circle></el-button>
                </el-tooltip>
              </div>
            </div>
          </transition>
          <div style="z-index:200;">
            <el-button type="primary"
                       icon="el-icon-plus"
                       @click="handleShortCut"
                       circle></el-button>
          </div> -->
          <el-popover placement="top-start"
                      width="120"
                      style="background:rgba(0,0,0,0.7)"
                      popper-class="shortcut_popover"
                      :visible-arrow="false"
                      trigger="click">
            <ul>
              <li>
                <div style="display:flex;cursor:pointer;align-items:center;padding:15px 10px"
                     @click="handleBack">
                  <svg-icon slot="reference"
                            icon-class="back"
                            style="width:1.5rem;height:1.5rem;cursor:pointer"></svg-icon><span style="margin-left:10px">返回</span>
                </div>
                <div style="display:flex;cursor:pointer;align-items:center;padding:15px 10px"
                     @click="handleClose">
                  <svg-icon slot="reference"
                            icon-class="exit"
                            style="width:1.5rem;height:1.5rem;cursor:pointer"></svg-icon>
                  <span style="margin-left:10px">退出</span>
                </div>
              </li>
              <li></li>
            </ul>
            <svg-icon slot="reference"
                      icon-class="list"
                      style="width:1.6rem;height:1.6rem;cursor:pointer"></svg-icon>
          </el-popover>
        </div>
      </div>
      <div class="main_content">
        <router-view />
      </div>
      <screen-control :visible="drawVisible"
                      @fgDrawClose="fgDrawClose" />
      <el-drawer class="dsr_draw"
                 :visible.sync="dsrBarDispose.drawVisible"
                 :direction="'ltr'"
                 :modal="false"
                 :show-close="false"
                 :before-close="handleDsrDrawClose"
                 @opened="scrollTsjl">
        <div class="left_panel">
          <bl v-if="isTstg"></bl>
          <jl ref="tsjl"
              v-if="!isTstg"></jl>
        </div>
      </el-drawer>
    </el-main>
    <el-footer class="zhts_footer">
      <p></p>
      <p>{{userinfo}}</p>
      <p>
        <font color="red">Eastsoft</font> 东软载波科技股份有限公司 版权所有
      </p>
    </el-footer>
  </el-container>
</template>
<script>
import Vue from "vue";
import moment from "moment";
import store from "@/store";
import {
  SOCKET_ONOPEN,
  SOCKET_ONCLOSE,
  SOCKET_ONERROR,
  SOCKET_ONMESSAGE,
  SOCKET_RECONNECT,
  SOCKET_RECONNECT_ERROR
} from "@/store/mutation-type";
import VueNativeSock from "vue-native-websocket";
import WsCommand from "@/utils/Command";
import ScreenControl from "@/views/fg/ScreenControl";
import { mapGetters, mapState, mapActions } from "vuex";
import Bl from "@/views/common/Bl";
import Jl from "@/views/common/Jl";
import "@/utils/moment-zh-cn";
moment().locale("zh-cn");
const barBtns = [
  {
    id: "tstg",
    label: "庭审提纲",
    icon: "tstg"
  },
  {
    id: "tsjl",
    label: "庭审记录",
    icon: "tsjl"
  },
  {
    id: "tpkz",
    label: "投屏控制",
    icon: "tpkz"
  },
  {
    id: "yyjl",
    label: "语音记录",
    icon: "yyjl"
  }
];
const courtNo = sessionStorage.getItem("KEY_COURT_NO");
const userid = sessionStorage.getItem("KEY_USER_ID");
const roleid = sessionStorage.getItem("KEY_ROLE");
const sn = sessionStorage.getItem("KEY_CASE_SN");
const xh = sessionStorage.getItem("KEY_XH");
const wsUrl = `${process.env.VUE_APP_WS_SERVER}${courtNo}/${sn}/${xh}/${userid}/${roleid}`;

Vue.use(VueNativeSock, wsUrl, {
  format: "json",
  connectManually: true,
  reconnection: true, // (Boolean) whether to reconnect automatically (false)
  reconnectionAttempts: 9999999, // (Number) number of reconnection attempts before giving up (Infinity),
  reconnectionDelay: 3000, // (Number) how long to initially wait before attempting a new (1000),
  store,
  mutations: {
    SOCKET_ONOPEN,
    SOCKET_ONCLOSE,
    SOCKET_ONERROR,
    SOCKET_ONMESSAGE,
    SOCKET_RECONNECT,
    SOCKET_RECONNECT_ERROR
  }
});
export default {
  data() {
    return {
      courtNo,
      caseSn: sn,
      role: roleid,
      spend: "00小时00分",
      userinfo: null,
      numTimer: null,
      dateTime: {
        date: null,
        hour: null,
        minute: null
      },
      barBtns,
      drawVisible: false,
      dsrBarDispose: {
        drawVisible: false
      },
      activedBarBtn: "tstg",
      heartCheckTimer: null,
      shortcutVisiable: false
    };
  },
  components: {
    ScreenControl,
    Bl,
    Jl
  },
  computed: {
    ...mapState({
      isTstg: "isTstg"
    }),
    ...mapGetters(["tsjc", "isConnected", "message"]),
    bigSrceen() {
      return document.body.clientWidth > 2000;
    },
    fgMenu() {
      return [
        {
          path: "/fg/ajgk",
          label: "案件概况",
          disabled: false
        },
        {
          path: "/fg/zhyj",
          label: "智慧阅卷",
          disabled: false
        },
        {
          path: "/fg/dzzz",
          label: "电子质证",
          disabled: this.tsjc == "1"
        },
        {
          path: "/fg/zyjd",
          label: "争议焦点",
          disabled: this.tsjc == null || this.tsjc == "0"
        },
        {
          path: "/fg/dzqm",
          label: "电子签名",
          disabled: this.tsjc == null || this.tsjc == "0" || this.tsjc == "1"
        }
      ];
    },
    dsrMenu() {
      return [
        {
          path: "/dsr/ajgk",
          label: "案件概况",
          disabled: this.tsjc == "0" || this.tsjc == "1"
        },
        {
          path: "/dsr/dzzz",
          label: "电子质证",
          disabled: this.tsjc == "1"
        },
        {
          path: "/dsr/zyjd",
          label: "争议焦点",
          disabled: this.tsjc == null || this.tsjc == "0"
        },
        {
          path: "/dsr/dzqm",
          label: "电子签名",
          disabled: this.tsjc == null || this.tsjc == "0" || this.tsjc == "1"
        }
      ];
    },
    menus() {
      if (!this.role) {
        return [];
      }
      return this.role === "1" ? this.fgMenu : this.dsrMenu;
    },
    activeMenu() {
      return this.menus.length > 0 ? this.menus[0].path : "";
    }
  },
  watch: {
    $route() {
      if (this.$route.path == "/fg/dzzz" || this.$route.path == "/fg/zyjd") {
        this.activedBarBtn = "";
        this.$store.commit("changeBar", "tstg");
      } else if (
        (this.role == 1 && this.activedBarBtn == "") ||
        this.$route.path == "/dsr/dzqm"
      ) {
        this.handleBarBtnClick("tstg");
      } else if (this.role == 2 && this.$route.path != "/dsr/dzqm") {
        this.activedBarBtn = "";
      } else if (
        this.role == 1 &&
        this.$route.path != "/fg/dzzz" &&
        this.$route.path != "/fg/zyjd"
      ) {
        this.dsrBarDispose.drawVisible = false;
      }
    },
    isConnected(value) {
      if (value) {
        this.noticeLogin();
        // websocket连接成功后，心跳检测每30s一次
        const params = [{ key: "a", value: "a" }];
        const heartCheckCmd = new WsCommand("WS_HEARTBEAT", roleid, "", params);
        this.heartCheckTimer = setInterval(_ => {
          try {
            this.sendCommand(heartCheckCmd);
          } catch (error) {
            if (this.heartCheckTimer) {
              clearInterval(this.heartCheckTimer);
            }
          }
        }, 1000 * 30);
      } else {
        if (this.heartCheckTimer) {
          clearInterval(this.heartCheckTimer);
        }
      }
    },
    message(value) {
      console.log(value);
    }
  },
  methods: {
    ...mapActions(["changeTsjc", "changeWjId", "changeAjSn", "sendCommand"]),
    handleBarBtnClick(id) {
      if (id == "tpkz" || id == "yyjl") {
        if (id == "tpkz") {
          this.drawVisible = !this.drawVisible;
        } else {
          //语音记录
        }
      } else {
        if (
          (this.role != "1" && this.$route.path != "/dsr/dzqm") ||
          this.$route.path == "/fg/dzzz" ||
          this.$route.path == "/fg/zyjd"
        ) {
          if (this.activedBarBtn == id) {
            this.activedBarBtn = "";
            this.dsrBarDispose.drawVisible = false;
          } else {
            this.activedBarBtn = id;
            this.dsrBarDispose.drawVisible = true;
          }
        } else {
          this.activedBarBtn = id;
        }
        this.$store.commit("changeBar", id);
        if (this.role != "1" && this.$route.path == "/dsr/dzqm") {
          this.$store.commit("changeBar", "tsjl");
          this.activedBarBtn = "tsjl";
        }
      }
    },
    fgDrawClose() {
      this.drawVisible = false;
    },
    handleDsrDrawClose() {
      this.activedBarBtn = "";
      this.dsrBarDispose.drawVisible = false;
      this.$store.commit("changeBar", "tstg");
    },
    countTime() {
      const url = this.$api.pq;
      const sn = sessionStorage.KEY_CASE_SN;
      const xh = sessionStorage.KEY_XH;
      this.$http.get(url, { sn, xh }, res => {
        if (res) {
          let duration = moment.duration(moment() - moment(res));
          let hour = duration.hours();
          let minute = duration.minutes();
          hour = hour < 10 ? "0" + hour : hour;
          minute = minute < 10 ? "0" + minute : minute;
          this.spend = hour + "小时" + minute + "分";
        }
      });
    },
    getNow() {
      const url = this.$api.now;
      this.$http.get(url, null, res => {
        let month = moment(res).format("l");
        let hour = moment(res).hour();
        let minute = moment(res).minute();
        let week = moment.weekdays(moment(res).day());
        this.dateTime.date = `${month} ${week}`;
        this.dateTime.hour = hour < 10 ? "0" + hour : hour;
        this.dateTime.minute = minute < 10 ? "0" + minute : minute;
      });
    },
    initUserinfo() {
      if (this.role != "1") {
        this.activedBarBtn = "";
        this.barBtns = this.barBtns.filter(item => {
          return item.id == "tsjl";
        });
      }
      this.userinfo = `${sessionStorage.KEY_COURT_NAME}  ${sessionStorage.KEY_USER_NAME}`;
    },
    loadTsjc() {
      const url = this.$api.tsjc;
      this.$http.get(url, { sn, xh }, result => {
        let jc = null;
        if (result && result.jc) {
          jc = result.jc;
          this.changeWjId(result.wjId);
          this.changeAjSn(result.ajSn);
          this.changeTsjc(jc);
        } else {
          // 刚刚开庭，重置投屏控制
          this.resetTpkz();
          this.changeTsjc(null);
        }
        this.redirectByTsjc(jc);
      });
    },
    redirectByTsjc(tsjc) {
      const pre = this.role == "1" ? "/fg" : "/dsr";
      if (tsjc == "0") {
        this.$router.replace(pre + "/dzzz");
        this.$message.success("本次庭审进行到电子质证阶段");
      } else if (tsjc == "1") {
        this.$router.replace(pre + "/zyjd");
        this.$message.success("本次庭审进行到争议焦点阶段");
      } else {
        this.$router.replace(pre + "/ajgk");
      }
    },
    //左下角按钮功能
    handleBack() {
      if (Boolean(sessionStorage.KEY_PQ_ONLY) && this.role == 1) {
        this.$router.replace("/fgpq");
      } else if (Boolean(sessionStorage.KEY_PQ_ONLY) && this.role != 1) {
        this.$router.replace("/dsrpq");
      } else {
        this.$message.warning("暂无其他排期，您可以退出系统！");
      }
    },
    handleClose() {
      if (this.role == "1") {
        this.$router.replace(
          "/fglogin?role=" +
            sessionStorage.KEY_ROLE +
            "&courtNo=" +
            sessionStorage.KEY_COURT_NO +
            "&spt=" +
            sessionStorage.KEY_SPT
        );
      } else {
        this.$router.replace(
          "/dsrlogin?role=" +
            sessionStorage.KEY_ROLE +
            "&courtNo=" +
            sessionStorage.KEY_COURT_NO +
            "&spt=" +
            sessionStorage.KEY_SPT
        );
      }
    },
    handleShortCut(visiable) {
      this.shortcutVisiable = !this.shortcutVisiable;
    },
    resetTpkz() {
      const url =
        this.$api.tpkzReset +
        "?courtNo=" +
        this.courtNo +
        "&spt=" +
        sessionStorage.KEY_SPT;
      this.$http.post(url);
    },
    //发送websocket请求通知登录
    noticeLogin() {
      const params = [{ key: "a", value: "a" }];
      const noticeLoginCmd = new WsCommand(
        "WS_USERLOGIN",
        sessionStorage.KEY_ROLE,
        "",
        params
      );
      this.sendCommand(noticeLoginCmd);
    },
    scrollTsjl() {
      const tsjl = this.$refs.tsjl;
      if (tsjl) {
        tsjl.doScroll();
      }
    }
  },
  created() {
    this.countTime();
    this.getNow();
    this.$store.commit("changeBar", "tstg");
  },
  mounted() {
    this.initUserinfo();
    this.numTimer = setInterval(() => {
      this.countTime();
      this.getNow();
    }, 30000);
    // 进入庭审页面，连接websocket
    this.$connect();
    //请求本次庭审进程
    this.loadTsjc();
  },
  beforeDestroy() {
    // 主动断开websocket
    this.$disconnect();
    this.numTimer && clearInterval(this.numTimer);
    this.heartCheckTimer && clearInterval(this.heartCheckTimer);
  },
  destroyed() {
    this.changeTsjc("-1");
    this.changeWjId(null);
    this.changeAjSn(null);
  }
};
</script>
<style scoped>
.base_layouts {
  width: 100%;
  height: 100%;
  min-width: 1920px;
  min-height: 900px;
  overflow: auto;
  background: linear-gradient(
    90deg,
    rgba(24, 38, 56, 1) 0%,
    rgba(47, 67, 97, 1) 100%
  );
  color: #fff;
}
.zhts_header {
  height: 88px !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  border-bottom: 1px solid #10192c;
}
.zhts_footer {
  height: 30px !important;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.zhts_footer p:last-child {
  padding-right: 10px;
}
.appname {
  font-size: 2.75rem;
  font-family: JZhongYi;
  letter-spacing: 2px;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
  margin: 0 10px;
}
.logo {
  display: flex;
  align-items: flex-end;
}
.logo_icon {
  width: 53px;
  height: 60px;
}
.subtitle {
  font-family: "HYWBJ";
  font-size: 1.5rem;
  color: #ffc53d;
}
.header_right {
  display: flex;
  align-items: center;
}
.spend {
  font-size: 1.5rem;
  padding: 8px 20px;
  border-right: 1px solid #fff;
}
.dateTime {
  display: inline-block;
  width: 180px;
  text-align: center;
}
.dateTime .date {
  font-size: 1.125rem;
  color: #c0dcff;
  padding: 3px 0;
}
.dateTime .colon {
  display: inline-block;
  width: 20px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 1.7rem;
}
.dateTime .hour,
.dateTime .minute {
  display: inline-block;
  width: 44px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background: #132231;
  border-radius: 6px;
  border: 1px solid rgba(60, 84, 121, 1);
  font-size: 1.7rem;
}
.zhts_main {
  box-sizing: border-box;
  border-top: 1px solid #334c6d;
  display: flex;
  overflow: hidden;
}
.zhts_main .main_bar {
  width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  overflow: visiable;
}
.zhts_main .main_content {
  flex: 1;
}
.bar_btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  cursor: pointer;
  box-sizing: border-box;
}
.bar_btn .btn_icon {
  width: 60px;
  height: 60px;
  background: rgba(8, 51, 105, 1);
  border-radius: 4px;
  border: 1px solid rgba(34, 165, 247, 1);
  display: flex;
  justify-content: center;
  align-items: center;
}
.bar_btn .btn_label {
  font-size: 1.125rem;
  padding: 4px 0;
  color: #c0dcff;
  transition: all 0.2s;
}
.btn_svg_icon {
  width: 40px;
  height: 40px;
  fill: #22a5f7;
  transition: all 0.2s;
}
.bar_btn.actived .btn_icon {
  background: #22a5f7;
}
.bar_btn.actived .btn_icon .btn_svg_icon {
  fill: #fff;
}
.bar_btn.actived .btn_label {
  color: #fff;
}
.bar_btn_list,
.shortcut_list {
  display: flex;
  flex-direction: column;
}
.menu_ul,
.menu_ul li {
  list-style: none;
  float: left;
  height: 100%;
}
.router_link {
  text-decoration: none;
  display: block;
  height: 100%;
  font-size: 1.5rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  padding: 0 10px;
  color: #c0dcff;
}
.shortcut_list {
  overflow: visible;
  z-index: 100;
  position: relative;
}
</style>
<style>
.zhts_menu.el-menu.el-menu--horizontal {
  border-bottom: none;
}
.zhts_menu.el-menu.el-menu--horizontal > .el-menu-item {
  height: 88px;
  line-height: 88px;
  font-size: 1.5rem;
  background: none !important;
}
.zhts_menu.el-menu--horizontal > .el-menu-item-menu-item {
  box-sizing: border-box;
  border-bottom: 2px solid transparent;
}
.zhts_menu.el-menu--horizontal > .el-menu-item.is-active {
  box-sizing: border-box;
  border-bottom: 2px solid #00afff !important;
}
.el-main.zhts_main {
  padding: 0;
}
.router-link-active.router_link {
  color: #fff;
  border-bottom: 2px solid #00afff;
  font-weight: 600;
}
.el-popover.shortcut_popover {
  font-size: 1.2rem;
  background: rgba(0, 0, 0, 1);
  box-shadow: 5px 4px 10px 0 rgb(0, 0, 0);
  border: 1px solid #1f2c40;
  color: #ffffff;
}
</style>
<style lang="scss" scoped>
@import "~@/assets/css/scss/common.scss";
.dsr_draw::v-deep {
  position: fixed;
  height: 960px;
  width: 93%;
  top: 90px;
  right: 0;
  bottom: 0;
  left: 120px;
  overflow: auto;
  z-index: 300;
  background-color: rgba(0, 0, 0, 0.5);
  margin: 0;
  .el-drawer {
    width: 40% !important;
    .el-drawer__header {
      display: none;
    }
    .el-drawer__body {
      height: 100%;
      .left_panel {
        @include left_panel;
        padding: 10px;
        background: linear-gradient(
          90deg,
          rgba(24, 38, 56, 1) 0%,
          rgba(47, 67, 97, 1) 100%
        );
      }
    }
  }
  @media (min-width: 1925px) {
    .el-drawer {
      width: 30% !important;
    }
  }
}
@media (min-width: 1952px) {
  .menu_ul {
    li {
      margin: 0 25px;
    }
  }
}
</style>
<style lang="scss">
body {
  .el-message-box {
    .el-message-box__btns {
      > [type="button"] {
        &:first-child {
          background-color: #7b7a7a;
          color: #ffffff;
        }
      }
    }
    .el-message-box__headerbtn {
      font-size: 1.1rem;
    }

    .el-message-box__title {
      font-size: 1.1rem;
    }

    .el-message-box__status {
      font-size: 2rem !important;
    }
    .el-message-box__content {
      font-size: 1.1rem;
    }
    .el-message-box__message {
      margin-left: 10px;
    }
    .el-button--small {
      font-size: 1.1rem;
    }
  }
  .el-message {
    padding-right: 30px;
    .el-message__icon {
      font-size: 1.1rem;
    }
    .el-message__content {
      font-size: 1.1rem;
    }
  }
}
</style>