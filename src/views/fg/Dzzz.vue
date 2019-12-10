<template>
  <div class="dzzz">
    <div class="left_panel">
      <div class="jz_menu_panel">
        <transition mode="out-in"
                    enter-active-class="animated fadeInUp faster"
                    leave-active-class="animated fadeOutDown faster">
          <div v-if="searchPanelVisiable"
               class="search_panel">
            <el-input placeholder="请输入关键字"
                      v-model="searchQ"
                      ref="searchInput"
                      class="search_input">
              <el-button slot="append"
                         icon="el-icon-search"
                         @click="searchJz"></el-button>
            </el-input>
            <el-scrollbar class="my_scroll"
                          style="height:calc(100% - 42px);">
              <p v-if="searchResult == null"
                 class="search_info">卷宗检索</p>
              <p class="search_info"
                 v-else-if="searchResult.length <= 1">
                暂无数据
              </p>
              <ul v-else
                  class="search_result">
                <li v-for="r in searchResult"
                    :key="r.wjId">
                  <div class="search_item"
                       @click="handleSearchItemClick(r)">
                    <p style="padding:3px 0;font-size:1.2rem;">
                      <svg-icon icon-class="file"></svg-icon>
                      {{ r.wjsm }}
                    </p>
                    <p style="color:rgb(193, 193, 193)">{{r.ah}}</p>
                  </div>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </transition>
        <div class="menu_header">
          <p>{{ ah }}</p>
          <i class="el-icon-search"
             style="cursor:pointer"
             @click="showSearchPanel"></i>
        </div>
        <el-tabs :value="bajz.params.jb + '_' + bajz.params.ajSn"
                 class="jz_tab"
                 stretch
                 @tab-click="chooseBajzJb">
          <el-tab-pane v-for="jb in bajz.jbOption"
                       :key="jb.value + '_' + jb.ajSn"
                       :label="jb.text"
                       :name="jb.value + '_' + jb.ajSn">
          </el-tab-pane>
        </el-tabs>
        <el-scrollbar class="my_scroll"
                      style="height:calc(100% - 120px);margin-right:-10px;">
          <jz-tree v-if="bajz.params.ajSn != null"
                   ref="bajzTree"
                   :url="bajz.url"
                   :params="bajz.params"
                   :showConfirm="true"
                   :defaultOnlyLeaf="true"
                   :defaultNodeKey="bajz.default"
                   :defaultExpandKeys="expandKeys"
                   @nodeClick="handleTreeNodeClick"
                   @passTreeResult="receiveTreeResult"></jz-tree>
        </el-scrollbar>
      </div>
    </div>
    <div class="right_panel">
      <div class="dzzz_toolbar">
        <el-tooltip content="旋转90°"
                    placement="left">
          <el-button type="primary"
                     :disabled="tags.length>0"
                     icon="el-icon-refresh-right"
                     @click="handleRotate"
                     circle></el-button>
        </el-tooltip>
        <el-tooltip content="上一页"
                    placement="left">
          <el-button type="primary"
                     icon="el-icon-arrow-left"
                     @click="handleLeftArrowClick"
                     circle></el-button>
        </el-tooltip>
        <el-tooltip content="下一页"
                    placement="left">
          <el-button type="primary"
                     @click="handleRightArrowClick"
                     icon="el-icon-arrow-right"
                     circle></el-button>
        </el-tooltip>
        <el-tooltip content="质证完毕"
                    placement="left">
          <el-button type="danger"
                     v-if="tsjc==0"
                     icon="el-icon-finished"
                     circle
                     @click="zzjs"></el-button>
        </el-tooltip>
      </div>
      <div class="yg_panel">
        <div class="jz_wrapper">
          <div class="tags_modal"
               ref="tagWrapper"
               :style="{
                 'top':tagWrapper.y+'px',
                 'left':tagWrapper.x+'px',
                 'width':tagWrapper.width+'px',
                 'height':tagWrapper.height+'px'
                 }">
            <div v-for="(tag, index) in ygtags"
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
          <img :class="imageVertical?'img_vertical':'img_horizontal'"
               ref="jzImage"
               v-if="img.src != null"
               :src="img.src"
               alt="" />
        </div>
        <div class="tag_wrapper">
          <div class="tag_wrapper_header">
            <i class="yg_dot"
               style=" display:inline-block;
               width:1.125rem;
               height:1.125rem;
               border-radius:50%;
               background-color:rgba(254, 97, 89);
               vertical-align:middle;
               margin-right:10px;"></i>
            <span>{{yg.ssdw}}标注</span>
          </div>
          <div class="dsr_name">
            <el-scrollbar class="my_scroll"
                          style="height:100%;">{{ yg.mc }}
            </el-scrollbar>
          </div>
          <div class="tag_list">
            <el-scrollbar class="my_scroll"
                          style="height:100%;">
              <div :class="{ tag_li: true, actived: m.id === activedTagKey }"
                   v-for="(m, i) in ygtags"
                   :key="m.id"
                   @mouseover="activeTag(m.id)"
                   @mouseleave="unActiveTag">
                <p class="tag_content">
                  <span class="tag_xh_yg">{{ i + 1 }}</span> {{ m.content }}
                </p>
                <p class="tag_time"
                   style="color:#b3b7be">
                  <i class="el-icon-time"
                     style="margin:5px;"></i> {{ m.bzsj }}
                </p>
              </div>
            </el-scrollbar>
          </div>
          <div class="confirm_status">
            <span v-if="currentJz.ygConfirm">
              <span class="confirm_yes"></span> 已确认
            </span>
            <span v-else> <span class="confirm_no"></span> 未确认 </span>
          </div>
        </div>
      </div>
      <div class="bg_panel">
        <div class="jz_wrapper">
          <div class="tags_modal"
               ref="tagWrapper"
               :style="{
                 'top':tagWrapper.y+'px',
                 'left':tagWrapper.x+'px',
                 'width':tagWrapper.width+'px',
                 'height':tagWrapper.height+'px',
                 }">
            <div v-for="(tag, index) in bgtags"
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
          <img :class="imageVertical?'img_vertical':'img_horizontal'"
               ref="jzImage"
               v-if="img.src != null"
               :src="img.src"
               alt="" />
        </div>
        <div class="tag_wrapper">
          <div class="tag_wrapper_header">
            <i class="bg_dot"
               style=" display:inline-block;
               width:1.125rem;
               height:1.125rem;
               border-radius:50%;
               background-color:rgba(40, 207, 67);
               vertical-align:middle;
               margin-right:10px;"></i>
            <span style="vertical-align:middle;">{{bg.ssdw}}标注</span>
          </div>
          <div class="dsr_name">
            <el-scrollbar class="my_scroll"
                          style="height:100%;">{{ bg.mc }}
            </el-scrollbar>
          </div>
          <div class="tag_list">
            <el-scrollbar class="my_scroll"
                          style="height:100%;">
              <div :class="{ tag_li: true, actived: m.id === activedTagKey }"
                   v-for="(m, i) in bgtags"
                   :key="m.id"
                   @mouseover="activeTag(m.id)"
                   @mouseleave="unActiveTag">
                <p class="tag_content">
                  <span class="tag_xh_bg">{{ i + 1 }}</span> {{ m.content }}
                </p>
                <p class="tag_time"
                   style="color:#b3b7be">
                  <i class="el-icon-time"
                     style="margin:5px;"></i> {{ m.bzsj }}
                </p>
              </div>
            </el-scrollbar>
          </div>
          <div class="confirm_status">
            <span v-if="currentJz.bgConfirm">
              <span class="confirm_yes"></span> 已确认
            </span>
            <span v-else> <span class="confirm_no"></span> 未确认 </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import JzTree from "../common/JzTree";
