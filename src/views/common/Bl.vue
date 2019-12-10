<template>
  <div class="bl_frame_wrapper"
       v-loading="loading"
       element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)">
    <el-scrollbar class="my_scroll"
                  style="height:100%;background:#FFF">
      <div class="content"
           v-html="content"></div>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: "",
      loading: true
    };
  },
  methods: {
    getData() {
      const url = this.$api.tstg;
      this.$http.get(
        url,
        { sn: sessionStorage.KEY_CASE_SN, xh: sessionStorage.KEY_XH },
        res => {
          this.content = res.html;
          this.loading = false;
        }
      );
    }
  },
  created() {
    this.getData();
  }
};
</script>
<style scoped>
.bl_frame_wrapper {
  border: 2px solid #4f6e9d;
  background-color: #132231;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  color: #000000;
}
.content {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 10px;
  margin: 0;
  border: 0;
  background: #fff;
  overflow: auto;
}
</style>
<style>
.my_scroll .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>