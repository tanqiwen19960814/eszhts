<template>
  <div class="role">
    <header class="header">
      请选择本电脑使用人角色
    </header>
    <main class="role_list">
      <div :class="{list_item:true,fg_role:index==0,yg_role:index==1,bg_role:index==2,active:isActive==index+1}"
           v-for="(item,index) in list"
           :key="index"
           @click="handleRoleClick(item.key)">
        {{item.value}}
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      isActive: 1,
      list: []
    };
  },
  methods: {
    loadRole() {
      const url = this.$api.setConfig.role;
      this.$http.get(url, null, res => {
        this.list = res;
      });
    },
    handleRoleClick(key) {
      this.isActive = key;
      sessionStorage.setItem("KEY_SETTING_ROLE", key);
    }
  },
  mounted() {
    this.loadRole();
    if (sessionStorage.KEY_SETTING_ROLE) {
      this.isActive = sessionStorage.KEY_SETTING_ROLE;
    } else {
      sessionStorage.setItem("KEY_SETTING_ROLE", this.isActive);
    }
  }
};
</script>

<style lang='scss' scoped>
.role {
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
  .role_list {
    width: 100%;
    height: calc(100% - 53px);
    box-sizing: border-box;
    padding: 15px;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;
    .list_item {
      width: 292px;
      height: 257px;
      border-radius: 8px;
      margin: 0 20px;
      font-size: 54px;
      font-family: "PingFang";
      font-weight: 600;
      border: 5px solid;
      color: rgba(255, 255, 255, 1);
      line-height: 257px;
      text-align: center;
      text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
    }
    .fg_role {
      background: linear-gradient(
        180deg,
        rgba(207, 74, 123, 1) 0%,
        rgba(192, 63, 72, 1) 100%
      );
      border-color: rgba(192, 63, 72, 1);
    }
    .yg_role {
      background: linear-gradient(
        360deg,
        rgba(79, 121, 213, 1) 0%,
        rgba(101, 194, 245, 1) 100%
      );
      border-color: rgba(101, 194, 245, 1);
    }
    .bg_role {
      background: linear-gradient(
        180deg,
        rgba(103, 208, 183, 1) 0%,
        rgba(72, 160, 113, 1) 100%
      );
      border-color: rgba(72, 160, 113, 1);
    }
    .active {
      border: 5px solid orange;
    }
  }
}
</style>
