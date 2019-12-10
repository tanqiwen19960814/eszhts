<template>
  <div class="fg_login"
       ref="login">
    <div class="login_box">
      <div class="account_login">
        <div class="login_title">
          账号密码登录
        </div>
        <el-form class="input_group"
                 :model="form"
                 ref="form"
                 :rules="rules">
          <el-form-item prop="logid">
            <el-input placeholder="请输入用户名"
                      v-model="form.logid">
              <svg-icon slot="prefix"
                        icon-class="user"
                        class-name="user"></svg-icon>
            </el-input>
          </el-form-item>
          <el-form-item prop="passwd">
            <el-input placeholder="请输入密码"
                      show-password
                      v-model="form.passwd">
              <svg-icon slot="prefix"
                        icon-class="password"
                        class-name="password"></svg-icon>
            </el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary"
                   :disabled="disable"
                   :loading="load"
                   @click="handleFgLogin">{{ loadBtn }}</el-button>
      </div>
      <div class="scan_login">
        <div class="login_title">
          人脸识别登录
        </div>
        <div class="img-box">
          <canvas ref="canvas"
                  width="425"
                  height="425"
                  style="position:absolute;opacity:0;z-index:-1"></canvas>
          <transition mode="out-in"
                      enter-active-class="animated fadeIn faster"
                      leave-active-class="animated fadeOut faster">
            <div v-if="showVideo"
                 style="width:425px;height:425px;border-radius:100%;position:absolute;z-index:100;transform:rotateY(180deg);overflow:hidden;">
              <div class="scan_line"></div>
              <video ref="video"
                     width="425"
                     height="425"
                     style="z-index:-1;position:absolute;left:0">
              </video>
            </div>
          </transition>
          <img src="~@/assets/images/saomiao.png"
               alt=""
               style="cursor:pointer"
               @click="requestCarema" />
        </div>
        <div class="tips">
          请正脸对准屏幕，若识别不成功请使用账号密码登录
        </div>
      </div>
    </div>
    <el-footer class="footer">
      <font color="red">Eastsoft</font> 东软载波科技股份有限公司 版权所有
    </el-footer>
  </div>
</template>

