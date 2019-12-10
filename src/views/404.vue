<template>
  <div class="error_wrapper">
    <p class="error_code">404</p>
    <p class="error_info">未找到你要访问的页面！</p>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.error_wrapper {
  width: 100%;
  height: 100%;
  background: url("~@/assets/images/bg01.jpg") center no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #fff;
}
.error_code {
  font-size: 12rem;
  font-weight: 600;
  background: linear-gradient(to bottom, rgb(167, 167, 167), #fff);
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
}
.error_info {
  font-size: 1.6rem;
}
</style>