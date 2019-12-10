<template>
  <div class="fg_dzqm">
    <div class="left_panel">
      <bl v-if="isTstg"></bl>
      <jl v-if="!isTstg"></jl>
    </div>
    <div class="right_panel">
      <div class="panel-bg">
        <swiper :options="swiperOption"
                v-if="swiperSlides.length!=0"
                ref="mySwiper">
          <swiper-slide v-for="(item, index) in swiperSlides"
                        :key="index">
            <img :src="item.src"
                 alt="" />
          </swiper-slide>
          <!-- Optional controls -->
          <div class="swiper-button-prev"
               slot="button-prev">
            <el-button type="primary"
                       icon="el-icon-arrow-left"
                       circle></el-button>
          </div>
          <div class="swiper-button-next"
               slot="button-next">
            <el-button type="primary"
                       icon="el-icon-arrow-right"
                       circle></el-button>
          </div>
        </swiper>
        <div v-else
             style="height:100%;
             display:flex;
             justify-content:center;
             align-items:center">
          <span style="font-size:3rem">暂无签名文件</span>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import Bl from "../common/Bl";
import Jl from "../common/Jl";
import WsCommand from "@/utils/Command";
import CommandEnum from "@/utils/CommandEnum";
import { mapGetters, mapState } from "vuex";
export default {
  data() {
    return {
      swiperOption: {
        slidesPerView: 2,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      },
      swiperSlides: []
    };
  },
  components: {
    Bl,
    Jl
  },
  computed: {
    ...mapGetters(["message"]),
    swiper() {
      return this.$refs.mySwiper.swiper;
    },
    ...mapState({
      isTstg: "isTstg"
    })
  },
  watch: {
    message(value) {
      this.handleMessage(value);
    }
  },
  methods: {
    handleMessage(data) {
      if (data.cmd == CommandEnum.DZQM_DISPLAY_IMAGE) {
        this.loadImg();
      }
    },
    loadImg() {
      let url = this.$api.dzqm.count;
      this.swiperSlides = []; //初始化
      this.$http.get(
        url,
        { sn: sessionStorage.KEY_CASE_SN, xh: sessionStorage.KEY_XH },
        res => {
          let count = res;
          let url = this.$api.dzqm.img;
          let sn = sessionStorage.KEY_CASE_SN;
          let xh = sessionStorage.KEY_XH;
          let slideArr = [];
          for (let pxh = 1; pxh <= count; pxh++) {
            slideArr.push({
              src:
                `${process.env.VUE_APP_API_SERVER}` +
                url +
                "?pxh=" +
                pxh +
                "&sn=" +
                sn +
                "&xh=" +
                xh
            });
          }
          this.swiperSlides = slideArr;
        }
      );
    }
  },
  mounted() {
    this.loadImg();
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/scss/common.scss";
.fg_dzqm {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  .left_panel {
    @include left_panel;
    border-right: unset;
  }
  .right_panel {
    @include right_panel;
    border-left: unset;
    .panel-bg {
      border: 2px solid #4f6e9d;
      background-color: #132231;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding: 20px;
      .swiper-container {
        height: 100%;
        .swiper-slide {
          margin: 0 auto;
          img {
            width: auto;
            height: 100%;
            margin: auto;
            display: block;
          }
        }
        .swiper-button-prev,
        .swiper-button-next {
          width: 50px;
          height: 50px;
          .el-button {
            width: 50px;
            height: 50px;
            [class*=" el-icon-"],
            [class^="el-icon-"] {
              font-size: 25px;
            }
          }
        }
      }
    }
  }
}
</style>