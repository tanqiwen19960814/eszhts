<template>
  <div class="zyjd">
    <div v-if="modalEnable"
         class="jz_modal"
         @click="handleModalClick"></div>
    <div class="right_panel">
      <div class="zyjd_panel">
        <p class="zyjd_header">争议焦点</p>
        <el-scrollbar class="my_scroll"
                      style="height:calc(100% - 60px);margin-right:-10px;">
          <div v-for="z in zyjd"
               :key="z.wjId"
               :id="z.wjId"
               :class="{'zyjd_item':true,'actived':currentZyjd.wjId == z.wjId}"
               @click="changeJd(z)">
            <p class="title"> <span class="dot"></span> {{z.wjMc}}</p>
            <p class="content"
               v-for="item in z.children"
               :key="item.id">{{item.xsnr}}</p>
          </div>
        </el-scrollbar>
      </div>
      <div class="tag_panel">
        <div class="jz_wrapper">
          <div style="position: relative;display:flex;align-items:center;justify-content:center;height:100%;">
            <img :style="{width:langWidth,height:langHeight}"
                 ref="jzImage"
                 v-if="img.src != null"
                 :src="img.src"
                 alt="">
            <div class="tags_modal"
                 ref="tagWrapper"
                 :style="{
                 'position':'absolute',
                 'top':tagWrapper.y+'px',
                 'left':tagWrapper.x+'px',
                 'width':tagWrapper.width+'px',
                 'height':tagWrapper.height+'px',
                 }">
              <div v-for="(tag, index) in tags"
                   :key="tag.id"
                   :class="{
                  tag: true,
                  tag_yg: tag.roleid == '2',
                  tag_bg: tag.roleid == '3',
                  actived: tag.id === activedTagKey
                }"
                   :style="{
                  top: tag.posY + '%',
                  left: tag.posX + '%',
                  width: tag.width + '%',
                  height: tag.height + '%'
                }"
                   @mouseover="activeTag(tag.id)"
                   @mouseleave="unActiveTag">
                <span class="tag_corner">{{ index + 1 }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="tag_wrapper">
          <div class="dsr_name">
            <el-scrollbar class="my_scroll"
                          style="height:100%;">
              <span style="display:block;">
                <i class="yg_dot"></i>
                <p style=" vertical-align: middle;display:inline-block;">{{yg.ssdw}}标注:{{yg.mc}}</p>
              </span>
              <span style="display:block">
                <i class="bg_dot"></i>
                <p style=" vertical-align: middle;display:inline-block;">{{bg.ssdw}}标注:{{bg.mc}}</p>
              </span>
            </el-scrollbar>
          </div>
          <div class="tag_list">
            <el-scrollbar class="my_scroll"
                          style="height:100%;">
              <div :class="{ tag_li: true, actived: m.id === activedTagKey }"
                   v-for="(m, i) in tags"
                   :key="m.id"
                   @mouseover="activeTag(m.id)"
                   @mouseleave="unActiveTag">
                <p class="tag_content">
                  <span :class="{tag_xh_bg:m.roleid==3,tag_xh_yg:m.roleid==2}">{{ i + 1 }}</span> {{ m.content }}
                </p>
                <p class="tag_time"
                   style="color:#b3b7be">
                  <i class="el-icon-time"
                     style="margin:5px;"></i> {{ m.bzsj }}
                </p>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import JzTree from "../common/JzTree";
import WsCommand from "@/utils/Command";
import CommandEnum from "@/utils/CommandEnum";
import { mapGetters, mapActions } from "vuex";
import { mapState } from "vuex";
export default {
  components: {
    JzTree
  },
  data() {
    return {
      courtNo: sessionStorage.getItem("KEY_COURT_NO"),
      currentZyjd: {},
      zyjd: [],
      activedTagKey: null,
      caseSn: sessionStorage.getItem("KEY_CASE_SN"),
      ah: sessionStorage.getItem("KEY_AH"),
      courtNo: sessionStorage.getItem("KEY_COURT_NO"),
      ajSn: null,
      bajz: {
        default: null,
        jbOption: []
      },
      tags: [],
      currentJzId: "",
      tagWrapper: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      },
      img: {
        width: 0,
        height: 0,
        src: null
      },
      yg: {
        ssdw: "",
        mc: ""
      },
      bg: {
        ssdw: "",
        mc: ""
      },
      modalTimer: null
    };
  },
  computed: {
    ...mapGetters(["tsjc", "storeWjId", "storeAjSn", "message"]),
    ygtags() {
      return this.tags.filter(_ => _ && _.roleid == "2");
    },
    bgtags() {
      return this.tags.filter(_ => _ && _.roleid != "2");
    },
    modalEnable() {
      return this.tsjc == "1";
    },
    langHeight() {
      if (this.img.width > this.img.height) {
        return "auto";
      } else {
        return "100%";
      }
    },
    langWidth() {
      if (this.img.width > this.img.height) {
        return "100%";
      } else {
        return "auto";
      }
    }
  },
  watch: {
    currentJzId(value) {
      if (!value) {
        return;
      }
      this.loadImg(value);
      // 切换卷宗图片，加载原被告标注
      this.loadTags(value);
    },
    message(value) {
      this.handleMessage(value);
    }
  },
  methods: {
    // 本院卷宗类别
    loadBaJbOption() {
      const url = this.$api.bajz.jb;
      this.$http.get(
        url,
        { courtNo: this.courtNo, caseSn: this.caseSn },
        resp => {
          resp = resp.filter(_ => _.value == "001");
          this.bajz.jbOption = resp;
          this.ajSn = resp[0].ajSn;
          this.loadZyjd();
        }
      );
    },
    //加载争议焦点
    loadZyjd() {
      let url = this.$api.zyjd;
      this.$http.get(
        url,
        {
          ajSn: parseInt(this.ajSn),
          caseSn: sessionStorage.KEY_CASE_SN,
          pqXh: sessionStorage.KEY_XH
        },
        res => {
          this.zyjd = res;
          if (this.storeAjSn && this.storeWjId) {
            let zyjd = this.zyjd.find(item => item.wjId == this.storeWjId);
            if (zyjd != undefined) {
              this.changeJd(zyjd);
            } else {
              this.loadImg(this.storeWjId);
            }
          } else {
            this.changeJd(this.zyjd[0]);
          }
        }
      );
    },
    loadTags(wjId) {
      const url = this.$api.tags.list.replace("{wjId}", wjId);
      this.$http.get(url, null, res => {
        this.tags = res;
      });
    },
    resizeTagWrapper() {
      const {
        offsetWidth,
        offsetHeight,
        offsetLeft,
        offsetTop
      } = this.$refs.jzImage;
      this.tagWrapper.width = offsetWidth;
      this.tagWrapper.height = offsetHeight;
      this.tagWrapper.x = offsetLeft;
      this.tagWrapper.y = offsetTop;
    },
    loadImg(value) {
      // 显示图片
      const img = new Image();
      img.src = `${this.$api.bajz.download}?courtNo=${
        this.courtNo
      }&wjId=${value}&r=${Math.random()}`;
      this.img.src = img.src;
      img.onload = e => {
        this.img.width = img.width;
        this.img.height = img.height;
        this.$nextTick(() => {
          if (this.$refs.jzImage) {
            this.resizeTagWrapper();
          } else {
            let timer = setTimeout(() => {
              this.resizeTagWrapper();
            }, 500);
            clearTimeout(timer);
          }
        });
      };
    },
    receiveTreeResult(res) {
      //渲染完后，清空默认值
      const jz = this.bajz;
      jz.default = null;
      this.treeData = res;
    },
    changeJd(zyjd) {
      this.currentZyjd = zyjd;
      this.currentJzId = zyjd.wjId;
      this.loadImg(this.currentJzId);
    },
    activeTag(id) {
      this.activedTagKey = id;
    },
    unActiveTag() {
      this.activedTagKey = null;
    },
    getInfo() {
      let url = this.$api.tsjsxx;
      this.$http.get(
        url,
        {
          courtNo: sessionStorage.KEY_COURT_NO,
          pqxh: sessionStorage.KEY_XH,
          sn: sessionStorage.KEY_CASE_SN
        },
        res => {
          let { bgSsdw, bgUsername, ygSsdw, ygUsername } = res;
          this.yg.ssdw = ygSsdw;
          this.yg.mc = ygUsername;
          this.bg.ssdw = bgSsdw;
          this.bg.mc = bgUsername;
        }
      );
    },
    ...mapActions(["changeTsjc"]),
    //监听message变化，响应websocket
    handleMessage(command) {
      const { cmd, params } = command;
      // 法官控制切换图片
      if (cmd == CommandEnum.ZYJD_DISPLAY_IMAGE) {
        const ajSn = params.find(_ => _.key == "ajSn").value;
        const wjId = params.find(_ => _.key == "wjId").value;
        let zyjd = this.zyjd.find(item => item.wjId == wjId);
        if (zyjd != undefined) {
          this.changeJd(zyjd);
          document.getElementById(wjId).scrollIntoView({ block: "center" });
        } else {
          this.currentJzId = wjId;
          this.currentZyjd = "";
        }
      } else if (cmd == CommandEnum.ZYJD_STOP) {
        this.changeTsjc("2");
        this.$router.push("/dsr/dzqm");
      } else if (cmd == CommandEnum.WS_USERLOGIN) {
        this.getInfo();
      }
    },
    handleModalClick() {
      if (this.modalTimer) {
        clearTimeout(this.modalTimer);
        this.$message.closeAll();
      }
      this.modalTimer = setTimeout(() => {
        this.$message.warning("争议焦点过程中，只能由法官进行操作");
      }, 500);
    }
  },
  mounted() {
    // 加载本院卷别选项
    this.loadBaJbOption();
    this.getInfo();
  }
};
</script>
<style scoped>
.zyjd {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.jz_modal {
  position: absolute;
  top: 0;
  left: 100px;
  width: calc(100% - 120px);
  height: 100%;
  z-index: 200;
  background-color: rgba(0, 0, 0, 0);
}
.jz_menu_panel {
  width: 520px;
  height: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  background: rgba(22, 41, 61, 1);
  border: 2px solid #21a2f3;
}
.menu_header {
  height: 56px;
  font-size: 1.75rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.right_panel {
  flex: 1;
  height: 100%;
  padding: 20px 30px 0 20px;
  box-sizing: border-box;
  border-left: 1px solid #10192c;
  display: flex;
}
.zyjd_panel {
  width: 520px;
  height: 100%;
  box-sizing: border-box;
  background: rgba(22, 41, 61, 1);
  border: 2px solid #21a2f3;
  margin-right: 20px;
  padding: 0 20px;
}
.tag_panel {
  display: flex;
  height: 100%;
  box-sizing: border-box;
  flex: 1;
  border: 2px solid #4f6e9d;
  background: rgba(22, 41, 61, 1);
}
.zyjd_header {
  padding: 10px;
  font-size: 20px;
  text-align: center;
  color: #fff;
}
.zyjd_item {
  background: rgba(19, 34, 49, 0.6);
  border-radius: 8px;
  border: 1px solid rgba(79, 109, 157, 1);
  padding: 10px;
  margin: 0 10px 10px 0;
  font-size: 1.125rem;
  color: #c0dcff;
  transition: all 0.2s linear;
  cursor: pointer;
}
.zyjd_item.actived {
  color: #fff;
  background: rgba(19, 34, 49, 1);
  border: 1px solid #21a2f3;
}
.zyjd_item .title {
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  margin-bottom: 6px;
}
.zyjd_item .title .dot {
  display: inline-block;
  width: 16px;
  height: 16px;
  background: rgb(158, 158, 158);
  border-radius: 100%;
  margin-right: 10px;
}
.zyjd_item.actived .title .dot {
  background: rgb(0, 157, 255);
}
.zyjd_item .content {
  text-indent: 2em;
}
.jz_wrapper {
  width: 900px;
  height: 100%;
  padding: 20px;
  border-right: 2px solid rgba(79, 110, 157, 1);
}
.tag_wrapper {
  flex: 1;
  height: 100%;
}
.jz_wrapper::v-deep .el-scrollbar__view {
  height: 100%;
}
.tag_wrapper_header,
.dsr_name {
  background-color: rgb(49, 71, 103);
  border-bottom: 2px solid #4f6e9d;
  box-sizing: border-box;
}
.tag_wrapper_header {
  height: 38px;
  line-height: 38px;
  font-size: 1.125rem;
  text-align: center;
}
.dsr_name {
  height: 100px;
  padding: 6px;
}
.dsr_name span {
  margin-top: 6px;
}
.tag_list {
  height: calc(100% - 100px);
}
.tag_li {
  margin: 6px;
  border-bottom: 1px solid #4f6d9d;
  padding: 10px 2px;
  cursor: pointer;
  transition: all 0.2s linear;
}
.tag_li.actived {
  background: #4f6d9d;
}
.tag_content {
  font-size: 1.125rem;
  padding: 6px 0;
}
.tag_xh_yg,
.tag_xh_bg {
  display: inline-block;
  border-radius: 100%;
  width: 18px;
  height: 18px;
  text-align: center;
  line-height: 18px;
  margin: 0 3px;
  font-size: 14px;
}
.tag_xh_yg {
  background: red;
}
.tag_xh_bg {
  background: rgba(40, 207, 67);
}
.tag {
  position: absolute;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  text-shadow: 0px 0px 1px #000;
  font-size: 1rem;
  transition: all 0.1s linear;
  -moz-transition: all 0.1s linear;
  z-index: 100;
  cursor: pointer;
}
.tag.tag_yg {
  border: 1px dashed rgba(254, 97, 89, 1);
  background: rgba(254, 97, 89, 0.3);
}
.tag.tag_bg {
  border: 1px dashed rgba(40, 207, 67, 1);
  background: rgba(40, 207, 67, 0.3);
}
.tag_corner {
  display: inline-block;
  height: 20px;
  line-height: 20px;
  padding: 0 3px;
  background: rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  color: #fff;
}
.tag_yg .tag_corner {
  background-color: rgba(254, 97, 89, 0.8);
}
.tag_bg .tag_corner {
  background-color: rgba(40, 207, 67, 0.8);
}
.tag_yg.actived {
  background-color: rgba(254, 97, 89, 0.5);
  z-index: 101;
}
.tag_bg.actived {
  background-color: rgba(40, 207, 67, 0.5);
  z-index: 101;
}
.yg_dot,
.bg_dot {
  width: 16px;
  height: 16px;
  border-radius: 100%;
  display: inline-block;
  margin-right: 6px;
  vertical-align: middle;
}
.yg_dot {
  background: rgba(254, 97, 89);
}
.bg_dot {
  background: rgba(40, 207, 67);
}
</style>
<style>
.jz_tab .el-tabs__nav-wrap::after {
  background-color: #334c6d;
}
.jz_tab .el-tabs__item {
  font-size: 1.3rem;
  color: #c0dcff;
  height: 42px;
  line-height: 42px;
}
.jz_tab .el-tabs__active-bar {
  background-color: #00afff;
}
.jz_tab .el-tabs__item.is-active {
  color: #fff;
}
.my_scroll .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>