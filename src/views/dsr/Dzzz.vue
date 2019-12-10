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
        <div v-if="modalEnable"
             class="jz_modal"
             @click="handleModalClick"></div>
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
      <div class="dsr_panel">
        <div class="jz_wrapper">
          <div v-if="tsjc=='0'"
               class="tag_toggle"
               @click="addTag">
            <svg-icon :icon-class="newTagWorking?'endtag':'tag'">
            </svg-icon>
            <p style="font-size:14px;padding:3px;">{{newTagWorking?'退出标注':'开始标注'}}</p>
          </div>
          <div class="tags_modal"
               :style="{
                 'top':tagWrapper.y+'px',
                 'left':tagWrapper.x+'px',
                 'width':tagWrapper.width+'px',
                 'height':tagWrapper.height+'px',
                 'borderColor':'transparent',
                 'cursor':'pointer',
                 'opacity':newTagWorking?0.3:1
                 }">
            <div v-for="(tag, index) in self"
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
              <span class="tag_corner tag_delete_corner"
                    @click="deleteTag(tag.id)">
                <i class="el-icon-delete"></i>
              </span>
            </div>
            <div v-for="(tag, index) in other"
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
          <div class="tags_modal"
               v-if="newTagWorking"
               :style="{
                 'top':tagWrapper.y+'px',
                 'left':tagWrapper.x+'px',
                 'width':tagWrapper.width+'px',
                 'height':tagWrapper.height+'px',
                 'borderColor':'#21a2f3',
                 'cursor':'crosshair',
                 'z-index':105
                 }"
               @mousedown.prevent="createNewTag"
               @mousemove.prevent="resizeNewTag"
               @mouseup.prevent="endNewTag"
               @touchstart="createNewTagByTouch"
               @touchmove="resizeNewTagByTouch"
               @touchend="endNewTag">
            <div class="tag new_tag"
                 v-if="newTag!=null"
                 :style="{'top':newTag.posY+'px','left':newTag.posX+'px','width':newTag.width+'px','height':newTag.height+'px'}"></div>
          </div>
          <img :class="imageVertical?'img_vertical':'img_horizontal'"
               ref="jzImage"
               v-if="img.src != null"
               :src="img.src"
               alt="" />
        </div>
        <div class="tag_wrapper">
          <div class="tag_wrapper_header">
            标注列表
          </div>
          <div class="dsr_name">
            <el-scrollbar class="my_scroll"
                          style="height:100%;">
              <p class="dsr_info">
                <i class="yg_dot"></i>
                {{ yg.ssdw}}:{{yg.mc}}
              </p>
              <p class="dsr_info">
                <i class="bg_dot"></i>
                <span v-show="bg.ssdw">{{bg.ssdw}}:{{bg.mc}}</span>
              </p>
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
                  <span :class="m.roleid == '2' ? 'tag_xh_yg' : 'tag_xh_bg'">
                    {{ i + 1 }}
                  </span>
                  {{ m.content }}
                </p>
                <p class="tag_time"
                   style="color:#b3b7be">
                  <i class="el-icon-time"
                     style="margin:5px;"></i> {{ m.bzsj }}
                </p>
              </div>
            </el-scrollbar>
          </div>
          <div v-if="currentJzId!=''"
               class="confirm_status">
            <span v-if="jzConfirm">
              <span class="confirm_yes"></span> 已确认
            </span>
            <span v-else-if="tsjc=='0'">
              <el-button type="success"
                         size="medium"
                         icon="el-icon-check"
                         @click="handleJzConfirm(currentJzId)"
                         :loading="jzConfirming">本页确认</el-button>
            </span>
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
      roleid: sessionStorage.getItem("KEY_ROLE"),
      courtNo: sessionStorage.getItem("KEY_COURT_NO"),
      userid: sessionStorage.getItem("KEY_USERID"),
      username: sessionStorage.getItem("KEY_USER_NAME"),
      bajz: {
        default: null,
        url: this.$api.bajz.tree,
        params: {
          caseSn: sessionStorage.getItem("KEY_CASE_SN"),
          courtno: sessionStorage.getItem("KEY_COURT_NO"),
          zjml: true,
          jjml: false,
          filter: true,
          jb: "001",
          ajSn: null
        },
        jbOption: []
      },
      treeData: [],
      currentJzId: "",
      expandKeys: [],
      allLeafArray: [],
      tags: [],
      newTag: null,
      newTagWorking: false,
      activedTagKey: null,
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
      jzConfirming: false,
      searchPanelVisiable: false,
      searchQ: "",
      searchResult: null,
      modalTimer: null
    };
  },
  computed: {
    ...mapGetters(["tsjc", "storeWjId", "storeAjSn", "message"]),
    self() {
      return this.tags.filter(_ => _ && _.roleid == this.roleid);
    },
    other() {
      return this.tags.filter(_ => _ && _.roleid != this.roleid);
    },
    imageVertical() {
      return this.img.width <= this.img.height;
    },
    jzConfirm() {
      const currentJz = this.allLeafArray.find(
        _ => _ && _.id == this.currentJzId
      );
      if (!currentJz) return false;
      const confirmKey = this.roleid == "2" ? "ygConfirm" : "bgConfirm";
      return Boolean(currentJz[confirmKey]);
    },
    modalEnable() {
      return this.tsjc == "0";
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
      this.loadImg(value);
      // 切换卷宗图片，加载原被告标注
      this.loadTags(value);
      this.newTagWorking = false;
    },
    message(value) {
      this.handleMessage(value);
    }
  },
  methods: {
    ...mapActions(["changeWjId", "changeAjSn", "sendCommand"]),
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
            this.bajz.params.jb = "001";
            const defaultAjsn = this.storeAjSn ? this.storeAjSn : resp[0].ajSn;
            const defaultWjId = this.storeWjId ? this.storeWjId : null;
            this.bajz.default = defaultWjId;
            this.bajz.params.ajSn = defaultAjsn;
            this.changeAjSn(null);
            this.changeWjId(null);
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
    addTag() {
      this.newTag = null;
      this.newTagWorking = !this.newTagWorking;
      if (this.newTagWorking) {
        this.$message.info("请在虚线范围内进行标注。");
      }
    },
    deleteTag(id) {
      this.$confirm("是否确定要删除这个标注?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.sendTagDeleteCmd(id);
        })
        .catch(() => {});
    },
    createNewTag(e) {
      if (!this.newTagWorking) return;
      const posX = e.offsetX === undefined ? e.layerX : e.offsetX;
      const posY = e.offsetY === undefined ? e.layerY : e.offsetY;

      if (!this.newTag) {
        this.newTag = {
          posX,
          posY,
          width: 0,
          height: 0
        };
      }
    },
    createNewTagByTouch(e) {
      if (!this.newTagWorking) return;

      const touches = e.touches;
      if (!touches) return;
      e = touches[0];

      const tagWrapperRect = this.$refs.jzImage.getBoundingClientRect();
      const posX = e.pageX - tagWrapperRect.left;
      const posY = e.pageY - tagWrapperRect.top;

      if (!this.newTag) {
        this.newTag = {
          posX,
          posY,
          width: 0,
          height: 0
        };
      }
    },
    resizeNewTag(e) {
      if (!this.newTagWorking || !this.newTag) {
        return;
      }
      let { posX, posY } = this.newTag;
      let ex = e.offsetX === undefined ? e.layerX : e.offsetX;
      let ey = e.offsetY === undefined ? e.layerY : e.offsetY;
      if (!this.newTag) return;
      this.newTag.width = Math.max(1, ex - posX);
      this.newTag.height = Math.max(1, ey - posY);
    },
    resizeNewTagByTouch(e) {
      if (!this.newTagWorking || !this.newTag) {
        return;
      }

      const touches = e.touches;
      if (!touches) return;
      e = touches[0];

      let { posX, posY } = this.newTag;
      const tagWrapperRect = this.$refs.jzImage.getBoundingClientRect();
      let ex = e.pageX - tagWrapperRect.left;
      let ey = e.pageY - tagWrapperRect.top;
      if (!this.newTag) return;
      this.newTag.width = Math.max(1, ex - posX);
      this.newTag.height = Math.max(1, ey - posY);
    },
    endNewTag(e) {
      if (!this.newTagWorking || !this.newTag) {
        return;
      }
      if (this.newTag.width < 20 || this.newTag.height < 20) {
        this.$message.warning("标注区域过小！");
        this.newTag = null;
        return;
      }
      this.$prompt("请输入标注内容", "卷宗标注", {
        confirmButtonText: "确定",
        cancelButtonText: "重新画选",
        inputPattern: /^.{1,100}$/,
        inputErrorMessage: "请输入标注内容，100字以内"
      })
        .then(({ value }) => {
          if (!this.newTagWorking) {
            this.$message.warning("保存失败，请重新标注");
            return;
          }
          this.saveNewTag(value);
        })
        .catch(() => {
          this.newTagWorking = true;
          this.newTag = null;
        });
    },
    saveNewTag(content) {
      const url = this.$api.tags.save + "?courtno=" + this.courtNo;
      const pageHeight = this.tagWrapper.height;
      const pageWidth = this.tagWrapper.width;
      const posX = (this.newTag.posX * 100.0) / pageWidth;
      const posY = (this.newTag.posY * 100.0) / pageHeight;
      const width = (this.newTag.width * 100.0) / pageWidth;
      const height = (this.newTag.height * 100.0) / pageHeight;
      const tagParam = {
        content,
        height,
        pageHeight,
        pageWidth,
        posX,
        posY,
        roleid: this.roleid,
        userid: this.userid,
        username: this.username,
        width,
        wjId: this.currentJzId
      };
      this.sendTagCmd(tagParam);
      this.newTag = null;
      this.newTagWorking = false;
    },
    handleJzConfirm(wjId) {
      const confirm = {
        roleid: this.roleid,
        userid: this.userid,
        username: this.username,
        wjId
      };
      const params = Object.keys(confirm).map(key => {
        return {
          key: key,
          value: confirm[key]
        };
      });
      const tagConfirmCmd = new WsCommand("DZZZ_DSRQR", "0", "", params);
      this.jzConfirming = true;
      this.sendCommand(tagConfirmCmd);
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
      // 法官控制切换图片
      if (cmd == CommandEnum.DZZZ_DISPLAY_IMAGE) {
        const ajSn = params.find(_ => _.key == "ajSn").value;
        const wjId = params.find(_ => _.key == "wjId").value;
        this.switchJz(ajSn, wjId);
      } else if (cmd == CommandEnum.DZZZ_MARK) {
        // 增加标注
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
        if (this.roleid == roleid) {
          this.jzConfirming = false;
        }
      } else if (cmd == CommandEnum.DZZZ_ROTATE) {
        this.rotate += 1;
        this.loadImg(this.currentJzId);
      } else if (cmd == CommandEnum.WS_USERLOGIN) {
        this.getInfo();
      }
    },
    switchJz(ajSn, wjId) {
      if (this.bajz.jbOption.length < 1) {
        this.changeAjSn(ajSn);
        this.changeWjId(wjId);
        this.currentJzId = wjid;
      } else {
        // 无需切换卷别
        if (ajSn == this.bajz.params.ajSn) {
          this.expandKeys.pop();
          this.expandKeys.push(wjId);
          this.$refs.bajzTree.setCurrentKey(wjId);
        } else {
          // 切换卷别
          this.bajz.default = wjId;
          const jb = this.bajz.params.jb;
          this.changeJb(jb, ajSn, "bajz");
        }
      }
    },
    //发送增加标注命令
    sendTagCmd(tag) {
      const params = Object.keys(tag).map(key => {
        return {
          key: key,
          value: tag[key]
        };
      });
      const tagCmd = new WsCommand("DZZZ_MARK", "0", "", params);
      this.sendCommand(tagCmd);
    },
    // 发送标注删除命令
    sendTagDeleteCmd(id) {
      const params = [{ key: "id", value: id }];
      const tagDeleteCmd = new WsCommand("DZZZ_DELETE_MARK", "0", "", params);
      this.sendCommand(tagDeleteCmd);
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
    },
    handleModalClick() {
      if (this.modalTimer) {
        clearTimeout(this.modalTimer);
        this.$message.closeAll();
      }
      this.modalTimer = setTimeout(() => {
        this.$message.warning("质证过程中，只能由法官进行操作");
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
}
.dsr_panel {
  flex: 1;
  background: rgba(19, 34, 49, 1);
  height: 100%;
  box-sizing: border-box;
  border: 2px solid rgba(79, 110, 157, 1);
  display: flex;
}
.jz_wrapper {
  width: 980px;
  height: 100%;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}
.tag_toggle {
  position: absolute;
  right: 10px;
  top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(192, 220, 255);
  flex-direction: column;
  cursor: pointer;
  z-index: 110;
}
.tag_toggle:hover {
  color: #fff;
}
.tag_toggle .svg-icon {
  width: 1.6rem;
  height: 1.6rem;
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
  height: 100px;
  padding: 6px;
}
.tag_list {
  height: calc(100% - 195px);
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
  background: rgba(254, 97, 89);
}
.tag_xh_bg {
  background: rgba(40, 207, 67);
}
.confirm_status {
  text-align: center;
  height: 50px;
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
  border: 1px dashed #333;
}
.tag.tag_yg {
  background: rgba(254, 97, 89, 0.3);
}
.tag.tag_bg {
  background: rgba(40, 207, 67, 0.3);
}
.new_tag {
  transition: none;
  -moz-transition: none;
  border: 1px dashed #333;
  background-color: rgba(0, 29, 83, 0.3);
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
.tag_delete_corner {
  position: absolute;
  right: 0;
  top: 0;
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
.dsr_info {
  padding: 0 2px;
  display: flex;
  align-items: center;
}
.yg_dot,
.bg_dot {
  width: 16px;
  height: 16px;
  border-radius: 100%;
  display: inline-block;
  margin-right: 6px;
}
.yg_dot {
  background: rgba(254, 97, 89);
}
.bg_dot {
  background: rgba(40, 207, 67);
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