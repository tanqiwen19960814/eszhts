<template>
  <div class="screen_control">
    <header class="header">
      请输入投屏控制器串口转网络设备IP地址及端口号：
    </header>
    <main class="control_config">
      <div class="left_img">
        <svg-icon icon-class="shebei"
                  class-name="shebei"></svg-icon>
      </div>
      <div class="right_write">
        <el-form :model="form"
                 :rules="rules"
                 ref="ruleForm">
          <el-form-item label="IP地址:"
                        class="form_input form_item">
            <el-form-item prop="ip.input1">
              <el-input ref="input1"
                        v-model.number="form.ip.input1"></el-input>
            </el-form-item>
            <el-form-item prop="ip.input2">
              <el-input ref="input2"
                        v-model.number="form.ip.input2"></el-input>
            </el-form-item>
            <el-form-item prop="ip.input3">
              <el-input ref="input3"
                        v-model.number="form.ip.input3"></el-input>
            </el-form-item>
            <el-form-item prop="ip.input4">
              <el-input ref="input4"
                        v-model.number="form.ip.input4"></el-input>
            </el-form-item>
          </el-form-item>
          <el-form-item label="端口号:"
                        class="form_item form_input">
            <el-form-item prop="input5"
                          class="special_item">
              <el-input ref="input5"
                        v-model.number="form.input5"></el-input>
            </el-form-item>
          </el-form-item>
          <el-form-item label="左电视默认信号源:"
                        class="form_item form_select">
            <el-form-item>
              <el-select v-model="form.ltSelect"
                         placeholder="请选择信号源">
                <el-option class="select_option"
                           label="智慧庭审法官端"
                           value="1"></el-option>
                <el-option class="select_option"
                           label="庭审现场合成画面"
                           value="2"></el-option>
                <el-option class="select_option"
                           label="书记员/示证展台"
                           value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item label="右电视默认信号源:"
                        class="form_item form_select">
            <el-form-item>
              <el-select v-model="form.rtSelect"
                         placeholder="请选择信号源">
                <el-option class="select_option"
                           label="智慧庭审法官端"
                           value="1"></el-option>
                <el-option class="select_option"
                           label="庭审现场合成画面"
                           value="2"></el-option>
                <el-option class="select_option"
                           label="书记员/示证展台"
                           value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-form-item>
        </el-form>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    var validateAddressPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("IP值不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          callback();
        }
      }, 1000);
    };
    var validateKeyPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入端口号"));
      } else if (!Number.isInteger(value)) {
        return callback(new Error("请输入数字"));
      } else if (value > 999999) {
        return callback(new Error("端口号为6位数字"));
      } else {
        return callback();
      }
    };
    return {
      form: {
        ip: { input1: null, input2: null, input3: null, input4: null },
        input5: null,
        ltSelect: "1",
        rtSelect: "1"
      },
      id: null,
      rules: {
        "ip.input1": [{ validator: validateAddressPass, trigger: "blur" }],
        "ip.input2": [{ validator: validateAddressPass, trigger: "blur" }],
        "ip.input3": [{ validator: validateAddressPass, trigger: "blur" }],
        "ip.input4": [{ validator: validateAddressPass, trigger: "blur" }],
        input5: [{ validator: validateKeyPass, trigger: "blur" }]
      }
    };
  },
  watch: {
    "form.ip.input1"(value) {
      if (value > 255) {
        return (this.form.ip.input1 = 255);
      }
      if (value > 99) {
        this.$refs["input2"].focus();
      }
    },
    "form.ip.input2"(value) {
      if (value > 255) {
        return (this.form.ip.input2 = 255);
      }
      if (value > 99) {
        this.$refs["input3"].focus();
      }
    },
    "form.ip.input3"(value) {
      if (value > 255) {
        return (this.form.ip.input3 = 255);
      }
      if (value > 99) {
        this.$refs["input4"].focus();
      }
    },
    "form.ip.input4"(value) {
      if (value > 255) {
        return (this.form.ip.input4 = 255);
      }
      if (value > 99) {
        this.$refs["input5"].focus();
      }
    }
  },
  methods: {
    loadData() {
      let url = this.$api.setConfig.tpkzxx;
      this.$http.get(
        url,
        {
          courtNo: sessionStorage.KEY_SETTING_COURT_NO,
          no: sessionStorage.KEY_SETTING_NO
        },
        res => {
          if (res.ip != null) {
            this.form.ip = this.concatArr(
              Object.keys(this.form.ip),
              res.ip.split(".")
            );
          }
          this.form.input5 = res.port;
          this.form.ltSelect = res.li;
          this.form.rtSelect = res.ri;
          this.id = res.id;
        }
      );
    },
    postData() {
      return new Promise((res, rej) => {
        let courtNo, id, ip, li, no, port, ri, url;
        courtNo = sessionStorage.KEY_SETTING_COURT_NO;
        ip = Object.values(this.form.ip).join(".");
        li = this.form.ltSelect;
        no = sessionStorage.KEY_SETTING_NO;
        port = this.form.input5;
        ri = this.form.rtSelect;
        if (this.id != null) {
          id = this.id;
          url =
            this.$api.setConfig.tpkz +
            "?courtNo=" +
            courtNo +
            "&id=" +
            id +
            "&ip=" +
            ip +
            "&port=" +
            port +
            "&li=" +
            li +
            "&ri=" +
            ri +
            "&no=" +
            no;
        } else {
          url =
            this.$api.setConfig.tpkz +
            "?courtNo=" +
            courtNo +
            "&ip=" +
            ip +
            "&port=" +
            port +
            "&li=" +
            li +
            "&ri=" +
            ri +
            "&no=" +
            no;
        }
        this.$http.post(url, null, result => {
          if (result.success) {
            res();
          } else {
            rej(result.errmsg);
          }
        });
      });
    },
    submitForm() {},
    concatArr(keyArr, valueArr) {
      let obj = {};
      keyArr.map((item, index) => {
        obj[item] = parseInt(valueArr[index]);
      });
      return obj;
    }
  },
  mounted() {
    this.loadData();
    this.$refs["input1"].focus();
  }
};
</script>

