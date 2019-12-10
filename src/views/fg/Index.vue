<template>
  <router-view />
</template>

<script>
import CommandEnum from "@/utils/CommandEnum";
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return { modalTimer: null };
  },
  computed: {
    ...mapGetters(["message"])
  },
  methods: {
    handleMessage(command) {
      const { cmd, params } = command;
      // 当事人断线，提示法官
      if (cmd == CommandEnum.WS_DISCMSG) {
        const msg = params.find(_ => _.key == "msg").value;
        if (this.modalTimer) {
          clearTimeout(this.modalTimer);
          this.$message.closeAll();
        }
        this.modalTimer = setTimeout(() => {
          this.$message({
            showClose: true,
            type: "warning",
            message: msg,
            duration: 1500
          });
        }, 500);
      }
    }
  },
  watch: {
    message(value) {
      this.handleMessage(value);
    }
  }
};
</script>

<style></style>
