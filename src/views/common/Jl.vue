<template>
  <div class="jl_frame_wrapper"
       v-loading="loading"
       element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)">
    <el-scrollbar class="my_scroll"
                  style="height:100%;background:#FFF">
      <div class="content"
           ref="JlWrapper"
           @scroll="handleScroll"
           v-html="content"></div>
    </el-scrollbar>
  </div>
</template>

<script>
import WsCommand from "@/utils/Command";
import CommandEnum from "@/utils/CommandEnum";
import { mapState, mapGetters } from "vuex";
import { getScrollContainer } from "@/utils/dom";
export default {
  data() {
    return {
      content: "",
      loading: true,
      scroll: ""
    };
  },
  computed: {
    ...mapState({
      scrollTop: state => state.scrollTop
    }),
    ...mapGetters(["message"]),
    jlContainer() {
      return getScrollContainer(this.$refs.JlWrapper, true);
    }
  },
  watch: {
    message(value) {
      this.handlemessage(value);
    }
  },
  methods: {
    getData() {
      const url = this.$api.tsjl;
      this.content = "";
      this.$http.get(
        url,
        { sn: sessionStorage.KEY_CASE_SN, xh: sessionStorage.KEY_XH },
        res => {
          this.content = res.html;
          this.loading = false;
          this.$nextTick(_ => {
            this.doScroll();
          });
        }
      );
    },
    doScroll() {
      if (this.jlContainer && this.content) {
        this.jlContainer.scrollTop = this.scrollTop;
      }
    },
    handleScroll(e) {
      this.$store.commit("rewriteTop", event.target.scrollTop);
    },
    handlemessage(Command) {
      let { cmd } = Command;
      if (cmd == CommandEnum.TSJL_DISPLAY) {
        this.getData();
      }
    },
    bindScroll() {
      if (this.jlContainer) {
        this.jlContainer.addEventListener("scroll", this.handleScroll);
      }
    }
  },
  mounted() {
    this.getData();
    this.bindScroll();
  }
};
</script>
<style scoped>
.jl_frame_wrapper {
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
}
</style>
<style>
.my_scroll .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>