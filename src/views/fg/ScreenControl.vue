<template>
  <div class="control_draw">
    <el-drawer class="tp_draw"
               :append-to-body="false"
               :visible="visible"
               :direction="direction">
      <ul class="top">
        <li>
          <el-checkbox v-model="radio1"
                       @change="handleOutRadio">
            <div v-show="!radio1"
                 class="img_bg">
            </div>
            <div v-show="radio1"
                 class="img_bg1">
            </div>
            左电视
          </el-checkbox>
        </li>
        <li class="ts_img">
          <div class="img_bg"></div>
        </li>
        <li>
          <el-checkbox v-model="radio2"
                       @change="handleOutRadio">
            <div v-show="!radio2"
                 class="img_bg">
            </div>
            <div v-show="radio2"
                 class="img_bg1">
            </div>
            右电视
          </el-checkbox>
        </li>
      </ul>
      <el-drawer class="bt_draw"
                 :append-to-body="true"
                 :modal="false"
                 :direction="direction"
                 :visible.sync="innerDrawer">
        <ul class="bottom">
          <li>
            <el-radio v-model="radio"
                      @change="handleInnerRadio"
                      label="1">
              <div class="img_bg">
              </div>
              智慧庭审法官端
            </el-radio>
          </li>
          <li>
            <el-radio v-model="radio"
                      @change="handleInnerRadio"
                      label="2">
              <div class="img_bg">
              </div>
              庭审现场合成画面
            </el-radio>
          </li>
          <li>
            <el-radio v-model="radio"
                      @change="handleInnerRadio"
                      label="3">
              <svg-icon icon-class="szds"
                        class-name="szds"></svg-icon>
              书记员/示证展台
            </el-radio>
          </li>
        </ul>
      </el-drawer>
    </el-drawer>
  </div>

</template>

