<template>
  <div class="zhyj">
    <div class="left_panel">
      <bl v-if="isTstg"></bl>
      <jl v-if="!isTstg"></jl>
    </div>
    <div class="right_panel">
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
                          v-loading="searchLoading"
                          element-loading-text="搜索中"
                          element-loading-spinner="el-icon-loading"
                          element-loading-background="rgba(0, 0, 0, 0.2)"
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
          <i v-if="currentTab != 'sfws'"
             class="el-icon-search"
             style="cursor:pointer"
             @click="showSearchPanel"></i>
        </div>
        <el-radio-group v-model="currentTab">
          <el-radio-button label="bajz">本案卷宗</el-radio-button>
          <el-radio-button label="ysjz">原审卷宗</el-radio-button>
          <el-radio-button label="sfws">审判文档</el-radio-button>
        </el-radio-group>
        <div v-show="currentTab === 'bajz'"
             class="tab_wrapper">
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
                        style="height:calc(100% - 60px);margin-right:-10px;">
            <jz-tree v-if="bajz.params.ajSn != null"
                     ref="bajzTree"
                     :url="bajz.url"
                     :params="bajz.params"
                     :defaultOnlyLeaf="true"
                     :defaultNodeKey="bajz.default"
                     :defaultExpandKeys="expandKeys"
                     @nodeClick="handleTreeNodeClick"
                     @passTreeResult="receiveTreeResult"></jz-tree>
          </el-scrollbar>
        </div>
        <div v-if="ysList != null"
             v-show="currentTab === 'ysjz'"
             class="tab_wrapper">
          <div class="ys_chooser">
            <el-dropdown v-if="ysKey"
                         split-button
                         type="primary">
              {{ ysAh }}
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="ys in ysList"
                                  :key="ys.ah + '_' + ys.caseSn"
                                  @click.native="
                    _ => {
                      ysKey = ys.ah + '_' + ys.caseSn;
                      ysAh = ys.ah;
                    }
                  ">
                  {{ ys.ah }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <el-tabs :value="ysjz.params.jb + '_' + ysjz.params.ajSn"
                   class="jz_tab"
                   stretch
                   @tab-click="chooseYsjzJb">
            <el-tab-pane v-for="jb in ysjz.jbOption"
                         :key="jb.value + '_' + jb.ajSn"
                         :label="jb.text"
                         :name="jb.value + '_' + jb.ajSn">
            </el-tab-pane>
          </el-tabs>
          <el-scrollbar class="my_scroll"
                        style="height:calc(100% - 100px);margin-right:-10px;">
            <jz-tree v-if="ysjz.params.ajSn != null"
                     ref="ysjzTree"
                     :url="ysjz.url"
                     :params="ysjz.params"
                     :defaultOnlyLeaf="true"
                     :defaultNodeKey="ysjz.default"
                     :defaultExpandKeys="expandKeys"
                     @nodeClick="handleTreeNodeClick"
                     @passTreeResult="receiveTreeResult"></jz-tree>
          </el-scrollbar>
        </div>
        <div v-if="wsList != null"
             v-show="currentTab === 'sfws'"
             class="tab_wrapper">
          <ul class="ws_list">
            <el-scrollbar class="my_scroll"
                          style="height:100%;">
              <li class="list"
                  v-for="(item,index) in wsList"
                  :key="item.caseSn">
                <div v-if="item.children">
                  <span v-for="(itemChild,indexChild) in item.children"
                        :key="indexChild"
                        :class="{list_item:true,list_active:isActive==String(index)+String(indexChild)}"
                        @click="handleWsListChildClick(index,indexChild)">
                    <p class="item_ah">{{item.ah}}</p>
                    <p class="item_name">
                      <svg-icon icon-class="title"
                                class-name="title"></svg-icon>
                      {{itemChild.name}}
                    </p>
                    <p class="time">
                      <svg-icon icon-class="time"
                                class-name="time"></svg-icon>
                      {{itemChild.zzsj}}
                    </p>
                  </span>
                </div>
              </li>
            </el-scrollbar>
          </ul>
        </div>
      </div>
      <div v-if="centerPanel == 'jzPanel'"
           class="image_panel"
           v-loading="imageLoading"
           element-loading-text="加载中"
           element-loading-spinner="el-icon-loading"
           element-loading-background="rgba(0, 0, 0, 0.6)">
        <div class="image_wrapper">
          <img ref="jzImage"
               v-if="currentJzId != ''"
               :src="dzjzSrc"
               alt="" />
        </div>
        <div class="thumb_wrapper"
             v-loading="scrollUpLoading"
             element-loading-text="加载中"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.6)">
          <el-scrollbar class="my_scroll"
                        style="height:100%;">
            <ul class="thumb_ul"
                v-scrollup="scrollUpHandler"
                v-infinite-scroll="scrollDownHandler"
                infinite-scroll-immediate="false">
              <li class="thumb_li"
                  v-for="t in thumbs"
                  :key="t.id">
                <img :id="'thumb' + t.id"
                     :class="{ thumb_selected: currentJzId == t.id }"
                     :src="
                    currentTab === 'ysjz'
                      ? `${$api.ysjz.download}?caseSn=${ysjz.params.caseSn}&wjId=${t.id}&r=${Math.random()}`
                      : `${$api.bajz.download}?courtNo=${courtNo}&wjId=${t.id}&r=${Math.random()}`
                  "
                     alt=""
                     @click="handleThumbClick(t)" />
                <p class="thumb_label">{{ t.label }}</p>
              </li>
            </ul>
          </el-scrollbar>
        </div>
      </div>
      <div v-else-if="centerPanel == 'wsPanel'"
           class="ws_panel"
           v-loading="wsHtmlLoading"
           element-loading-text="加载中"
           element-loading-spinner="el-icon-loading"
           element-loading-background="rgba(0, 0, 0, 0.2)">
        <div class="wsimg_display"
             ref="img_scroll"
             v-if="wsListImg">
          <div class="img_box"
               v-for="(item,index) in wsListImg"
               :key="index">
            <img :src="spwdPrefix+'?path='+item.path+'&wjId='+item.id"
                 alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Bl from "../common/Bl";
