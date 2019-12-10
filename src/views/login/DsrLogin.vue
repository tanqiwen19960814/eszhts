<template>
  <div class="dsr-login">
    <div class="login-box">
      <div class="login-item">
        <el-tabs v-model="activeName"
                 @tab-click="handleTabClick">
          <el-tab-pane label="身份证号码"
                       name="first">
            <el-input v-model="loginObj.logid"
                      placeholder="请输入身份证号"></el-input>
          </el-tab-pane>
          <el-tab-pane label="统一社会信用代码"
                       name="second">
            <el-input v-model="loginObj.logid"
                      placeholder="请输入统一社会信用代码"></el-input>
          </el-tab-pane>
        </el-tabs>
        <el-button type="warning"
                   :loading="load"
                   @click="handleDsrLogin">{{
          loadBtn
        }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import utils from "@/utils/utils";
export default {
  name: "",
  data() {
    return {
      activeName: "first",
      loginObj: {
        dlfs: "1",
        passwd: "1",
        logid: ""
      },
      load: false,
      loadBtn: "登录"
    };
  },
  methods: {
    handleDsrLogin() {
      if (this.loginObj.logid == "") {
        this.$message.error("请输入您的登录信息！");
        return;
      }
      this.load = true;
      this.loadBtn = "登录中";
      sessionStorage.setItem("KEY_USERID", this.loginObj.logid);
      let obj = this.$route.query;
      sessionStorage.setItem("KEY_SPT", obj.spt);
      Object.assign(this.loginObj, obj);
      this.$nextTick(() => {
        this.$http.get(
          this.$api.login,
          this.loginObj,
          res => {
            if (res.success) {
              if (res.data.pqList.length == 0) {
                this.$message("暂无审理案件,无法进入");
              } else if (res.data.pqList.length == 1) {
                sessionStorage.setItem("KEY_CASE_SN", res.data.pqList[0].sn);
                sessionStorage.setItem("KEY_COURT_NO", res.data.courtNo);
                sessionStorage.setItem("KEY_AH", res.data.pqList[0].ah);
                sessionStorage.setItem("KEY_ROLE", this.loginObj.role);
                sessionStorage.setItem("ESZHTS_KEY_TOKEN", res.data.token);
                sessionStorage.setItem("KEY_USER_NAME", res.data.username);
                sessionStorage.setItem("KEY_USER_ID", res.data.userid);
                sessionStorage.setItem("KEY_SSDW", res.data.ssdw);
                sessionStorage.setItem("KEY_COURT_NAME", res.data.courtname);
                sessionStorage.setItem("KEY_XH", res.data.pqList[0].xh);
                sessionStorage.setItem("KEY_PQ_ONLY", "");
                this.fullScreen();
                this.setInfo();
              } else {
                sessionStorage.setItem("KEY_COURT_NO", res.data.courtNo);
                sessionStorage.setItem("ESZHTS_KEY_TOKEN", res.data.token);
                sessionStorage.setItem("KEY_ROLE", this.loginObj.role);
                sessionStorage.setItem("KEY_USER_ID", res.data.userid);
                sessionStorage.setItem("KEY_SSDW", res.data.ssdw);
                sessionStorage.setItem("KEY_USER_NAME", res.data.username);
                sessionStorage.setItem("KEY_COURT_NAME", res.data.courtname);
                sessionStorage.setItem("KEY_PQ_ONLY", "true");
                sessionStorage.setItem(
                  "KEY_PQ_LIST",
                  JSON.stringify(res.data.pqList)
                );
                this.fullScreen();
                this.$router.replace("/dsrpq");
              }
            } else {
              this.$message.error(res.errmsg);
            }
            this.load = false;
            this.loadBtn = "登陆";
          },
          err => {
            this.$message.error("登陆失败" + err);
            this.load = false;
            this.loadBtn = "登陆";
          }
        );
      });
    },
    handleTabClick(tab, event) {
      tab.name == "first"
        ? (this.loginObj.dlfs = "1")
        : (this.loginObj.dlfs = "2");
    },
    setInfo() {
      let url =
        this.$api.ssdwxx +
        "?courtNo=" +
        sessionStorage.KEY_COURT_NO +
        "&pqxh=" +
        sessionStorage.KEY_XH +
        "&sn=" +
        sessionStorage.KEY_CASE_SN +
        "&ssdw=" +
        sessionStorage.KEY_SSDW +
        "&userid=" +
        sessionStorage.KEY_USER_ID;
      this.$http.post(url, null, res => {
        this.$router.replace("/dsr");
      });
    },
    checkFull() {
      let isFullscreen = document.webkitFullscreenElement || false; //谷歌全屏判断
      return isFullscreen;
    },
    fullScreen() {
      let isFullscreen = this.checkFull();
      if (!isFullscreen) {
        var el = document.documentElement;
        el.webkitRequestFullscreen();
      }
    }
  },
  created() {
    let that = this;
    window.onresize = function() {
      if (!that.checkFull()) {
        // 退出全屏后要执行的动作
        document.webkitCancelFullScreen();
      }
    };
  },
  mounted() {
    window.addEventListener(
      "keydown",
      e => {
        if (e.key == "Enter") {
          this.handleDsrLogin();
        }
      },
      false
    );
  },
  beforeDestroy() {
    window.removeEventListener("keydown", e => {});
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/scss/common.scss";
.dsr-login {
  width: 100%;
  height: 100%;
  background: url("~@/assets/images/bg02.jpg") center no-repeat;
  text-align: center;
  .login-box {
    padding-top: 273px;
    @include auto-center;
    .login-item::v-deep {
      width: 623px;
      height: 635px;
      border: 3px solid rgba(255, 198, 62, 0.5);
      box-shadow: 0px 7px 20px 1px rgba(255, 231, 68, 0.5);
      border-radius: 10px;
      background-color: rgba(255, 231, 68, 0.1);
      padding: 30px;
      .el-tabs {
        height: calc(100% - 100px);
        .el-tabs__header {
          .el-tabs__nav-scroll {
            padding-bottom: 17px;
            .el-tabs__nav {
              .el-tabs__active-bar {
                height: 4px;
                bottom: -17px;
                background-color: #ffc62c;
              }
              .el-tabs__item {
                width: 260px;
                height: 35px;
                font-size: 28px;
                font-family: JZhongYi;
                font-weight: 400;
                color: rgba(229, 229, 229, 1);
              }
              .is-active {
                color: rgba(255, 198, 44, 1);
              }
            }
          }
        }
        .el-tabs__content {
          width: 100%;
          height: calc(100% - 67px);
          display: table;
          .el-input {
            margin-top: 152px;
            width: 492px;
            height: 74px;
            background: rgba(255, 163, 44, 0.6);
            border: 1px solid rgba(255, 166, 52, 1);
            border-radius: 3px;
            font-size: 20px;
            color: #ffffff;
            .el-input__inner {
              height: 72px;
              border: 1px solid rgba(255, 166, 52, 1);
              color: #ffffff;
              background-color: rgba(33, 33, 34, 0.8);
            }
            input::-webkit-input-placeholder {
              color: #ffffff;
            }
            input::-moz-input-placeholder {
              color: #ffffff;
            }
            input::-ms-input-placeholder {
              color: #ffffff;
            }
          }
        }
      }
    }
    .el-button {
      width: calc(100% - 50px);
      height: 74px;
      font-size: 29px;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      text-shadow: 0px 3px 7px rgba(14, 9, 5, 0.35);
    }
  }
}
</style>
