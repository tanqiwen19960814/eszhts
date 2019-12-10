<template>
  <div class="court">
    <header class="header">
      请选择审判庭
    </header>
    <main class="court_list">
      <swiper :options="swiperOption"
              v-if="swiperSlides.length!= 0"
              ref="mySwiper">
        <swiper-slide v-for="(item, index) in swiperSlides"
                      :key="index">
          <div :class="{court_item:true,clearfloat:true,active:isActive==childItem.name+childItem.id.no}"
               v-for="(childItem,childIndex) in item"
               :key="childIndex"
               @click="handleCourtClick(childItem.name,childItem.id.no)">
            <svg-icon icon-class="fating"
                      class-name="fating"></svg-icon>
            <div class="court_name">
              {{childItem.name}}
            </div>
          </div>
        </swiper-slide>
        <!-- Optional controls -->
        <div class="swiper-button-prev"
             slot="button-prev">
        </div>
        <div class="swiper-button-next"
             slot="button-next">
        </div>
      </swiper>
      <div class="no_params"
           v-if="swiperSlides.length==0">
        您选择的{{this.courtName}}没有已建设完成的科技法庭，请确认审判庭建设情况或返回上一步重新选择法院。
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      swiperOption: {
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      },
      swiperSlides: [],
      isActive: null,
      courtName: sessionStorage.KEY_SETTING_COURT_NAME
    };
  },
  methods: {
    loadData() {
      const url = this.$api.setConfig.spt;
      this.$http.get(
        url,
        { courtNo: sessionStorage.KEY_SETTING_COURT_NO },
        res => {
          if (res.length == 0) {
            console.log(1);
            this.$emit("noNext");
          }
          this.swiperSlides = this.paging(res);
        }
      );
    },
    paging(data) {
      let dataListGroup = [];
      data.forEach((item, index) => {
        let pageNum = parseInt(index / 12);
        if (!dataListGroup[pageNum]) {
          dataListGroup[pageNum] = [];
        }
        dataListGroup[pageNum].push(item);
      });
      return dataListGroup;
    },
    handleCourtClick(name, no) {
      this.isActive = name + no;
      sessionStorage.setItem("KEY_SETTING_SPT", name);
      sessionStorage.setItem("KEY_SETTING_NO", no);
    }
  },
  mounted() {
    this.loadData();
    if (sessionStorage.KEY_SETTING_SPT && sessionStorage.KEY_SETTING_NO) {
      this.isActive =
        sessionStorage.KEY_SETTING_SPT + sessionStorage.KEY_SETTING_NO;
    }
  }
};
</script>

<style lang='scss' scoped>
.court {
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
  .court_list {
    width: 100%;
    height: calc(100% - 53px);
    box-sizing: border-box;
    .court_item {
      width: 443px;
      height: 118px;
      float: left;
      background: rgba(17, 91, 212, 1);
      border-radius: 8px;
      margin: 10px 27.5px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px 0 11px 20px;
      border: 5px solid transparent;
      cursor: pointer;
      .svg-icon {
        width: 81px;
        height: 91px;
        flex-shrink: 0;
      }
      .court_name {
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 10px;
        height: 100%;
        font-size: 2.375rem;
        text-align: center;
        font-family: "PingFang";
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        line-height: 53px;
        text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
      }
    }
    .swiper-container {
      height: 100%;
    }
    .swiper-slide {
      padding-left: 15px;
    }
    .swiper-button-prev,
    .swiper-button-next {
      height: 50px;
      width: 52px;
      background-size: 108px 85px;
      &:focus {
        outline: none;
      }
    }
    .swiper-button-prev {
      left: 0;
    }
    .swiper-button-next {
      right: 0;
    }
    .active {
      border: 5px solid orange;
      transition: all 0.5;
    }
    .no_params {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 3rem;
      font-weight: 800;
      color: gray;
    }
  }
}
</style>

