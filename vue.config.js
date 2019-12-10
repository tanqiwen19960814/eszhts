const path = require("path");

function resolve (dir) {
  return path.join(__dirname, dir);
}
//生产环境
const production = process.env.NODE_ENV === "production";
//集成测试环境
const sit = process.env.NODE_ENV === "sit";
//开发环境
const dev = process.env.NODE_ENV === "development";

// vue.config.js 是一个可选的配置文件，如果项目的 (和 package.json 同级的) 根目录中存在这个文件，那么它会被 @vue/cli-service 自动加载。
module.exports = {
  // 部署应用包时的基本 URL。默认值'/'
  // 用法和 webpack 本身的 output.publicPath 一致，
  // 但是 Vue CLI 在一些其他地方也需要用到这个值，所以请始终使用 baseUrl 而不要直接修改 webpack 的 output.publicPath。
  publicPath: process.env.VUE_APP_BASE_URL,
  // 当运行 vue-cli-service build 时生成的生产环境构建文件的目录。默认值'dist'
  outputDir: "dist",
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。默认值''
  assetsDir: "",
  // 指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径。默认值'index.html'
  indexPath: "index.html",
  // 生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。默认值'true'
  filenameHashing: true,
  // 在 multi-page 模式下构建应用。每个“page”应该有一个对应的 JavaScript 入口文件。 详见 https://cli.vuejs.org/zh/config/#pages
  pages: undefined,
  // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码。这个值会在 @vue/cli-plugin-eslint 被安装之后生效。默认值true
  lintOnSave: false, //process.env.NODE_ENV !== 'production',
  // 是否使用包含运行时编译器的 Vue 构建版本。设置为 true 后你就可以在 Vue 组件中使用 template 选项了，但是这会让你的应用额外增加 10kb 左右。默认false
  runtimeCompiler: false,
  // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来。默认[]
  transpileDependencies: [],
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。默认值true
  productionSourceMap: false,
  // 设置生成的 HTML 中 <link rel="stylesheet"> 和 <script> 标签的 crossorigin 属性。
  // 需要注意的是该选项仅影响由 html-webpack-plugin 在构建时注入的标签 - 直接写在模版 (public/index.html) 中的标签不受影响。
  // 默认值undefined
  crossorigin: undefined,
  // 在生成的 HTML 中的 <link rel="stylesheet"> 和 <script> 标签上启用 Subresource Integrity (SRI)。如果你构建后的文件是部署在 CDN 上的，启用该选项可以提供额外的安全性。
  // 需要注意的是该选项仅影响由 html-webpack-plugin 在构建时注入的标签 - 直接写在模版 (public/index.html) 中的标签不受影响。
  // 默认值false
  integrity: false,
  // webpack简单配置
  configureWebpack: {
    // debuge调试配置
    devtool: "source-map",
    externals: {
      AMap: "AMap"
    }
  },
  // 对内部的 webpack 配置进行更细粒度的修改,如loader,plugin。链式操作
  chainWebpack: config => {
    const svgRule = config.module.rule("svg");

    // 清除已有的所有 loader。
    // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
    svgRule.uses.clear();

    // 添加要替换的 loader
    svgRule
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      });
    config.output.filename("[name].[hash:8].js");
    config.resolve.alias.set("@", resolve("src"));
  },
  // css相关配置
  css: {
    // 默认情况下，只有 *.module.[ext] 结尾的文件才会被视作 CSS Modules 模块。
    // 设置为 true 后你就可以去掉文件名中的 .module 并将所有的 *.(css|scss|sass|less|styl(us)?) 文件视为 CSS Modules 模块。
    // 默认值false
    modules: false,
    // 是否将组件中的 CSS 提取至一个独立的 CSS 文件中
    // 默认生产环境下是 true，开发环境下是 false
    extract: production,
    // 是否为 CSS 开启 source map。设置为 true 之后可能会影响构建的性能。默认值false
    sourceMap: false,
    // 向 CSS 相关的 loader 传递选项，默认{}
    // 相比于使用 chainWebpack 手动指定 loader 更推荐上面这样做，因为这些选项需要应用在使用了相应 loader 的多个地方。
    loaderOptions: {}
  },
  // webpack-dev-server 相关配置
  devServer: {
    port: 8081
  }
};