import Jl from "../common/Jl";
import { mapState } from "vuex";
import JzTree from "../common/JzTree";
import { getScrollContainer } from "@/utils/dom";
const zj = "001";
const size = 20;
export default {
  components: {
    Bl,
    Jl,
    JzTree
  },
  directives: {
    scrollup: {
      // 指令的定义
      inserted(el, binding, vnode) {
        const onScroll = function(event) {
          if (event.target.scrollTop <= 0) {
            binding.value.call();
          }
        };

        const container = getScrollContainer(el, true);
        if (container) {
          container.addEventListener("scroll", onScroll);
        }
      }
    }
  },
  data() {
    return {
      caseSn: sessionStorage.getItem("KEY_CASE_SN"),
      courtNo: sessionStorage.getItem("KEY_COURT_NO"),
      ah: sessionStorage.getItem("KEY_AH"),
      currentTab: "bajz",
      centerPanel: "jzPanel",
      bajz: {
        default: null,
        url: this.$api.bajz.tree,
        params: {
          courtno: sessionStorage.getItem("KEY_COURT_NO"),
          caseSn: sessionStorage.getItem("KEY_CASE_SN"),
          ajSn: null,
          jjml: false,
          // zjml: false,
          filter: true,
          jb: zj
        },
        treeData: [],
        currentJzId: "",
        jbOption: []
      },
      ysList: null,
      defaultYsKey: null,
      defaultYsJb: null,
      defaultYsAjSn: null,
      ysKey: null,
      ysAh: null,
      ysjz: {
        default: null,
        url: this.$api.ysjz.tree,
        params: {
          caseSn: null,
          ajSn: null,
          ah: null,
          jb: zj,
          filter: true,
          zjml: false
        },
        treeData: [],
        currentJzId: "",
        jbOption: []
      },
      expandKeys: [],
      allLeafArray: [],
      sfws: {},
      wsList: null,
      wsListImg: [],
      isActive: null,
      wsHtml: "",
      wsHtmlLoading: false,
      searchLoading: false,
      searchPanelVisiable: false,
      searchQ: "",
      searchResult: null,
      thumbs: [],
      imageLoading: false,
      scrollUpLoading: false,
      spwdPrefix: process.env.VUE_APP_API_SERVER + this.$api.loadWsImg
    };
  },
  computed: {
    dzjzSrc() {
      if (this.currentTab === "ysjz") {
        return `${this.$api.ysjz.download}?caseSn=${
          this.ysjz.params.caseSn
        }&wjId=${this.currentJzId}&r=${Math.random()}`;
      } else {
        return `${this.$api.bajz.download}?courtNo=${this.courtNo}&wjId=${
          this.currentJzId
        }&r=${Math.random()}`;
      }
    },
    treeData() {
      return this[this.currentTab].treeData;
    },
    currentJzId() {
      return this[this.currentTab].currentJzId;
    },
    ...mapState({
      isTstg: "isTstg"
    })
  },
  watch: {
    // 切换tab，加载数据
    currentTab(value, oldValue) {
      if (value === "ysjz" && this.ysList === null) {
        this.loadYsList();
      } else if (value === "sfws" && this.wsList === null) {
        this.loadWsList();
      }
      //中间panel 显示内容
      if (value === "bajz" || value === "ysjz") {
        this.centerPanel = "jzPanel";
      } else {
        this.centerPanel = "wsPanel";
      }
    },
    treeData(value) {
      if (value && value.length > 0) {
        this.allLeafArray = [];
        this.findAllLeafNode(value);
      }
    },
    async ysKey(value) {
      if (!value) {
        return;
      }
      const arr = value.split("_");
      this.ysjz.jbOption = [];
      const [ah, caseSn] = arr;
      await this.loadYsJbOption(caseSn, ah);
      this.ysjz.params.caseSn = caseSn;
      this.ysjz.params.ah = ah;
      if (this.ysjz.jbOption.length > 0) {
        const firstJb = this.ysjz.jbOption[0];
        const ajSn = this.defaultYsAjSn ? this.defaultYsAjSn : firstJb.ajSn;
        this.defaultYsAjSn = null;
        const jb = this.defaultYsJb ? this.defaultYsJb : firstJb.jb;
        this.defaultYsJb = null;
        this.changeJb(jb, ajSn, "ysjz");
      }
    },
    currentJzId(value) {
      if (!value) {
        this.thumbs = [];
        return;
      }
      if (this.thumbs.findIndex(_ => _.id == value) > -1) {
        document.querySelector("#thumb" + value).scrollIntoView({
          block: "center"
        });
        return;
      }
      this.imageLoading = true;
      // 手动切换卷宗图片时，前后找10张本目录图片显示为缩略图
      // 本目录卷宗
      const mlData = this.allLeafArray.find(_ => _.id == value).parent.children;
      const index = mlData.findIndex(_ => _.id == value);
      const startIndex = Math.max(0, index - 10);
      const endIndex = Math.min(mlData.length, index + 10);
      this.thumbs = mlData.slice(startIndex, endIndex);
      // 缩略图加载完后，定位当前卷宗的缩略图
      const lastThumbId = this.thumbs[this.thumbs.length - 1].id;
      this.$nextTick(_ => {
        const img = new Image();
        img.onload = e => {
          this.imageLoading = false;
          const thumbDom = document.querySelector("#thumb" + value);
          if (thumbDom) {
            thumbDom.scrollIntoView({
              block: "center"
            });
          }
        };
        if (this.currentTab === "ysjz") {
          img.src = `${this.$api.ysjz.download}?caseSn=${
            this.ysjz.params.caseSn
          }&wjId=${value}&r=${Math.random()}`;
        } else {
          img.src = `${this.$api.bajz.download}?courtNo=${
            this.courtNo
          }&wjId=${value}&r=${Math.random()}`;
        }
      });
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
          this.bajz.jbOption = resp;
          if (resp.length > 0) {
            this.bajz.params.jb = resp[0].value;
            this.bajz.params.ajSn = resp[0].ajSn;
          }
        }
      );
    },
    // 原审卷宗类别
    async loadYsJbOption(caseSn, ah) {
      const url = this.$api.ysjz.jb;
      this.$http.get(url, { caseSn, ah }, resp => {
        this.ysjz.jbOption = resp;
        if (resp.length > 0) {
          this.ysjz.params.jb = resp[0].value;
          this.ysjz.params.ajSn = resp[0].ajSn;
        }
      });
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
    chooseYsjzJb({ name }) {
      const arr = name.split("_");
      const jb = arr[0];
      const ajSn = arr[1];
      if (this.ysjz.params.jb == jb && this.ysjz.params.ajSn == ajSn) {
        return;
      }
      this.changeJb(jb, ajSn, "ysjz");
    },
    // 加载本案卷宗，切换卷别时触发
    loadJzData(jzType) {
      const tree = this.$refs[jzType + "Tree"];
      if (tree) {
        tree.loadData();
      }
    },
    handleTreeNodeClick(data) {
      const wjid = data.id;
      if (wjid.indexOf("-") > -1) {
        return;
      }
      this[this.currentTab].currentJzId = wjid;
    },
    receiveTreeResult(res) {
      //渲染完后，清空默认值
      const jz = this[this.currentTab];
      jz.default = null;
      jz.treeData = res;
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
    loadYsList() {
      const url = this.$api.ysjz.cases;
      this.$http.get(url, { caseSn: this.caseSn }, result => {
        this.ysList = result;
        if (result.length > 0) {
          const ys1 = result[0];
          this.ysKey = this.defaultYsKey
            ? this.defaultYsKey
            : ys1.ah + "_" + ys1.caseSn;
          this.defaultYsKey = null;
          const arr = this.ysKey.split("_");
          this.ysAh = arr[0];
          this.ysjz.params.caseSn = arr[1];
          this.ysjz.params.ah = arr[0];
        }
      });
    },
    loadWsList() {
      const url = this.$api.spws.tree;
      this.$http.get(
        url,
        { ah: sessionStorage.KEY_AH, caseSn: sessionStorage.KEY_CASE_SN },
        res => {
          this.wsList = res;
          this.handleWsListChildClick(0, 0);
        }
      );
    },
    handleWsListChildClick(parentIndex, childIndex) {
      this.wsListImg = this.wsList[parentIndex].children[childIndex].children;
      this.isActive = String(parentIndex) + String(childIndex);
      if (this.$refs["img_scroll"] && this.$refs["img_scroll"].scrollTop) {
        this.$refs["img_scroll"].scrollTop = 0;
      }
    },
    showSearchPanel() {
      this.searchPanelVisiable = !this.searchPanelVisiable;
      if (this.searchPanelVisiable) {
        this.$nextTick(_ => {
          setTimeout(() => {
            this.$refs.searchInput.focus();
            this.$refs.searchInput.$refs.input.addEventListener(
              "keydown",
              e => {
                if (e.key == "Enter") {
                  this.searchJz();
                  this.$refs.searchInput.blur();
                }
              },
              true
            );
          }, 500);
        });
      }
    },
    searchJz() {
      if (!this.searchQ) {
        this.searchResult = [];
        return;
      }
      this.searchLoading = true;
      const url = this.$api.qwjs;
      const params = {
        caseSn: this.caseSn,
        courtNo: this.courtNo,
        searchNr: this.searchQ,
        zjml: false
      };
      this.$http.get(url, params, result => {
        this.searchResult = result;
        this.searchLoading = false;
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
      this.currentTab = "bajz";
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
    locateYsjz(wjId, ajSn, ajLb, caseSn, ah) {
      if (this.ysList === null) {
        this.defaultYsKey = ah + "_" + caseSn;
        this.ysjz.default = wjId;
        this.defaultYsJb = ajLb;
        this.defaultYsAjSn = ajSn;
        this.currentTab = "ysjz";
      } else {
        this.currentTab = "ysjz";
        if (this.ysjz.params.ajSn == ajSn) {
          this.expandKeys.pop();
          this.expandKeys.push(wjId);
          this.$refs.ysjzTree.setCurrentKey(wjId);
        } else {
          this.ysjz.default = wjId;
          this.changeJb(ajLb, ajSn, "ysjz");
        }
      }
    },
    handleThumbClick(jz) {
      this.$refs[this.currentTab + "Tree"].setCurrentKey(jz.id);
      document
        .getElementById("tree-node-" + jz.id)
        .scrollIntoView({ block: "center" });
    },
    //向上滚动继续加载
    scrollUpHandler() {
      const firstThumb = this.thumbs[0];
      const mlData = firstThumb.parent.children;
      const firstId = firstThumb.id;
      const index = mlData.findIndex(_ => _.id == firstId);
      if (index == 0) {
        return;
      }
      this.scrollUpLoading = true;
      // 再追加三页
      this.thumbs = mlData
        .slice(Math.max(0, index - 10), index)
        .concat(this.thumbs);
      this.$nextTick(_ => {
        const img = new Image();
        img.onload = e => {
          this.imageLoading = false;
          document.querySelector("#thumb" + firstId).scrollIntoView({
            block: "center"
          });
          this.scrollUpLoading = false;
        };
        const currentFirstId = this.thumbs[0].id;
        if (this.currentTab === "ysjz") {
          img.src = `${this.$api.ysjz.download}?caseSn=${
            this.ysjz.params.caseSn
          }&wjId=${currentFirstId}&r=${Math.random()}`;
        } else {
          img.src = `${this.$api.bajz.download}?courtNo=${
            this.courtNo
          }&wjId=${currentFirstId}&r=${Math.random()}`;
        }
      });
    },
    //向下滚动继续加载
    scrollDownHandler() {
      const lastThumb = this.thumbs[this.thumbs.length - 1];
      const mlData = lastThumb.parent.children;
      const index = mlData.findIndex(_ => _.id == lastThumb.id);
      const len = mlData.length;
      if (index == len - 1) {
        return;
      }
      // 再追加十页，
      this.thumbs = this.thumbs.concat(
        mlData.slice(index + 1, Math.min(len, index + 11))
      );
    }
  },
  mounted() {
    // 加载本院卷别选项
    this.loadBaJbOption();
  }
};
</script>
<style scoped>
.zhyj {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.left_panel {
  flex: 1;
  height: 100%;
  padding: 20px 50px 0 0;
  box-sizing: border-box;
  border-right: 1px solid #334c6d;
}
.right_panel {
  width: 1650px;
  height: 100%;
  padding: 20px 30px 0 50px;
  box-sizing: border-box;
  border-left: 1px solid #10192c;
  display: flex;
}
.jz_menu_panel {
  width: 520px;
  height: 100%;
  box-sizing: border-box;
  background: rgba(22, 41, 61, 1);
  border: 2px solid #21a2f3;
  margin-right: 30px;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
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
}
.search_info {
  text-align: center;
  padding: 20px;
  color: #5b7390;
}
.ws_panel,
.image_panel {
  flex: 1;
  height: 100%;
  box-sizing: border-box;
  background: rgba(5, 23, 40, 1);
  border: 3px solid rgba(79, 110, 157, 1);
  display: flex;
}
.image_wrapper {
  height: 100%;
  padding: 10px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.image_wrapper img {
  width: 100%;
  height: 100%;
  object-fit: scale-down;
}
.thumb_wrapper {
  width: 220px;
  border-left: 2px solid #4f6e9d;
  overflow: hidden;
}
.menu_header {
  height: 56px;
  font-size: 1.75rem;
  box-sizing: border-box;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tab_wrapper {
  height: calc(100% - 95px);
  padding: 10px 10px 0 20px;
}
.ws_item {
  margin: 20px;
  padding: 20px;
  color: #c0dcff;
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0);
  border-radius: 4px;
  transition: all 0.2s linear;
  cursor: pointer;
}
.ws_item .ws_zzsj {
  padding: 2px 0;
}
.ws_item:hover {
  background-color: #061c31;
}
.ws_item.ws_selected {
  background-color: #061c31;
  color: #fff;
  border: 1px solid rgba(0, 175, 255, 1);
}
.ws_item .ws_ah {
  font-size: 1.12rem;
  font-weight: 700;
  padding-bottom: 10px;
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
.thumb_ul {
  padding: 10px 30px;
}
.thumb_li img {
  width: 100%;
  border: 3px solid transparent;
  cursor: pointer;
  min-height: 150px;
}
.thumb_li img.thumb_selected {
  border-color: #ff4d00;
}
.thumb_li + .thumb_li {
  margin-top: 20px;
}
.thumb_label {
  text-align: center;
}
.load_tip {
  color: #7e8085;
  font-size: 1rem;
  text-align: center;
  padding: 4px;
}
</style>
<style>
.jz_menu_panel .el-radio-group {
  display: flex;
}
.jz_menu_panel .el-radio-group .el-radio-button {
  flex: 1;
}
.jz_menu_panel
  .el-radio-group
  .el-radio-button:first-child
  .el-radio-button__inner {
  border-left: 0;
  border-radius: 0;
}
.jz_menu_panel
  .el-radio-group
  .el-radio-button:last-child
  .el-radio-button__inner {
  border-right: 0;
  border-radius: 0;
}
.jz_menu_panel .el-radio-group .el-radio-button .el-radio-button__inner {
  width: 100%;
  font-size: 1.375rem;
  padding: 7px 0;
  background: #1c354d;
  border: 1px solid #4f6e9d;
  color: #c0dcff;
}
.jz_menu_panel
  .el-radio-group
  .el-radio-button__orig-radio:checked
  + .el-radio-button__inner {
  color: #fff;
  background-color: #00afff;
  border-color: #00afff;
  -webkit-box-shadow: -1px 0 0 0 #00afff;
  box-shadow: -1px 0 0 0 #00afff;
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
.my_scroll .el-scrollbar__wrap {
  overflow-x: hidden;
}
.ys_chooser {
  text-align: center;
}
.ys_chooser .el-button {
  font-size: 1.125rem;
  padding: 8px 10px;
  background-color: #00afff;
  border-color: #00afff;
}
.el-dropdown-menu__item {
  font-size: 16px;
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
<style lang="scss" scoped>
.ws_list {
  height: 100%;
  .list_item {
    display: inline-block;
    box-sizing: border-box;
    width: calc(100% - 10px);
    height: 24%;
    border: 2px solid #627373;
    color: #627373;
    font-size: 1.2rem;
    border-radius: 6px;
    padding: 10px 10px 10px 15px;
    margin-top: 3%;
    height: 150px;
    line-height: 40px;
    font-size: 1.3rem;
    .item_ah {
      font-size: 1.6rem;
    }
    .svg-icon {
      width: 1.3rem;
      height: 1.3rem;
      color: #627373;
    }
  }
  .list_active {
    border: 2px solid #21a2f3;
    color: white;
    .svg-icon {
      width: 1.3rem;
      height: 1.3rem;
      color: #ffffff;
    }
  }
}
.wsimg_display {
  height: 100%;
  width: 100%;
  padding: 50px;
  overflow: scroll;
  .img_box {
    width: 100%;
    height: auto;
    img {
      width: 100%;
      height: auto;
    }
  }
}
</style>