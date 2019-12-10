import Vue from "vue";
import Router from "vue-router";
import routes from "@/config/router.config";
import utils from "@/utils/utils";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.meta.anon != true && !utils.sessionStorage("ESZHTS_KEY_TOKEN")) {
    next({
      path: "/401"
    });
    return;
  }
  next();
});
export default router;
