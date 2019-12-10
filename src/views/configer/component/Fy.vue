<template>
  <div class="court">
    <header class="header">
      请选择法院
    </header>
    <main class="court_list">
      <swiper :options="swiperOption"
              ref="mySwiper">
        <swiper-slide v-for="(item, index) in swiperSlides"
                      :key="index">
          <div :class="{court_item:true,clearfloat:true,active:isActive==childItem.courtNo}"
               v-for="(childItem,childIndex) in item"
               :key="childIndex"
               @click="handleCourtClick(childItem.courtNo,childItem.courtName)">
            <svg-icon icon-class="fahui"
                      class-name="fahui"></svg-icon>
            <div class="court_name">
              {{childItem.courtName}}
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
      isActive: null
    };
  },
  methods: {
    loadData() {
      const url = this.$api.setConfig.fy;
      this.$http.get(url, null, res => {
        this.swiperSlides = this.paging(res);
      });
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
    handleCourtClick(courtNo, courtName) {
      this.isActive = courtNo;
      sessionStorage.setItem("KEY_SETTING_COURT_NO", courtNo);
      sessionStorage.setItem("KEY_SETTING_COURT_NAME", courtName);
    }
  },
  mounted() {
    this.loadData();
    if (sessionStorage.KEY_SETTING_COURT_NO) {
      this.isActive = sessionStorage.KEY_SETTING_COURT_NO;
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
    // padding: 15px;
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
  }
}
</style>