<script>
export default {
  name: "ScreenControl",
  data() {
    return {
      innerDrawer: false,
      direction: "ttb",
      radio: "",
      radio1: false,
      radio2: false,
      checkBoxVal: "",
      timer: ""
    };
  },
  props: {
    visible: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  watch: {
    visible() {
      if (!this.visible) {
        this.innerDrawer = false;
        this.radio = ""; //初始化
        this.radio1 = false;
        this.radio2 = false;
      }
    }
  },
  methods: {
    handleOutRadio() {
      if (this.radio1 & this.radio2) {
        this.checkBoxVal = "1,2";
        this.innerDrawer = true;
      } else if (!this.radio1 & this.radio2) {
        this.checkBoxVal = "2";
        this.innerDrawer = true;
      } else if (this.radio1 & !this.radio2) {
        this.checkBoxVal = "1";
        this.innerDrawer = true;
      } else {
        this.innerDrawer = false;
        this.checkBoxVal = "";
      }
    },
    handleInnerRadio() {
      const courtNo = sessionStorage.KEY_COURT_NO;
      const spt = sessionStorage.KEY_SPT;
      const url =
        this.$api.tpkz +
        "?courtNo=" +
        `${courtNo}` +
        "&" +
        "spt=" +
        `${spt}` +
        "&" +
        "input=" +
        `${this.radio}` +
        "&" +
        "output=" +
        `${this.checkBoxVal}`;
      this.$http.post(
        url,
        {
          courtNo,
          input: this.radio,
          output: this.checkBoxVal,
          spt
        },
        res => {
          if (res.success) {
            this.timer = setTimeout(() => {
              this.timer && clearTimeout(this.timer);
              this.innerDrawer = false;
              this.$emit("fgDrawClose");
              this.radio = ""; //初始化
              this.radio1 = false;
              this.radio2 = false;
            }, 1000);
          } else {
            this.$message.error(res.errmsg);
          }
        }
      );
    }
  }
};
</script>

<style lang='scss' scoped>
.control_draw ::v-deep {
  .tp_draw {
    width: calc(100% - 150px);
    height: 521px;
    border: 1px solid #334c6d;
    top: 108px;
    left: 120px;
    .el-drawer {
      height: 100% !important;
      background-color: #132231ed;
      box-shadow: unset;
      .el-drawer__header {
        display: none;
      }
      .el-drawer__body {
        display: flex;
        flex-wrap: nowrap;
        .top {
          height: 100%;
          width: 100%;
          display: flex;
          box-sizing: border-box;
          flex-wrap: nowrap;
          padding: 30px;
          li {
            width: 456px;
            .el-checkbox {
              width: 100%;
              height: 100%;
              position: relative;
              &:after {
                content: "";
                display: block;
                position: absolute;
                top: 142px;
                right: 38px;
                width: 4px;
                height: 65px;
                background-color: #ff1919;
                -webkit-transform: rotate(45deg);
                transform: rotate(45deg);
                z-index: 2000;
              }
              &:before {
                content: "";
                display: block;
                position: absolute;
                top: 149px;
                right: -102px;
                width: 26.5%;
                height: 4px;
                background-color: #ff1919;
                z-index: 2000;
              }
              .el-checkbox__input {
                width: 100%;
                height: 100%;
                .el-checkbox__inner {
                  width: inherit;
                  height: inherit;
                  border: unset;
                  background-color: inherit;
                  &::after {
                    display: none;
                  }
                }
              }
              .el-checkbox__input.is-checked .el-checkbox__inner {
                background-color: #1c5b95;
              }
              .el-checkbox__label {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;
                width: 350px;
                height: 350px;
                z-index: 1000;
                text-align: center;
                font-size: 1.625rem;
                color: white;
                .img_bg {
                  background: url("~@/assets/images/wxds.png") center no-repeat;
                  background-size: cover;
                  width: 320px;
                  height: 207px;
                  display: block;
                  margin: 40px auto;
                }
                .img_bg1 {
                  background: url("~@/assets/images/xzds.png") center no-repeat;
                  background-size: cover;
                  width: 320px;
                  height: 207px;
                  display: block;
                  margin: 40px auto;
                }
              }
            }
            &:last-of-type {
              .el-checkbox {
                &:after {
                  content: "";
                  display: block;
                  position: absolute;
                  top: 139px;
                  left: 43px;
                  width: 4px;
                  height: 78px;
                  background-color: #ff1919;
                  transform: rotate(-45deg);
                  z-index: 2000;
                }
                &:before {
                  content: "";
                  display: block;
                  position: absolute;
                  top: 149px;
                  left: -102px;
                  width: 26.5%;
                  height: 4px;
                  background-color: #ff1919;
                  z-index: 2000;
                }
              }
            }
          }
          .ts_img {
            flex-grow: 1;
            position: relative;
            display: inline-block;
            background-color: #091a27;
            padding: 30px;
            .img_bg {
              background: url("~@/assets/images/xgt.jpg") center no-repeat;
              background-size: cover;
              height: 100%;
              width: 100%;
            }
            &::before {
              content: "";
              display: block;
              position: absolute;
              top: 138px;
              left: 90px;
              width: 25px;
              height: 25px;
              background: radial-gradient(
                at center,
                #ff2222 30%,
                rgba(158, 4, 4, 0.5) 100%
              );
              border-radius: 50%;
              z-index: 2001;
            }
            &::after {
              content: "";
              display: block;
              position: absolute;
              top: 138px;
              right: 90px;
              width: 25px;
              height: 25px;
              background: radial-gradient(
                at center,
                #ff2222 30%,
                rgba(158, 4, 4, 0.5) 100%
              );
              border-radius: 50%;
              z-index: 2001;
            }
          }
        }
      }
    }
  }

  .v-modal {
    position: fixed;
    left: 120px;
    top: 107px;
    width: 94%;
    height: 87%;
    opacity: 0.5;
    background: #000;
  }
}
.bt_draw::v-deep {
  width: calc(100% - 150px);
  height: calc(100% - 657px);
  border: 1px solid #334c6d;
  top: 627px;
  left: 120px;
  .el-drawer {
    height: 100% !important;
    background-color: #132231;
    box-shadow: unset;
    .el-drawer__header {
      display: none;
    }
    .el-drawer__body {
      display: flex;
      flex-wrap: nowrap;
      .bottom {
        height: 100%;
        width: 100%;
        display: flex;
        box-sizing: border-box;
        flex-wrap: nowrap;
        li {
          width: 33.333%;
          border: 1px solid rgba(79, 110, 157, 1);
          .el-radio {
            width: 100%;
            height: 100%;
            position: relative;
            border-radius: 0;
            .el-radio__input {
              width: 100%;
              height: 100%;
              border-radius: 0;
              .el-radio__inner {
                width: inherit;
                height: inherit;
                border: unset;
                background-color: inherit;
                border-radius: 0;
                &::after {
                  display: none;
                }
              }
            }
            .el-radio__input.is-checked .el-radio__inner {
              background-color: #1c5b95;
            }
            .el-radio__label {
              position: absolute;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
              margin: auto;
              width: 580px;
              height: 350px;
              z-index: 1000;
              text-align: center;
              font-size: 1.625rem;
              color: white;
              .img_bg {
                background-size: cover;
                width: 543px;
                height: 255px;
                margin: 30px auto;
              }
              .svg-icon {
                width: 575px;
                height: 271px;
                display: block;
                margin: auto;
                padding-bottom: 30px;
              }
            }
          }
          &:first-child {
            .img_bg {
              background: url("~@/assets/images/fgds.png") center no-repeat;
            }
          }
          &:nth-child(2) {
            .img_bg {
              background: url("~@/assets/images/hchm.png") center no-repeat;
            }
          }
        }
      }
    }
  }
}
</style>
