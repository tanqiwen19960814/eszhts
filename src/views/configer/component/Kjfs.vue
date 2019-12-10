<template>
  <div class="kjfs">
    <header class="header">
      本机智慧庭审登录地址:
    </header>
    <main>
      <div class="url">
        <el-input v-model="input"
                  readonly
                  ref="input"
                  placeholder="请输入内容"></el-input>
        <el-button type="primary"
                   @click="handleCopy(input)">复制URL</el-button>
      </div>
      <div class="tips">
        请复制以上URL地址，在本机桌面创建“智慧庭审”登录快捷方式。点击“完成”按钮，可在新页面打开上方显示的URL地址进行登录测试。
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      input: null
    };
  },
  methods: {
    UrlCreat() {
      if (sessionStorage.KEY_SETTING_ROLE == 1) {
        this.input =
          window.location.href.split("/setting")[0] +
          "/fglogin?role=" +
          sessionStorage.KEY_SETTING_ROLE +
          "&courtNo=" +
          sessionStorage.KEY_SETTING_COURT_NO +
          "&spt=" +
          sessionStorage.KEY_SETTING_SPT;
      } else {
        this.input =
          window.location.href.split("/setting")[0] +
          "/dsrlogin?role=" +
          sessionStorage.KEY_SETTING_ROLE +
          "&courtNo=" +
          sessionStorage.KEY_SETTING_COURT_NO +
          "&spt=" +
          sessionStorage.KEY_SETTING_SPT;
      }
    },
    openWindow() {
      window.open(this.input);
    },
    handleCopy(str) {
      this.$refs["input"].select();
      document.execCommand("Copy");
      this.$message.success("复制成功!");
    }
  },
  mounted() {
    this.UrlCreat();
  }
};
</script>

<style lang='scss' scoped>
.kjfs {
  height: 100%;
  width: 100%;
  padding-left: 75px;
  padding-right: 50px;
  .header {
    height: 53px;
    text-align: left;
    font-family: "PingFang";
    font-size: 2.375rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 1);
    line-height: 53px;
    padding: 112px 0 53px 0;
  }
  .url {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    margin-bottom: 70px;
    .el-input::v-deep {
      .el-input__inner {
        width: 1170px;
        height: 81px;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 1);
        font-size: 2.375rem;
        font-family: "PingFang";
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 53px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
    .el-button {
      width: 227px;
      height: 66px;
      background: rgba(13, 113, 211, 1);
      border-radius: 8px;
      font-size: 2.375rem;
      font-family: "PingFang";
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
    }
  }
  .tips {
    font-size: 2.375rem;
    font-family: "PingFang";
    font-weight: 400;
    color: rgba(239, 239, 239, 1);
    line-height: 53px;
  }
}
</style>