<style lang='scss' scoped>
.screen_control {
  height: 100%;
  width: 100%;
  .header {
    height: 53px;
    text-align: center;
    font-family: "PingFang";
    font-size: 2.375rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 1);
    line-height: 53px;
    margin: 0 auto;
  }
  .control_config {
    width: 100%;
    height: calc(100% - 53px);
    box-sizing: border-box;
    padding: 15px;
    display: flex;
    flex-wrap: nowrap;
    .left_img {
      height: 100%;
      width: 731px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
      .svg-icon {
        width: 731px;
        height: 179px;
      }
    }
    .right_write::v-deep {
      .el-form {
        height: 100%;
        padding-top: 10%;
        padding-left: 20px;
        > .form_item {
          ~ .form_item {
            margin-top: 60px;
          }
        }
        .form_input {
          display: -webkit-box;
          align-items: center;
          .el-form-item__label {
            font-size: 2.375rem;
            color: #ffffff;
            margin-right: 5px;
            float: unset;
            width: 150px;
          }
          > .el-form-item__content {
            display: flex;
            flex-wrap: nowrap;
            width: calc(100% - 180px);
            > .el-form-item {
              margin: 0 5px;
              flex-basis: calc(100% - 40px);
              .el-input {
                font-size: 2.375rem;
                input[type="text"] {
                  border: unset;
                  border-bottom: 1px solid #ffffff;
                  border-radius: 0;
                  color: #ffffff;
                  padding: 0 5px;
                  text-align: center;
                  background-color: rgba($color: #000000, $alpha: 0);
                }
              }
              .el-form-item__error {
                font-size: 1.4rem;
              }
            }
            .special_item {
              flex-basis: 100%;
            }
            > .el-form-item.is-error {
              .el-input {
                input[type="text"] {
                  border-bottom-color: crimson;
                  color: crimson;
                }
              }
            }
          }
        }
        .form_select {
          display: -webkit-box;
          align-items: center;
          .el-form-item__label {
            font-size: 2.375rem;
            color: #ffffff;
            margin-right: 5px;
            float: unset;
            width: 150px;
          }
          .el-form-item__content {
            width: calc(100% - 185px);
            .el-select {
              width: 100%;
              .el-input {
                font-size: 2.3rem;
                .el-input__inner {
                  height: 56px;
                }
              }
            }
          }
        }
      }
    }
  }
}
.select_option {
  font-size: 2.3rem;
  margin: 15px 0;
}
</style>
