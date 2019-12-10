import axios from "axios";
import sysConf from "@/config/default.config";

// 默认超时时间60s
axios.defaults.timeout = 60000 * 10;

// 请求拦截器
axios.interceptors.request.use(
  config => {
    config.headers.Authorization = `${sessionStorage.getItem("ESZHTS_KEY_TOKEN")}`;
    config.headers.userId = `${sessionStorage.KEY_USER_ID}`
    // 避免IE下请求缓存
    config.headers["Cache-Control"] = "no-cache";
    config.headers["Pragma"] = "no-cache";

    return config;
  },
  error => Promise.reject(error)
);

export default {
  // 并发请求
  all(gets, cb) {
    if (gets && gets.length > 0) {
      const functions = gets.map(get =>
        axios.get(processUrl(get.url), get.params)
      );

      axios.all(functions).then(
        axios.spread((..._results) => {
          let results = _results.map(_result => _result.data);
          cb(results);
        })
      );
    }
  },
  get(url, params, cb_su, cb_err) {
    axios
      .get(processUrl(url), {
        params: params
      })
      .then(res => {
        if (res) {
          if (typeof cb_su === "function") {
            cb_su(res.data);
          }
        } else {
          if (typeof cb_err === "function") cb_err(res);
        }
      })
      .catch(err => {
        if (typeof cb_err === "function") {
          cb_err(err);
        }
      });
  },
  put(url, data, cb_su, cb_err) {
    axios
      .put(processUrl(url), data)
      .then(res => {
        if (res) {
          if (typeof cb_su === "function") {
            cb_su(res.data);
          }
        } else {
          if (typeof cb_err === "function") {
            cb_err(res);
          }
        }
      })
      .catch(err => {
        if (typeof cb_err === "function") {
          cb_err(err);
        }
      });
  },
  post(url, data, cb_su, cb_err) {
    axios
      .post(processUrl(url), data)
      .then(res => {
        if (res) {
          if (typeof cb_su === "function") {
            cb_su(res.data);
          }
        } else {
          if (typeof cb_err === "function") cb_err(res);
        }
      })
      .catch(err => {
        if (typeof cb_err === "function") {
          cb_err(err);
        }
      });
  },
  delete(url, params, cb_su, cb_err) {
    axios
      .delete(processUrl(url), {
        params
      })
      .then(res => {
        if (res) {
          if (typeof cb_su === "function") {
            cb_su(res.data);
          }
        } else {
          if (typeof cb_err === "function") cb_err(res);
        }
      })
      .catch(err => {
        if (typeof cb_err === "function") {
          cb_err(err);
        }
      });
  }
};

// 添加服务器端URL
function processUrl(url) {
  if (url.indexOf("http://") !== -1 || url.indexOf(".json") > 0) {
    return url;
  }
  return sysConf.app.apiServer + url;
}
