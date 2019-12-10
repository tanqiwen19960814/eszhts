import store from "@/store";
import {
  UPDATE_INNERWIDTH,
  UPDATE_INNERHEIGHT,
  UPDATE_SCROLLHEIGHT
} from "@/store/mutation-type";
import utils from "@/utils/utils";
/**
 * 获取页面尺寸
 */
function getPageSize() {
  store.commit(UPDATE_INNERWIDTH, window.innerWidth);
  store.commit(UPDATE_INNERHEIGHT, window.innerHeight);
  store.commit(UPDATE_SCROLLHEIGHT, window.document.body.scrollHeight);
}

export default function Initializer() {
  window.addEventListener("resize", utils.throttle(getPageSize, 1000));
}
