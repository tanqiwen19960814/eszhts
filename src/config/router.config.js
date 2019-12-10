const routes = [
  {
    path: "/",
    component: () => import("@/views/Layout.vue"),
    children: [
      {
        path: "/fg",
        component: () => import("@/views/fg/Index.vue"),
        children: [
          {
            path: "ajgk",
            component: () => import("@/views/fg/Ajgk.vue"),
            meta: {
              title: "案件概况 法官端"
            }
          },
          {
            path: "zhyj",
            component: () => import("@/views/fg/Zhyj.vue"),
            meta: {
              title: "智慧阅卷 法官端"
            }
          },
          {
            path: "dzzz",
            component: () => import("@/views/fg/Dzzz.vue"),
            meta: {
              title: "电子质证 法官端"
            }
          },
          {
            path: "zyjd",
            component: () => import("@/views/fg/Zyjd.vue"),
            meta: {
              title: "争议焦点 法官端"
            }
          },
          {
            path: "dzqm",
            component: () => import("@/views/fg/Dzqm.vue"),
            meta: {
              title: "电子签名 法官端"
            }
          }
        ]
      },
      {
        path: "/dsr",
        component: () => import("@/views/dsr/Index.vue"),
        children: [
          {
            path: "ajgk",
            component: () => import("@/views/dsr/Ajgk.vue"),
            meta: {
              title: "案件概况 当事人端"
            }
          },
          {
            path: "dzzz",
            component: () => import("@/views/dsr/Dzzz.vue"),
            meta: {
              title: "电子质证 当事人端"
            }
          },
          {
            path: "zyjd",
            component: () => import("@/views/dsr/Zyjd.vue"),
            meta: {
              title: "争议焦点 当事人端"
            }
          },
          {
            path: "dzqm",
            component: () => import("@/views/dsr/Dzqm.vue"),
            meta: {
              title: "电子签名 当事人端"
            }
          }
        ]
      }
    ]
  },
  {
    path: "/fglogin",
    component: () => import("@/views/login/FgLogin.vue"),
    meta: {
      anon: true
    }
  },
  {
    path: "/dsrlogin",
    component: () => import("@/views/login/DsrLogin.vue"),
    meta: {
      anon: true
    }
  },
  {
    path: "/fgpq",
    component: () => import("@/views/login/FgPq.vue"),
    meta: {
      title: "法官排期"
    }
  },
  {
    path: "/dsrpq",
    component: () => import("@/views/login/DsrPq.vue"),
    meta: {
      title: "当事人排期"
    }
  },
  {
    path: "/setting",
    component: () => import("@/views/FgSystemConfig.vue"),
    meta: {
      title: "法官界面配置",
      anon: true
    }
  },
  {
    path: "/401",
    component: () => import("@/views/401.vue"),
    meta: {
      title: "你没有访问权限",
      anon: true
    }
  },
  {
    path: "/404",
    component: () => import("@/views/404.vue"),
    meta: {
      title: "没有你要找的页面",
      anon: true
    }
  },
  {
    path: "*",
    redirect: "404"
  }
];

export default routes;