<script>
import utils from "@/utils/utils";
export default {
  name: "",
  data() {
    return {
      form: {
        logid: "",
        passwd: ""
      },
      disable: true,
      rules: {
        logid: [
          {
            required: true,
            message: "用户名不能为空",
            trigger: "blur"
          }
        ],
        passwd: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ]
      },
      load: false,
      loadBtn: "登录",
      showVideo: false
    };
  },
  watch: {
    "form.logid"() {
      if (this.form.passwd != "") {
        this.disable = false;
      }
    },
    "form.passwd"() {
      if (this.form.logid != "") {
        this.disable = false;
      }
    }
  },
  methods: {
    handleFgLogin() {
      this.load = true;
      this.loadBtn = "登录中";
      let obj = this.$route.query;
      sessionStorage.setItem("KEY_SPT", obj.spt);
      Object.assign(this.form, obj, {
        dlfs: "1"
      });
      this.$nextTick(() => {
        this.$http.get(
          this.$api.login,
          this.form,
          res => {
            if (res.success) {
              if (res.data.pqList.length == 0) {
                this.$message("暂无审理案件,无法进入");
              } else if (res.data.pqList.length == 1) {
                sessionStorage.setItem("KEY_CASE_SN", res.data.pqList[0].sn);
                sessionStorage.setItem("KEY_COURT_NO", res.data.courtNo);
                sessionStorage.setItem("KEY_AH", res.data.pqList[0].ah);
                sessionStorage.setItem("KEY_ROLE", "1");
                sessionStorage.setItem("ESZHTS_KEY_TOKEN", res.data.token);
                sessionStorage.setItem("KEY_USER_NAME", res.data.username);
                sessionStorage.setItem("KEY_USER_ID", res.data.userid);
                sessionStorage.setItem("KEY_COURT_NAME", res.data.courtname);
                sessionStorage.setItem("KEY_XH", res.data.pqList[0].xh);
                sessionStorage.setItem("KEY_PQ_ONLY", "");
                this.setInfo();
              } else {
                sessionStorage.setItem("KEY_COURT_NO", res.data.courtNo);
                sessionStorage.setItem("KEY_ROLE", "1");
                sessionStorage.setItem("ESZHTS_KEY_TOKEN", res.data.token);
                sessionStorage.setItem("KEY_USER_NAME", res.data.username);
                sessionStorage.setItem("KEY_USER_ID", res.data.userid);
                sessionStorage.setItem("KEY_COURT_NAME", res.data.courtname);
                sessionStorage.setItem("KEY_PQ_ONLY", "true");
                sessionStorage.setItem(
                  "KEY_PQ_LIST",
                  JSON.stringify(res.data.pqList)
                );
                this.fullScreen();
                this.$router.replace("/fgpq");
              }
            } else {
              this.$message.error(res.errmsg);
            }
            this.load = false;
            this.loadBtn = "登录";
          },
          err => {
            this.$message.error("登陆失败" + err);
            this.load = false;
            this.loadBtn = "登录";
          }
        );
      });
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
        "&ssdw=法官&userid=" +
        sessionStorage.KEY_USER_ID;
      this.$http.post(url, null, res => {
        this.$router.replace("/fg");
        this.fullScreen();
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
        if (el.webkitRequestFullscreen) {
          el.webkitRequestFullscreen();
        }
      } else {
        // if (document.webkitCancelFullScreen) {
        //   document.webkitCancelFullScreen();
        // }
        return;
      }
    },
    getUserMedia(constraints, success, error) {
      //最新的标准API
      if (navigator.mediaDevices.getUserMedia) {
        //最新的标准API
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then(success)
          .catch(error);
      } else if (navigator.webkitGetUserMedia) {
        //webkit核心浏览器
        navigator.webkitGetUserMedia(constraints, success, error);
      } else if (navigator.mozGetUserMedia) {
        //firfox浏览器
        navigator.mozGetUserMedia(constraints, success, error);
      } else if (navigator.getUserMedia) {
        //旧版API
        navigator.getUserMedia(constraints, success, error);
      }
    },
    requestCarema() {
      if (
        navigator.mediaDevices.getUserMedia ||
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia
      ) {
        //调用用户媒体设备, 访问摄像头
        this.getUserMedia(
          {
            video: {
              width: 425,
              height: 425
            }
          },
          this.caremaSuccess,
          this.caremaError
        );
      } else {
        alert("不支持访问用户媒体");
      }
    },
    caremaSuccess(stream) {
      this.showVideo = true;
      let mediaStreamTrack = stream;
      console.log(mediaStreamTrack);
      this.$nextTick(_ => {
        const video = this.$refs.video;
        video.srcObject = stream;
        video.play();
        setTimeout(() => {
          this.loginByUserFace(mediaStreamTrack);
        }, 1000);
      });
    },
    caremaError(error) {
      this.$message.error(
        `访问用户媒体设备失败${error.name}, ${error.message}`
      );
    },
    loginByUserFace(mediaStreamTrack) {
      const canvas = this.$refs.canvas;
      const context = canvas.getContext("2d");
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
      context.drawImage(this.$refs.video, 0, 0, 425, 425);
      const vm = this;
      canvas.toBlob(
        function(blob) {
          let formData = new FormData();
          formData.append("face", blob, "userface.jpg");
          const url = vm.$api.fr.replace("{courtNo}", vm.$route.query.courtNo);
          vm.$http.post(url, formData, result => {
            //console.log(result);
            if (result.data.user.userid) {
              vm.load = true;
              let obj = vm.$route.query;
              sessionStorage.setItem("KEY_SPT", obj.spt);
              let loginForm = new FormData();
              Object.assign(loginForm, obj, {
                logid: result.data.user.logid,
                passwd: result.data.user.logpass,
                dlfs: "2"
              });
              vm.$nextTick(() => {
                vm.$http.get(
                  vm.$api.login,
                  loginForm,
                  res => {
                    if (res.success) {
                      if (res.data.pqList.length == 0) {
                        vm.$message("暂无审理案件,无法进入");
                      } else if (res.data.pqList.length == 1) {
                        sessionStorage.setItem(
                          "KEY_CASE_SN",
                          res.data.pqList[0].sn
                        );
                        sessionStorage.setItem(
                          "KEY_COURT_NO",
                          res.data.courtNo
                        );
                        sessionStorage.setItem("KEY_AH", res.data.pqList[0].ah);
                        sessionStorage.setItem("KEY_ROLE", "1");
                        sessionStorage.setItem(
                          "ESZHTS_KEY_TOKEN",
                          res.data.token
                        );
                        sessionStorage.setItem(
                          "KEY_USER_NAME",
                          res.data.username
                        );
                        sessionStorage.setItem("KEY_USER_ID", res.data.userid);
                        sessionStorage.setItem(
                          "KEY_COURT_NAME",
                          res.data.courtname
                        );
                        sessionStorage.setItem("KEY_XH", res.data.pqList[0].xh);
                        sessionStorage.setItem("KEY_PQ_ONLY", "");
                        mediaStreamTrack
                          .getVideoTracks()
                          .forEach(function(track) {
                            console.log(trank);
                            track.stop();
                          });
                        vm.setInfo();
                      } else {
                        sessionStorage.setItem(
                          "KEY_COURT_NO",
                          res.data.courtNo
                        );
                        sessionStorage.setItem("KEY_ROLE", "1");
                        sessionStorage.setItem(
                          "ESZHTS_KEY_TOKEN",
                          res.data.token
                        );
                        sessionStorage.setItem(
                          "KEY_USER_NAME",
                          res.data.username
                        );
                        sessionStorage.setItem("KEY_USER_ID", res.data.userid);
                        sessionStorage.setItem(
                          "KEY_COURT_NAME",
                          res.data.courtname
                        );
                        sessionStorage.setItem("KEY_PQ_ONLY", "true");
                        sessionStorage.setItem(
                          "KEY_PQ_LIST",
                          JSON.stringify(res.data.pqList)
                        );
                        mediaStreamTrack
                          .getVideoTracks()
                          .forEach(function(track) {
                            track.stop();
                          });
                        vm.fullScreen();
                        vm.$router.replace("/fgpq");
                      }
                    } else {
                      vm.$message.error(res.errmsg);
                    }
                    vm.load = false;
                  },
                  err => {
                    vm.$message.error("登录失败" + err);
                    vm.load = false;
                  }
                );
              });
            } else {
              vm.$message.error(
                "对不起，未在系统中找到您的脸部识别信息，请到审判云平台系统用户管理中上传您的照片以采集您的脸部识别信息！"
              );
              vm.showVideo = false;
            }
          });
        },
        "image/jpeg",
        0.9
      );
    }
  },
  created() {
    let that = this;
    window.onresize = function() {
      console.log(that.checkFull());
      if (!that.checkFull()) {
        // 退出全屏后要执行的动作
        var exitMethod =
          document.exitFullscreen || document.mozCancelFullScreen; //W3C
        exitMethod.call(document);
      }
    };
  },
  mounted() {
    this.$refs["login"].addEventListener(
      "keydown",
      e => {
        if (e.key == "Enter") {
          this.handleFgLogin();
        }
      },
      false
    );
  },
  beforeDestroy() {
    this.$refs["login"].removeEventListener("keydown", e => {});
  }
};
</script>
<style scoped>
.scan_line {
  position: absolute;
  z-index: 2;
  left: 10px;
  height: 5px;
  width: 405px;
  border-radius: 50%;
  background: #00ecff94;
  animation: faceScan 1.5s infinite alternate;
}

