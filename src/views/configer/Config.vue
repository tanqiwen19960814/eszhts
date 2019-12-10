<template>
  <div class="config">
    <div class="copmnent">
      <fy v-if="index==1" />
      <spt v-if="index==2"
           @noNext="handleDisable" />
      <role v-if="index==3" />
      <tpkz v-if="index==4"
            ref="control" />
      <kjfs v-if="index==5"
            ref="finish" />
    </div>
    <div class="btn_group">
      <el-button type="info"
                 v-show="index>3&index<5"
                 @click="handleJumpClick">跳过</el-button>
      <el-button v-show="index>1"
                 type="primary"
                 @click="handlePrevStep">上一步</el-button>
      <el-button v-show="index<5"
                 type="warning"
                 @click="handleNextStep"
                 :disabled="isDisable">下一步</el-button>
      <el-button v-show="index==5"
                 @click="handleFinishClick"
                 class="finish">完成</el-button>
    </div>
  </div>
</template>

<script>
import "./index";
export default {
  name: "Config",
  data() {
    return { index: 1, isDisable: false };
  },
  methods: {
    handlePrevStep() {
      this.index -= 1;
      this.isDisable = false;
    },
    handleNextStep() {
      if (this.index == 2) {
      }
      if (this.index == 4) {
        this.$refs["control"].$refs["ruleForm"].validate(valid => {
          if (valid) {
            this.$refs["control"]
              .postData()
              .then(() => {
                this.index += 1;
              })
              .catch(err => {
                this.$message.error(err);
              });
          } else {
            this.$message.error({
              message: "请填写必填项!",
              duration: 3000
            });
          }
        });
      } else {
        this.index += 1;
      }
    },
    handleDisable() {
      this.isDisable = true;
    },
    handleJumpClick() {
      this.index += 1;
    },
    handleFinishClick() {
      this.$refs["finish"].openWindow();
    }
  }
};
</script>

<style lang='scss' scoped>
.config {
  height: 760px;
  width: 1579px;
  background: rgba(3, 31, 55, 0.5);
  border-radius: 20px;
  border: 2px solid rgba(102, 175, 255, 1);
  margin: 0 auto;
  padding: 25px;
  .copmnent {
    height: calc(100% - 66px);
  }
  .btn_group {
    height: 66px;
    text-align: center;
    .el-button {
      width: 205px;
      height: 66px;
      display: inline-block;
      font-size: 2.375rem;
      font-family: "PingFang";
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
    }
    .el-button--info {
      margin-right: 100px;
    }
    .el-button--warning.is-disabled {
      border-color: #7e8085;
      background-color: #7e8085;
    }
    .finish {
      background: rgba(19, 194, 194, 1);
      border-color: rgba(19, 194, 194, 1);
      margin-left: 100px;
    }
  }
}
</style>