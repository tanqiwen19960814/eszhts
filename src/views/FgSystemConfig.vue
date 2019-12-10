<template>
  <div class="system_config">
    <config />
  </div>
</template>

<script>
import Config from "@/views/configer/Config";
export default {
  name: "SystemConfig",
  components: {
    Config
  },
  data() {
    return {};
  }
};
</script>

<style lang='scss' scoped>
.system_config {
  height: 100%;
  width: 100%;
  background: url("~@/assets/images/bg01.jpg");
  background-position: center;
  padding-top: 241px;
}
</style>