import { mapGetters, mapActions } from "vuex";
import WsCommand from "@/utils/Command";
import CommandEnum from "@/utils/CommandEnum";
export default {
  components: {
    JzTree
  },
  data() {
    return {
      caseSn: sessionStorage.getItem("KEY_CASE_SN"),
      ah: sessionStorage.getItem("KEY_AH"),
      courtNo: sessionStorage.getItem("KEY_COURT_NO"),
      roleid: sessionStorage.getItem("KEY_ROLE"),
      xh: sessionStorage.getItem("KEY_XH"),
      bajz: {
        default: null,
        url: this.$api.bajz.tree,
        params: {
          caseSn: sessionStorage.getItem("KEY_CASE_SN"),
          courtno: sessionStorage.getItem("KEY_COURT_NO"),
          zjml: true,
          jjml: false,
          filter: true,
          jb: null,
          ajSn: null
        },
        jbOption: []
      },
      treeData: [],
      tags: [],
      currentJzId: "",
      expandKeys: [],
      allLeafArray: [],
      tagWrapper: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      },
      yg: {
        ssdw: "",
        mc: ""
      },
      bg: {
        ssdw: "",
        mc: ""
      },
      img: {
        width: 0,
        height: 0,
        src: null
      },
      rotate: 0,
      activedTagKey: null,
      leftArrowTimer: undefined,
      rightArrowTimer: undefined,
      searchPanelVisiable: false,
      searchQ: "",
      searchResult: null
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
    imageVertical() {
      return this.img.width <= this.img.height;
    },
    currentJz() {
      if (this.currentJzId == "") {
        return {};
      }
      const temp = this.allLeafArray.find(_ => _ && _.id == this.currentJzId);
      return !temp ? {} : temp;
    },
    ajSn() {
      return this.bajz.params.ajSn;
    },
    currentTreeIndex() {
      if (this.currentJzId == "") {
        return -1;
      }
      return this.allLeafArray.findIndex(_ => _ && _.id == this.currentJzId);
    }
  },
  watch: {
    treeData(value) {
      if (value && value.length > 0) {
        this.allLeafArray = [];
        this.findAllLeafNode(value);
      }
    },
    currentJzId(value) {
      if (!value) {
        return;
      }
      // 滚动该图片到可视区域
      const currentJzDom = document.querySelector("#tree-node-" + value);
      if (currentJzDom) {
        currentJzDom.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }
      //加载图片
      this.loadImg(value);
      // 切换卷宗图片，加载原被告标注
      this.loadTags(value);
      //切换卷宗，同步当事人屏幕
      this.syncDsrJz(value);
    },
    message(value) {
      this.handleMessage(value);
    }
  },
  methods: {
    ...mapActions(["changeTsjc", "changeWjId", "changeAjSn", "sendCommand"]),
    // 本院卷宗类别
    loadBaJbOption() {
      const url = this.$api.bajz.jb;
      this.$http.get(
        url,
        { courtNo: this.courtNo, caseSn: this.caseSn },
        resp => {
          resp = resp.filter(_ => _.value == "001");
          this.bajz.jbOption = resp;
          if (resp.length > 0) {
            this.bajz.params.jb = resp[0].value;
            const defaultAjsn =
              this.tsjc == "0" && this.storeAjSn
                ? this.storeAjSn
                : resp[0].ajSn;
            const defaultWjId =
              this.tsjc == "0" && this.storeWjId ? this.storeWjId : null;
            this.bajz.default = defaultWjId;
            this.bajz.params.ajSn = defaultAjsn;
          }
        }
      );
    },
    loadImg(value) {
      // 显示图片
      const img = new Image();
      img.src = `${this.$api.bajz.download}?courtNo=${
        this.courtNo
      }&wjId=${value}&rotate=${this.rotate}&r=${Math.random()}`;
      this.img.src = img.src;
      img.onload = e => {
        this.img.width = img.width;
        this.img.height = img.height;
        // resize tag wrapper
        this.$nextTick(_ => this.resizeTagWrapper());
      };
    },
    handleRotate() {
      let url = this.$api.imgRotate;
      let ajSn = this.ajSn;
      let caseSn = this.caseSn;
      let courtNo = this.courtNo;
      let degree = "90";
      let sfys = "false";
      let userId = sessionStorage.KEY_USER_ID;
      let userName = sessionStorage.KEY_USER_NAME;
      let wjId = this.currentJzId;
      this.$http.get(
        url,
        {
          ajSn,
          caseSn,
          courtNo,
          degree,
          sfys,
          userId,
          userName,
          wjId
        },
        res => {
          if (res.success) {
            this.rotate += 1;
            this.loadImg(wjId);
            this.syncDsrImg();
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    receiveTreeResult(res) {
      //渲染完后，清空默认值
      const jz = this.bajz;
      jz.default = null;
      this.treeData = res;
    },
    handleTreeNodeClick(data, node) {
      const wjid = data.id;
      if (wjid.indexOf("-") > -1) {
        return;
      }
      this.currentJzId = wjid;
    },
    findAllLeafNode(arr) {
      if (Array.isArray(arr)) {
        arr.forEach(item => {
          if (item.isLeaf) {
            this.allLeafArray.push(item);
          } else {
            this.findAllLeafNode(item.children);
          }
        });
      }
    },
    //切换卷别
    changeJb(jb, ajSn, jzType) {
      this[jzType].params.jb = jb;
      this[jzType].params.ajSn = ajSn;
      this.loadJzData(jzType);
    },
    chooseBajzJb({ name }) {
      const arr = name.split("_");
      const jb = arr[0];
      const ajSn = arr[1];
      if (this.bajz.params.jb == jb && this.bajz.params.ajSn == ajSn) {
        return;
      }
      this.changeJb(jb, ajSn, "bajz");
    },
    // 加载本案卷宗，切换卷别时触发
    loadJzData(jzType) {
      const tree = this.$refs[jzType + "Tree"];
      if (tree) {
        tree.loadData();
      }
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
    activeTag(id) {
      this.activedTagKey = id;
    },

    unActiveTag() {
      this.activedTagKey = null;
    },
    handleLeftArrowClick() {
      if (this.currentTreeIndex == 0) {
        this.$message.warning("已到达首页");
        return;
      }
      this.setTreeCurrentKey(this.currentTreeIndex - 1);
    },
    handleRightArrowClick() {
      if (this.currentTreeIndex == this.allLeafArray.length - 1) {
        this.$message.warning("已到达尾页");
        return;
      }
      this.setTreeCurrentKey(this.currentTreeIndex + 1);
    },
    setTreeCurrentKey(index) {
      const id = this.allLeafArray[index].id;
      this.expandKeys.pop();
      this.expandKeys.push(id);
      this.$refs.bajzTree.setCurrentKey(id);
    },
    syncDsrDzzz() {
      if (this.tsjc == null) {
        const params = [{ key: "a", value: "a" }];
        const dzzzSyncCmd = new WsCommand(
          "DZZZ_START",
          this.roleid,
          "",
          params
        );
        this.sendCommand(dzzzSyncCmd);
        this.changeTsjc("0");
      }
    },
    syncDsrJz(jzId) {
      if (this.tsjc != "0") {
        return;
      }
      const params = [
        { key: "wjId", value: jzId },
        { key: "ajSn", value: this.ajSn }
      ];
      const jzSyncCmd = new WsCommand(
        "DZZZ_DISPLAY_IMAGE",
        this.roleid,
        "",
        params
      );
      this.sendCommand(jzSyncCmd);
      this.changeAjSn(this.bajz.params.ajSn);
      this.changeWjId(jzId);
    },
    syncDsrImg() {
      if (this.tsjc != "0") {
        return;
      }
      const params = [{ key: "a", value: "a" }];
      const imgSyncCmd = new WsCommand("DZZZ_ROTATE", this.roleid, "", params);
      this.sendCommand(imgSyncCmd);
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
    handleMessage(command) {
      const { cmd, params } = command;
      // 增加标注
      if (cmd == CommandEnum.DZZZ_MARK) {
        const tag = {};
        params.forEach(_ => (tag[_.key] = _.value));
        this.tags.push(tag);
      } else if (cmd == CommandEnum.DZZZ_DELETE_MARK) {
        //删除标注
        const id = params.find(_ => _.key == "id").value;
        this.tags.splice(this.tags.findIndex(_ => _.id == id), 1);
      } else if (cmd == CommandEnum.DZZZ_DSRQR) {
        //卷宗确认
        const wjId = params.find(_ => _.key == "wjId").value;
        const roleid = params.find(_ => _.key == "roleid").value;
        const currentJz = this.allLeafArray.find(_ => _ && _.id == wjId);
        if (currentJz) {
          const confirmKey = roleid == "2" ? "ygConfirm" : "bgConfirm";
          currentJz[confirmKey] = true;
        }
      } else if (cmd == CommandEnum.WS_USERLOGIN) {
        this.getInfo();
      }
    },
    zzjs() {
      // 质证结束
      const url = this.$api.zzjs;
      const params = {
        caseSn: this.caseSn,
        courtNo: this.courtNo,
        pqXh: this.xh
      };
      this.$http.get(url, params, result => {
        const errmsg = result.errmsg;
        if (errmsg) {
          this.$confirm(result.errmsg + "请确认是否继续操作？", "提示信息", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.changeAjSn(null);
            this.changeWjId(null);
            const dzzzEndCmd = new WsCommand("DZZZ_STOP", this.roleid, "", [
              { key: "a", value: "a" }
            ]);
            this.sendCommand(dzzzEndCmd);
            this.$router.replace("zyjd");
          });
        } else {
          this.$router.replace("zyjd");
        }
      });
    },

    showSearchPanel() {
      this.searchPanelVisiable = !this.searchPanelVisiable;
      if (this.searchPanelVisiable) {
        this.$nextTick(_ => {
          setTimeout(() => {
            this.$refs.searchInput.focus();
          }, 500);
        });
      }
    },
    searchJz() {
      if (!this.searchQ) {
        this.searchResult = [];
        return;
      }
      const url = this.$api.qwjs;
      const params = {
        caseSn: this.caseSn,
        courtNo: this.courtNo,
        searchNr: this.searchQ,
        zjml: true
      };
      this.$http.get(url, params, result => {
        this.searchResult = result;
      });
    },
    handleSearchItemClick(jz) {
      const { wjId, ajSn, ajLb, caseSn, ah } = jz;
      if (caseSn == this.caseSn) {
        // 定位本案卷宗
        this.locateBajz(wjId, ajSn, ajLb);
      } else {
        this.locateYsjz(wjId, ajSn, ajLb, caseSn, ah);
      }
      this.searchPanelVisiable = false;
    },
    // 检索结果定位本案卷宗
    locateBajz(wjId, ajSn, ajLb) {
      this.$nextTick(_ => {
        if (this.bajz.params.ajSn == ajSn) {
          this.expandKeys.pop();
          this.expandKeys.push(wjId);
          this.$refs.bajzTree.setCurrentKey(wjId);
        } else {
          this.bajz.default = wjId;
          this.changeJb(ajLb, ajSn, "bajz");
        }
      });
    }
  },
  mounted() {
    // 加载本院卷别选项
    this.loadBaJbOption();
    //法官首次打开电子质证模块，同步当事人屏幕
    this.syncDsrDzzz();
    //获取当事人信息
    this.getInfo();
  },
  destroyed() {
    if (this.leftArrowTimer) {
      clearTimeout(this.leftArrowTimer);
    }
    if (this.rightArrowTimer) {
      clearTimeout(this.rightArrowTimer);
    }
  }
};
</script>

<style scoped>
.dzzz {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
}
.jz_menu_panel {
  width: 520px;
  height: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  background: rgba(22, 41, 61, 1);
  border: 2px solid #21a2f3;
  margin-right: 30px;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}
.menu_header {
  height: 56px;
  font-size: 1.75rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.left_panel {
  height: 100%;
  padding: 20px 0 0 0;
  box-sizing: border-box;
}
.right_panel {
  flex: 1;
  height: 100%;
  padding: 20px 30px 0 0;
  box-sizing: border-box;
  display: flex;
  position: relative;
}
.dzzz_toolbar {
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 20px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  z-index: 100;
  transition: all 0.2s linear;
}
.yg_panel,
.bg_panel {
  flex: 1;
  background: rgba(19, 34, 49, 1);
  border: 2px solid rgba(79, 110, 157, 1);
  height: 100%;
  box-sizing: border-box;
  display: flex;
}
.yg_panel {
  margin-right: 20px;
}
.bg_panel {
  margin-left: 20px;
}
.jz_wrapper {
  width: 680px;
  height: 100%;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}
.tag_wrapper {
  flex: 1;
  border-left: 2px solid rgba(79, 110, 157, 1);
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
  height: 60px;
  padding: 6px;
}
.tag_list {
  height: calc(100% - 130px);
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
.confirm_status {
  text-align: center;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}
.confirm_yes,
.confirm_no {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 100%;
  box-sizing: border-box;
  background: transparent;
}
.confirm_yes {
  background: #28cf43;
}
.confirm_no {
  border: 1px solid #979797;
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
.jz_modal {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 100;
  cursor: not-allowed;
}
.img_vertical {
  height: 100%;
}
.img_horizontal {
  width: 100%;
}
.tags_modal {
  position: absolute;
  width: 0;
  height: 0;
  z-index: 100;
  background: transparent;
  overflow: visible;
  box-sizing: border-box;
  border: 2px dashed transparent;
}
.search_result {
  padding: 10px;
}
.search_item {
  font-size: 1.125rem;
  padding: 8px 30px;
  margin-right: 10px;
  cursor: pointer;
  transition: all 0.2s linear;
  border-top: 1px solid #2d3e5c;
}
.search_item:hover {
  background-color: #027aff;
}
.search_item .svg-icon {
  width: 1.125rem;
  height: 1.125rem;
}
.search_panel {
  width: 100%;
  height: calc(100% - 55px);
  position: absolute;
  background: rgb(44, 58, 84);
  box-shadow: 0px 8px 16px 0px rgba(17, 17, 17, 0.5);
  padding: 20px 10px 0 10px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  z-index: 100;
  box-sizing: border-box;
  top: 55px;
  margin-left: -20px;
}
.search_info {
  text-align: center;
  padding: 20px;
  color: #5b7390;
}
</style>
<style>
.my_scroll .el-scrollbar__wrap {
  overflow-x: hidden;
}
.dzzz_toolbar .el-button {
  font-size: 1.125rem;
}
.dzzz_toolbar .el-button + .el-button {
  margin-left: 0;
  margin-top: 12px;
}
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
.search_input input {
  text-align: center;
  font-size: 1rem;
  background: transparent;
  border-color: #22a5f7;
  color: #fff;
}
.search_input .el-input__inner:hover {
  border-color: #22a5f7;
}
.search_input .el-input.is-active .el-input__inner,
.search_input .el-input__inner:focus {
  border-color: #22a5f7;
}
.search_input .el-input-group__append {
  border-left: 0;
  border-color: #22a5f7;
  background-color: #22a5f7;
  font-size: 1.4rem;
  color: #fff;
}
</style>