@keyframes faceScan {
  from {
    top: 5px;
  }

  to {
    top: 400px;
  }
}
</style>
<style lang="scss" scoped>
@import "~@/assets/css/scss/common.scss";

.fg_login {
  width: 100%;
  background: url("~@/assets/images/bg01.jpg") center no-repeat;
  text-align: center;

  .login_box {
    padding-top: 273px;
    @include auto-center;
    flex-wrap: nowrap;

    .account_login {
      width: 623px;
      height: 685px;
      border: 2px solid rgba(13, 167, 255, 1);
      box-shadow: 0px 7px 20px 1px rgba(0, 105, 212, 1);
      background-color: rgba(26, 51, 77, 0.5);
      border-radius: 10px;
      margin-right: 50px;

      .login_title {
        height: 36px;
        font-size: 39px;
        font-family: JZhongYi;
        font-weight: 400;
        color: rgba(14, 161, 255, 1);
        text-shadow: 0px 4px 3px rgba(8, 8, 8, 0.43);
        margin-top: 46px;
      }

      .input_group::v-deep {
        margin: 0 auto;
        margin-top: 125px;

        .el-form-item {
          ~ .el-form-item {
            margin-top: 50px;
          }

          .el-input__clear {
            font-size: 1.2rem;
          }
        }

        .el-form-item__error {
          font-size: 1.2rem;
          padding-top: 10px;
          left: 10%;
        }

        .el-input,
        .el-input__inner {
          width: 492px;
          height: 74px;
          background: rgb(23, 38, 56);
          border: 1px solid #4ec6ff;
          border-radius: 3px;
          font-size: 20px;
          font-family: PingFang;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);

          .svg-icon {
            width: 23px;
            height: 25px;
            color: rgb(232, 232, 232);
          }

          .el-input__prefix {
            @include auto-center;
            margin-left: 5px;
          }

          input::-webkit-input-placeholder {
            color: #b5b5b5;
          }

          input::-moz-input-placeholder {
            color: #b5b5b5;
          }

          input::-ms-input-placeholder {
            color: #b5b5b5;
          }
        }
      }

      .el-button {
        width: 492px;
        height: 74px;
        background: #157eff;
        border-radius: 3px;
        font-size: 29px;
        font-family: PingFang;
        font-weight: 500;
        margin-top: 100px;
        color: rgba(255, 255, 255, 1);
      }
    }

    .scan_login {
      width: 623px;
      height: 685px;
      margin-left: 50px;
      background: rgb(41, 61, 71, 0.6);
      border: 2px solid rgba(13, 167, 255, 1);
      box-shadow: 0px 7px 20px 1px rgba(0, 151, 146, 1);
      border-radius: 10px;

      .login_title {
        height: 36px;
        font-size: 39px;
        font-family: JZhongYi;
        font-weight: 400;
        color: rgba(37, 228, 255, 1);
        text-shadow: 0px 4px 3px rgba(8, 8, 8, 0.43);
        margin-top: 46px;
      }

      .img-box {
        width: 425px;
        height: 425px;
        margin: 0 auto;
        margin-top: 50px;
        padding: 0;
        position: relative;

        img {
          width: 100%;
          height: auto;
        }
      }

      .tips {
        height: 21px;
        margin-top: 60px;
        font-size: 20px;
        font-family: PingFang;
        font-weight: 400;
        color: rgba(245, 209, 112, 1);
      }
    }
  }

  .footer {
    text-align: center;
    font-size: 16px;
    font-family: PingFang;
    margin-top: 62px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);

    font {
      width: 77px;
      height: 14px;
      font-size: 18px;
      font-family: PingFang;
      font-weight: bold;
      color: rgba(253, 59, 59, 1);
    }
  }
}
</style>
<style>
.fg_login .el-input--prefix .el-input__inner {
  padding-left: 38px;
}
</style>
