import config from "../config/default.config";
const apiServer = config.app.apiServer;
export default {
  login: "login",
  fr: "fr/{courtNo}",
  pq: "pq/ktsj",
  now: "now",
  loadWsImg: "/ws/image/file",
  tsjc: "pq/tsjc",
  tpkz: "tpkz/switch",
  tpkzReset: "tpkz/reset",
  ajgk: "ajgk/info",
  tstg: "tstg/tstg",
  tsjl: "/pq/tsjlHtml",
  ssdwxx: "/pq/dsrxx",
  tsjsxx: "/pq/tsjsxx", //获取庭审角色相关信息
  zyjd: "zyjd/list",
  zzjs: "dzzz/zzjsCheck", //质证结束检查接口
  qwjs: "fullSearch/getSearchResult",
  imgRotate: "sajz/image/changeRadio",
  bajz: {
    tree: "sajz/tree",
    jb: "sajz/jb/options",
    download: apiServer + "sajz/image/file"
  },
  ysjz: {
    cases: "ysjz/getCasesYsList",
    tree: "ysjz/tree",
    jb: "ysjz/jb/options",
    download: apiServer + "ysjz/image/file"
  },
  spws: {
    tree: "ws/getSpwdList",
    img: "ws/image/file"
  },
  tags: {
    list: "jzbz/tags/list/{wjId}",
    save: "jzbz/tags/add",
    delete: "jzbz/tags/{id}",
    confirm: "dzzz/tags/confirm"
  },
  dzqm: {
    count: "dzqm/count",
    img: "dzqm/one"
  },
  setConfig: {
    fy: "setting/courtList",
    spt: "setting/sptList",
    role: "setting/roleList",
    tpkzxx: "setting/tpkzqxx",
    tpkz: "setting/tpkzq"
  }
};
