<template>
  <div class="login-pq">
    <div class="pqList">
      <swiper :options="swiperOption"
              ref="mySwiper">
        <swiper-slide v-for="(item, index) in swiperSlides"
                      :key="index">
          <div class="slide-content">
            <svg-icon icon-class="aj"
                      class-name="aj"></svg-icon>
            <ul>
              <li>
                <span>案号</span><span>{{item.ah}}</span>
              </li>
              <li>
                <span>当事人</span>
                <span>
                  <p>{{item.dsr|FirWordFilter}}</p>
                  <p>{{item.dsr|SecWordFilter}}</p>
                </span>
              </li>
              <li>
                <span>承办人</span><span>{{item.cbr}}</span>
              </li>
              <li>
                <span>开始时间</span><span>{{item.kssj|timeFilter}}</span>
              </li>
              <li>
                <span>开庭地点</span><span>{{item.dd}}</span>
              </li>
            </ul>
            <el-button @click="ajClickHandle(index)"
                       round>进入案件</el-button>
          </div>
        </swiper-slide>
      </swiper>
      <div class="swiper-pagination"></div>
      <span style="position:absolute;
                  bottom:0;
                  left:-100px;
                  cursor:pointer;
                  color:white;
                  padding:15px 10px"
            @click="handleBack">
        <svg-icon slot="reference"
                  icon-class="back"
                  style="width:1.5rem;height:1.5rem;cursor:pointer;vertical-align:middle;"></svg-icon><span style="margin-left:10px;vertical-align:middle;">返回</span>
      </span>
    </div>
    <el-footer class="footer">
      <font color="red">Eastsoft</font> 东软载波科技股份有限公司 版权所有
    </el-footer>
  </div>
</template>

<script>
export default {
  name: "Fgpq",
  data() {
    return {
      swiperOption: {
        slidesPerView: 3,
        watchOverflow: true,
        pagination: {
          el: ".swiper-pagination"
        }
      },
      swiperSlides: []
    };
  },
  filters: {
    FirWordFilter(val) {
      return val.split(";")[0];
    },
    SecWordFilter(val) {
      return val.split(";")[1];
    },
    timeFilter(val) {
      let hours =
        new Date(val).getHours() < 12
          ? "上午" + new Date(val).getHours()
          : "下午" + new Date(val).getHours();
      return (
        new Date(val).getFullYear() +
        "年" +
        parseInt(new Date(val).getMonth() + 1) +
        "月" +
        new Date(val).getDate() +
        "日" +
        hours +
        "点" +
        new Date(val).getMinutes() +
        "分"
      );
    }
  },
  methods: {
    ajClickHandle(val) {
      const list = this.swiperSlides[val];
      sessionStorage.setItem("KEY_CASE_SN", list.sn); //list.case
      sessionStorage.setItem("KEY_AH", list.ah); //list.ah
      sessionStorage.setItem("KEY_XH", list.xh);
      this.setInfo();
    },
    setInfo() {
      let url =
        this.$api.ssdwxx +
        "?courtNo=" +
        sessionStorage.KEY_COURT_NO +
        "&pqxh=" +
        sessionStorage.KEY_XH +
        "&sn=" +
        sessionStorage.KEY_CASE_SN +
        "&ssdw=法官&userid=" +
        sessionStorage.KEY_USER_ID;
      this.$http.post(url, null, res => {
        this.$router.replace("/fg");
      });
    },
    handleBack() {
      this.$router.replace(
        "/fglogin?role=" +
          sessionStorage.KEY_ROLE +
          "&courtNo=" +
          sessionStorage.KEY_COURT_NO +
          "&spt=" +
          sessionStorage.KEY_SPT +
          ""
      );
    }
  },
  mounted() {
    this.swiperSlides = JSON.parse(sessionStorage.KEY_PQ_LIST);
  }
};
</script>

<style lang='scss' scoped>
.login-pq {
  width: 100%;
  background: url("~@/assets/images/bg01.jpg") center no-repeat;
  padding-top: 296px;
  .pqList {
    height: 630px;
    width: 1580px;
    margin: 0 auto;
    position: relative;
    .swiper-container {
      height: 100%;
      width: 100%;
      .swiper-slide {
        margin: 0 auto;
        .slide-content {
          height: 100%;
          width: 442px;
          background: rgba(14, 64, 107, 1);
          margin: 0 auto;
          text-align: center;
          box-shadow: 0px 8px 16px 0px rgba(5, 25, 43, 1);
          border-radius: 20px;
          border: 2px solid rgba(102, 175, 255, 1);
          padding: 20px;
          .svg-icon {
            width: 182px;
            height: 142px;
            margin: 60px 0;
          }
          ul {
            li {
              text-align: left;
              span {
                font-family: "PingFang";
                font-size: 1.2rem;
                color: white;
                display: inline-block;
                text-emphasis-position: top;
                p {
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                }
                &:first-child {
                  width: 104px;
                  vertical-align: top;
                }
                &:last-child {
                  color: #d6dee4;
                  width: calc(100% - 104px);
                  vertical-align: top;
                }
              }
              ~ li {
                margin-top: 10px;
              }
            }
          }
          .el-button {
            background: linear-gradient(
              90deg,
              rgba(21, 113, 255, 1) 0%,
              rgba(64, 181, 255, 1) 100%
            );
            border: 1px solid rgb(21, 113, 255);
            color: white;
            margin-top: 33px;
            width: 242px;
            height: 48px;
            font-size: 1.4rem;
            border-radius: 27px;
          }
        }
      }
    }
    .swiper-pagination::v-deep {
      bottom: -40px;
      left: 0;
      right: 0;
      margin: 0 auto;
      .swiper-pagination-bullet {
        width: 15px;
        height: 15px;
      }
    }
  }
  .footer {
    text-align: center;
    font-size: 16px;
    font-family: PingFang;
    margin-top: 94px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    font {
      width: 77px;
      height: 14px;
      font-size: 18px;
      font-family: PingFang;
      font-weight: bold;
      color: rgba(253, 59, 59, 1);
    }
  }
}
</style>
