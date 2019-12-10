<template>
  <div class="el_tree_wrapper">
    <el-tree class="jz_tree"
             node-key="id"
             ref="tree"
             v-loading="loading"
             element-loading-text="正在加载"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.2)"
             accordion
             :data="nodeData"
             :default-expand-all="defaultExpandAll"
             :default-expanded-keys="selfDefaultExpandKeys"
             :filter-node-method="filterNode"
             :expand-on-click-node="defaultExpandOnClickNode"
             :render-content="renderContent"
             :show-checkbox="showCheckbox"
             :current-node-key="currentNodeKey"
             highlight-current
             :props="props"
             @node-click="handleNodeClick"
             @current-change="handleCurrentChange"
             @node-expand="handleNodeExpand"></el-tree>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nodeData: [],
      currentNodeKey: this.defaultNodeKey,
      selfDefaultExpandKeys: this.defaultExpandKeys,
      firstLeafData: null,
      table: {
        params: this.params
      },
      props: {
        children: "children",
        label: "label",
        isLeaf: "leaf"
      },
      filterText: "",
      loading: true,
      selectedZjNode: null // 选中的卷宗节点
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    params(newVal) {
      this.table.params = newVal;
    }
  },
  props: {
    url: {
      type: String,
      required: true
    },
    params: {
      type: Object,
      default() {
        return {};
      }
    },
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    defaultOnlyLeaf: {
      //点击所有节点都能选中，为true时表示：只能选择叶节点
      type: Boolean,
      default: false
    },
    showConfirm: {
      //是否显示确认状态
      type: Boolean,
      default: false
    },
    defaultExpandOnClickNode: {
      //默认点击节点时展开节点
      type: Boolean,
      default: true
    },
    defaultCheckedKeys: {
      // 默认勾选节点
      type: Array,
      default() {
        return [];
      }
    },
    defaultExpandKeys: {
      // 默认展开的节点
      type: Array,
      default() {
        return [];
      }
    },
    defaultNodeKey: {
      // 默认选中节点(节点id)
      type: Number | String
    },
    showFilter: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    loadData(callback) {
      this.loading = true;
      this.$http.get(
        this.url,
        this.table.params,
        res => {
          this.nodeData = res;
          if (res.length > 0) {
            this.firstLeafData = null;
            this.processData(this.nodeData, null);
            this.initCheckNodes();
            this.$emit("passTreeResult", this.nodeData);
          }
          this.$nextTick(() => {
            this.loading = false;
          });
        },
        err => {
          this.$message.error("获取信息失败" + err);
        }
      );
      if (typeof callback === "function") callback();
    },
    processData(data, parentData) {
      // 处理节点数据
      data.forEach(_data => {
        _data.parent = parentData;
        if (_data.id.indexOf("-") !== -1) {
          this.processData(_data.children, _data);
        } else {
          _data.isLeaf = true; // 叶子节点
          if (!this.firstLeafData) {
            // 保存第一层节点数据
            this.firstLeafData = _data;
          }
        }
      });
    },
    initCheckNodes() {
      // 多选情况下
      if (this.showCheckbox) {
        // 设置勾选节点
        if (this.defaultCheckedKeys.length > 0) {
          this.$nextTick(() => {
            this.$refs["tree"].setCheckedKeys(this.defaultCheckedKeys);
          });
        } else {
          // 设置默认第一层级的第一个叶子节点为勾选状态
          this.$nextTick(() => {
            this.$refs["tree"].setCheckedKeys(this.firstLeafData.id);
          });
        }
      } else {
        // 单选状态下
        if (this.defaultNodeKey) {
          this.currentNodeKey = this.defaultNodeKey;
        } else if (this.firstLeafData != null) {
          // 设置默认第一层级的第一个叶子节点为勾选状态
          this.currentNodeKey = this.firstLeafData.id;
        }
        if (this.currentNodeKey != null) {
          this.$nextTick(() => {
            this.setCurrentKey(this.currentNodeKey);
            this.addDefaultExpandedKeys();
          });
        }
      }
    },
    setCurrentKey(key) {
      this.$refs["tree"].setCurrentKey(key);
      // 获取当前被选中节点的 data,主动触发点击事件
      this.handleNodeClick(this.$refs["tree"].getCurrentNode());
    },
    getCTreeCurrentNode() {
      return this.$refs["tree"].getCurrentNode();
    },
    renderContent(h, { node, data, store }) {
      // 渲染tree
      return h(
        "span",
        {
          class: "custom-tree-node",
          attrs: {
            id: "tree-node-" + data.id
          }
        },
        [
          this.showConfirm && data.isLeaf
            ? h("span", {
                class:
                  data.ygConfirm && data.bgConfirm
                    ? "confirm_yes"
                    : "confirm_no"
              })
            : "",
          data.isLeaf
            ? h("svg-icon", {
                class: "file",
                props: {
                  iconClass: "file"
                }
              })
            : h("svg-icon", {
                class: "floder",
                props: {
                  iconClass: "floder"
                }
              }),
          h(
            "span",
            {
              class: "label",
              attrs: {
                title: node.label
              }
            },
            node.label
          )
        ]
      );
    },
    addDefaultExpandedKeys() {
      const _node = this.$refs["tree"].getCurrentNode();
      if (_node) {
        if (_node.parent) {
          this.selfDefaultExpandKeys.push(_node.parent.id);
        }
      }
    },
    /**
     * 通过监听选中的卷宗名称，设置选中的第一个叶子节点
     * @param {zjmlmc(String):卷宗目录名称}
     */
    onSelecteDefaultZj(zjmlmc) {
      if (zjmlmc) {
        this.getZjNode(this.nodeData, null, zjmlmc);
        if (this.selectedZjNode && this.selectedZjNode.children.length > 0) {
          const firstLeafId = this.selectedZjNode.children[0].id;
          this.currentNodeKey = firstLeafId;
          this.$nextTick(() => {
            this.setCurrentKey(this.currentNodeKey);
            this.addDefaultExpandedKeys();
          });
        }
      }
    },
    getZjNode(nodeData, parentNodeData, zjmlmc) {
      nodeData.forEach(node => {
        // 非叶子节点(卷宗目录)
        if (node.id.indexOf("-") !== -1) {
          if (node.label === zjmlmc && !this.selectedZjNode) {
            this.selectedZjNode = node;
          }
          this.getZjNode(node.children, node, zjmlmc);
        }
      });
    },
    handleNodeClick(data, node, store) {
      if (this.defaultOnlyLeaf) {
        //只能选择叶子节点
        if (data.isLeaf) {
          this.$emit("nodeClick", data, node);
        }
      } else {
        this.$emit("nodeClick", data, node);
      }
    },
    handleCurrentChange(data, node, store) {},
    handleNodeExpand(data, node, store) {
      this.$emit("nodeExpand", data, node);
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.loadData(() => {
          resolve(this.nodeData[0]);
          this.$refs["tree"].setCurrentKey(this.nodeData[0].id);
        });
      } else {
        resolve([]);
      }
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>

<style>
.el_tree_wrapper {
  padding-right: 20px;
  outline: 0;
  font-size: 1.125rem;
}
.el_tree_wrapper .custom-tree-node {
  display: flex;
  align-items: center;
}
.svg-icon.file,
.svg-icon.floder {
  width: 18px;
  height: 18px;
  margin: 0 10px;
}
.jz_tree.el-tree {
  background: transparent;
  color: #fff;
}
.jz_tree.el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #061c31;
  border-radius: 4px 6px 6px 6px;
  border: 1px solid rgba(0, 175, 255, 1);
}
.jz_tree .el-tree-node__content:hover {
  background-color: #061c31;
}
.jz_tree .el-tree-node:focus > .el-tree-node__content {
  background-color: #061c31;
}
.jz_tree .el-tree-node__label {
  font-size: 1.125rem;
}
.jz_tree .el-tree-node__content {
  height: 40px;
  box-sizing: border-box;
  border: 1px solid rgba(0, 175, 255, 0);
}
.confirm_yes,
.confirm_no {
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
</style>
