module.exports = {
  title: "前端杂货铺",
  description: "搬砖仔的博客",
  // 路径名为 "/<REPO>/"
  base: "/blog/",
  //使用reco主题
  theme: "reco",
  locales: {
    "/": {
      lang: "zh-CN",
    },
  },
  themeConfig: {
    // subSidebar: "auto",
    sidebarDepth: "2", //侧边栏标题深度
    lastUpdated: true, //是否开启最后更新时间
    logo: "/logo.jpg", //默认还是去publice文件夹找，和readerme中的logo同一个路径
    // 导航栏
    nav: [
      { text: "首页", link: "/" },
      { text: "笔记", link: "/handbook/TypeScript/TypeScript基础" },
      { text: "随笔", link: "/life/2022年中总结.md" },
      {
        text: "ming",
        items: [
          { text: "power-by", link: "https://www.vuepress.cn/guide" },
          {
            text: "CSDN",
            link: "https://blog.csdn.net/qq_45279180?spm=1000.2115.3001.5343",
          },
        ],
      },
    ],
    // 侧边栏
    sidebar: {
      "/handbook/": [
        // Typescript
        {
          title: "TypeScript",
          path: "/handbook/TypeScript/TypeScript基础",
          collapsable: false, // 不折叠
          children: [
            {
              title: "TypeScript基础",
              path: "/handbook/TypeScript/TypeScript基础",
            },
          ],
        },
        // Vue
        {
          title: "Vue",
          path: "/handbook/Vue/Vue3笔记",
          collapsable: false, // 不折叠
          children: [
            { title: "Vue3笔记", path: "/handbook/Vue/Vue3笔记" },
            {
              title: "Vue2工具函数源码阅读",
              path: "/handbook/Vue/vue2工具函数",
            },
          ],
        },
        // Electron
        {
          title: "Electron",
          path: "/handbook/Electron/electron镜像地址设置",
          collapsable: false, // 不折叠
          children: [
            {
              title: "electron镜像地址设置",
              path: "/handbook/Electron/electron镜像地址设置",
            },
            {
              title: "electron使用总结",
              path: "/handbook/Electron/PC端技术总结",
            },
            {
              title: "electron开发指南",
              path: "/handbook/Electron/PC端页面开发指南",
            },
          ],
        },
        // UI组件相关
        {
          title: "UI",
          path: "/handbook/UI/element-ui-verify的使用",
          collapsable: false, // 不折叠
          children: [
            {
              title: "element-ui-verify的使用",
              path: "/handbook/UI/element-ui-verify的使用",
            },
          ],
        },
        // 第三方功能拓展库
        {
          title: "第三方功能库",
          path: "/handbook/expand/Echarts",
          collapsable: false, // 不折叠
          children: [
            { title: "Echarts", path: "/handbook/expand/Echarts" },
            {
              title: "Echarts配置示例",
              path: "/handbook/expand/Echarts配置示例",
            },
          ],
        },
        // 前端环境相关
        {
          title: "前端环境",
          path: "/handbook/envConfig/git使用笔记",
          collapsable: false, // 不折叠
          children: [
            { title: "git使用笔记", path: "/handbook/envConfig/git使用笔记" },
            {
              title: "nrm的大致使用",
              path: "/handbook/envConfig/nrm的大致使用",
            },
            { title: "nvm的安装", path: "/handbook/envConfig/nvm的安装" },
          ],
        },
        // 个人组件封装
        {
          title: "解决方案",
          path: "/handbook/custom/浏览器拍照",
          collapsable: false, // 不折叠
          children: [
            { title: "web浏览器拍照组件", path: "/handbook/custom/浏览器拍照" },
            { title: "剪贴板", path: "/handbook/custom/剪贴板" },
          ],
        },
      ],
      "/life/": [
        {
          title: "2022年中总结",
          path: "/life/2022年中总结",
          collapsable: false, // 不折叠
        },
        {
          title: "牛老师",
          path: "/life/牛老师",
          collapsable: false, // 不折叠
        },

        // "2022年中总结",
        // "牛老师",
      ],
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        // md中使用图片示例：(../images/logo.png)==(~@images/16.png)
        "@images": "../images", //在md文件中使用图片路径别名  其实我用了图床，所以图片放不放该项目都无所谓
      },
    },
  },
};

// 在git bush中运行  sh deploy.sh  部署项目
