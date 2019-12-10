function Base64 () {
  // private property
  let _keyStr =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  // public method for encoding
  this.encode = function (input) {
    let output = "";
    let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    let i = 0;
    input = _utf8_encode(input);
    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output =
        output +
        _keyStr.charAt(enc1) +
        _keyStr.charAt(enc2) +
        _keyStr.charAt(enc3) +
        _keyStr.charAt(enc4);
    }
    return output;
  };
  // public method for decoding
  this.decode = function (input) {
    let output = "";
    let chr1, chr2, chr3;
    let enc1, enc2, enc3, enc4;
    let i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
      enc1 = _keyStr.indexOf(input.charAt(i++));
      enc2 = _keyStr.indexOf(input.charAt(i++));
      enc3 = _keyStr.indexOf(input.charAt(i++));
      enc4 = _keyStr.indexOf(input.charAt(i++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      output = output + String.fromCharCode(chr1);
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }
    output = _utf8_decode(output);
    return output;
  };
  // private method for UTF-8 encoding
  function _utf8_encode (string) {
    string = string.replace(/\r\n/g, "\n");
    let utftext = "";
    for (let n = 0; n < string.length; n++) {
      let c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  }
  // private method for UTF-8 decoding
  function _utf8_decode (utftext) {
    let string = "";
    let i = 0;
    let c = (c1 = c2 = 0);
    while (i < utftext.length) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if (c > 191 && c < 224) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(
          ((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
        );
        i += 3;
      }
    }
    return string;
  }
}
/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce (func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function (...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}
export default {
  /**
   * 节流
   * @param {需要节流的方法} fn
   * @param {触发间隔} interval
   */
  throttle (fn, interval) {
    let lastTime = 0;
    return function () {
      let context = this;
      let args = arguments;
      let now = Date.now();
      if (now - lastTime >= interval) {
        lastTime = now;
        fn.apply(context, arguments);
      }
    };
  },
  /**
   * 本地LocalStorage存储
   * @param key
   * @param value
   */ localStorage (key, value) {
    if (arguments.length === 0) {
      console.warn("没有参数");
      return;
    }
    if (!window || !window.localStorage) {
      console.error("您开启了秘密浏览或无痕浏览模式，请关闭!");
      return;
    }
    if (arguments.length === 1 || typeof value === "undefined") {
      return window.localStorage.getItem(key);
    } else if (value === null || value === "") {
      window.localStorage.removeItem(key);
    } else if (typeof value === "object") {
      window.localStorage.setItem(key, JSON.stringify(value));
    } else {
      window.localStorage.setItem(key, value);
    }
  },
  /**
   * 本地SessionStorage存储
   * @param key
   * @param value
   */
  sessionStorage (key, value) {
    if (arguments.length === 0) {
      console.warn("没有参数");
      return;
    }
    if (!window || !window.sessionStorage) {
      console.error("您开启了秘密浏览或无痕浏览模式，请关闭!");
      return;
    }
    if (arguments.length === 1 || typeof value === "undefined") {
      return window.sessionStorage.getItem(key);
    } else if (value === null || value === "") {
      window.sessionStorage.removeItem(key);
    } else if (typeof value === "object") {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } else {
      window.sessionStorage.setItem(key, value);
    }
  },
  /**
   * 获取本地SessionStorage存储
   * @param key
   */
  getSessionStorage (key) {
    if (key != "") {
      return window.sessionStorage.getItem(key);
    } else {
      return "";
    }
  },
  /**
   * 判断当前浏览器是否为IE
   */
  isIE () {
    //ie?
    if (!!window.ActiveXObject || "ActiveXObject" in window) return true;
    else return false;
  },
  //追加0
  add_zero (temp) {
    if (temp < 10) return "0" + temp;
    else return temp;
  },
  currentMonth () {
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    month = this.add_zero(month);
    return year + "" + month;
  },
  firstMonth: function () {
    let today = new Date();
    let year = today.getFullYear();
    return year + "01";
  },
  base64Encode: function (str) {
    return new Base64().encode(str);
  },
  getParams () {
    let params = window.location.search
    const index = params.indexOf("?")
    let obj = {}
    params = params.substr(index + 1).split("&").map(item => {
      item = item.split("=")
      obj[item[0]] = item[1]
    })
    return obj;
  }
};
