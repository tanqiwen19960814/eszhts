<template>
  <div class="fg-ajgk">
    <div class="left_panel">
      <bl v-if="isTstg"></bl>
      <jl v-if="!isTstg"></jl>
    </div>
    <div class="right_panel">
      <div class="panel_box">
        <ul class="aj_info">
          <li>
            <span class="label">案件说明</span>
            <p>{{ajsm}}</p>
          </li>
          <li>
            <span class="label">立案日期</span>
            <p>{{larq}}</p>
          </li>
          <li> <span class="label">案件来源</span>
            <p>{{ajly}}</p>
          </li>
          <li> <span class="label">收案案由</span>
            <p>{{saay}}</p>
          </li>
          <li> <span class="label">当事人</span>
            <p>{{dsr}}</p>
          </li>
          <li> <span class="label">五涉情况</span>
            <p>{{wsqk}}</p>
          </li>
          <li> <span class="label">地域涉及</span>
            <p>{{dysj}}</p>
          </li>
          <li> <span class="label">合议庭信息</span>
            <p>{{hytxx}}</p>
          </li>
          <li> <span class="label">诉讼费信息</span>
            <p>{{ssfxx}}</p>
          </li>
          <li> <span class="label">审限信息</span>
            <p>{{sxxx}}</p>
          </li>
        </ul>
        <div class="aj_flow">
          <div class="flow-tip">
            案件流程信息
          </div>
          <el-scrollbar style="width:100%;">
            <div class="flow-map">
              <el-steps>
                <el-step v-for="(item,index) in stepArr"
                         :key="index"
                         :title="item.jdmc">
                  <svg-icon v-if="index+1!=stepArr.length"
                            slot="icon"
                            icon-class="lan"
                            class-name="lan"></svg-icon>
                  <svg-icon v-else
                            slot="icon"
                            icon-class="huang"
                            class-name="huang"></svg-icon>
                  <div class="desc"
                       slot="description">
                    <ul>
                      <li>
                        <span>{{item.data1.key}}</span>
                        <p>{{item.data1.value}}</p>
                      </li>
                      <li>
                        <span>{{item.data2.key}}</span>
                        <p>{{item.data2.value}}</p>
                      </li>
                      <li>
                        <span>{{item.data3.key}}</span>
                        <p>{{item.data3.value}}</p>
                      </li>
                    </ul>
                  </div>
                </el-step>
              </el-steps>
            </div>
            <i class="el-icon-arrow-right"></i>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Bl from "../common/Bl";
import Jl from "../common/Jl";
import { mapState } from "vuex";
export default {
  name: "",
  data() {
    return {
      ajly: "",
      ajsm: "",
      dsr: "",
      dysj: "",
      hytxx: "",
      larq: "",
      saay: "",
      ssfxx: "",
      sxxx: "",
      wsqk: "",
      stepArr: []
    };
  },
  components: {
    Bl,
    Jl
  },
  computed: {
    ...mapState({
      isTstg: state => state.isTstg
    })
  },
  methods: {
    getData() {
      const url = this.$api.ajgk;
      this.$http.get(url, { sn: sessionStorage.KEY_CASE_SN }, res => {
        this.ajly = res.ajly;
        this.ajsm = res.ajsm;
        this.dsr = res.dsr;
        this.dysj = res.dysj;
        this.hytxx = res.hytxx;
        this.larq = res.larq;
        this.saay = res.saay;
        this.ssfxx = res.ssfxx;
        this.sxxx = res.sxxx;
        this.wsqk = res.wsqk;
        this.stepArr = [...res.ajlcxx];
      });
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style lang='scss' scoped>
@import "~@/assets/css/scss/common.scss";
.fg-ajgk {
  @include auto_center;
  width: 100%;
  height: 100%;
  .left_panel {
    @include left_panel;
    border-right: unset;
  }
  .right_panel {
    @include right_panel;
    .panel_box {
      width: 100%;
      height: 100%;
      background: rgba(19, 34, 49, 1);
      border: 2px solid rgba(79, 110, 157, 1);
      padding: 30px;
      .aj_info {
        li {
          font-family: "PingFang";
          font-size: 1.4rem;
          ~ li {
            margin-top: 20px;
          }
          span {
            width: 139px;
            height: 34px;
            font-weight: 600;
            display: inline-block;
            background: rgba(0, 109, 186, 1);
            border-radius: 19px;
            text-align: center;
            margin-right: 17px;
            vertical-align: middle;
          }
          p {
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: calc(100% - 160px);
            vertical-align: middle;
          }
        }
        margin-bottom: 32px;
      }
      .aj_flow {
        height: calc(100% - 558px);
        font-size: 1.4rem;
        .flow-tip {
          height: 30px;
          border-left: 4px solid rgba(0, 109, 186, 1);
          padding-left: 5px;
        }
        .flow-map::v-deep {
          position: relative;
          padding-top: 88px;
          .el-step {
            position: relative;
            .el-step__main {
              margin: 0 10px;
            }
            .el-step__line {
              top: 16px;
              height: 3px;
            }
            .el-step__title {
              position: absolute;
              top: -52px;
              left: 0;
              right: 0;
              margin: 0 auto;
              width: 139px;
              height: 34px;
              background: rgba(0, 109, 186, 1);
              border-radius: 19px;
              text-align: center;
              font-size: 1.4rem;
              font-weight: 600;
              color: rgba(255, 255, 255, 1);
              line-height: 34px;
              text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.5);
            }
            .el-step__description {
              width: 349px;
              height: 129px;
              background: rgba(15, 43, 88, 1);
              border-radius: 19px;
              border: 1px solid rgba(151, 151, 151, 1);
              margin: 0 auto;
              margin-top: 50px;
              padding: 15px;
              .desc {
                ul {
                  li {
                    font-size: 1.2rem;
                    color: white;
                    ~ li {
                      margin-top: 8px;
                    }
                    span {
                      width: 80px;
                      height: 28px;
                      display: inline-block;
                      font-family: inherit;
                      font-weight: 600;
                      line-height: 28px;
                      margin-right: 18px;
                    }
                    p {
                      display: inline-block;
                      width: calc(100% - 100px);
                    }
                  }
                }
              }
            }
            .el-step__icon {
              position: absolute;
              top: 0px;
              left: 0%;
              right: 0%;
              margin: 0 auto;
              width: 34px;
              height: 34px;
              border-color: #4f6e9d;
              .svg-icon {
                width: 2.1rem;
                height: 2.1rem;
              }
            }
            &:last-of-type {
              flex-basis: 50% !important;
              max-width: unset !important;
              .el-step__line {
                display: block;
              }
              .el-step__title {
                background-color: #e38908;
              }
            }
            &:last-of-type.is-flex {
              flex-shrink: unset;
            }
          }
        }
        [class^="el-icon-"] {
          position: absolute;
          right: -0.45555555555%;
          top: 35.5%;
          font-weight: 700;
          color: #b3b7be;
        }
      }
    }
  }
}
</style>

