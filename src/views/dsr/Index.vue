<template>
  <router-view />
</template>

<script>
import CommandEnum from "@/utils/CommandEnum";
import { mapGetters, mapActions } from "vuex";
export default {
  computed: {
    ...mapGetters(["message"])
  },
  methods: {
    ...mapActions(["changeTsjc"]),
    handleMessage(command) {
      const { cmd, params } = command;
      // 法官控制进入电子质证
      if (cmd == CommandEnum.DZZZ_START) {
        this.$router.replace("/dsr/dzzz");
        this.changeTsjc("0");
      } else if (cmd == CommandEnum.ZYJD_START) {
        this.$router.replace("/dsr/zyjd");
        this.changeTsjc("1");
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
