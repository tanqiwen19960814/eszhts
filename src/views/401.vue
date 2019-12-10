<template>
  <div class="error_wrapper">
    <p class="error_code">401</p>
    <p class="error_info">你无权访问本页面，请确认是否登录！</p>
    <input type="text"
           value=""
           v-model="sn"
           placeholder="请输入sn">
    <input type="text"
           value=""
           v-model="xh"
           placeholder="请输入xh">
    <input type="file"
           @change="getFile($event)">
    <button @click="submit3($event)">上传庭审提纲</button>
	<button @click="submit2($event)">上传庭审记录</button>
    <button @click="submit1($event)">上传电子签名</button>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      sn: 195400000249076,
      xh: 1,
      file: null
    };
  },
  methods: {
    getFile(event) {
      this.file = event.target.files[0];
    },
    submit1() {
      let formData = new FormData();
      formData.append("file", this.file);
      formData.append("sn", this.sn);
      formData.append("xh", this.xh);
      const url = "http://192.168.22.136:8080/eszhtsApi/dzqm/upload";
	  //const url = "http://129.1.100.100:8999/eszhtsApi/dzqm/upload";
      axios.post(url, formData).then(res => {
        this.$message.success("dzqm upload success");
        console.log("res=>", res);
      });
    },
    submit2() {
      let formData = new FormData();
      formData.append("file", this.file);
      formData.append("sn", this.sn);
      formData.append("xh", this.xh);
      const url = "http://192.168.22.136:8080/eszhtsApi/pq/uploadTsjl";
      //const url = "http://129.1.100.100:8999/eszhtsApi/pq/uploadTsjl";
      axios.post(url, formData).then(res => {
        this.$message.success("tsjl upload success");
        console.log("res=>", res);
      });
    },
    submit3() {
      let formData = new FormData();
      formData.append("file", this.file);
      formData.append("sn", this.sn);
      formData.append("xh", this.xh);
      const url = "http://192.168.22.136:8080/eszhtsApi/tstg/upload";
	  //const url = "http://129.1.100.100:8999/eszhtsApi/pq/uploadTsjl";
      axios.post(url, formData).then(res => {
        this.$message.success("tsjl upload success");
        console.log("res=>", res);
      });
    }
  }
};
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
