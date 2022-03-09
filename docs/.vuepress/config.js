module.exports = {
  title: '前端杂货铺',
  description: '一个前端小卒的成长记录',
  // 路径名为 "/<REPO>/"
  base: '/blog/',
  //使用reco主题
  theme: 'reco',
  locales: {
    '/': {
      lang: 'zh-CN'
    }
  },
  themeConfig: {
    subSidebar: 'auto',
    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      {
        text: 'ming',
        items: [
          { text: 'power-by', link: 'https://www.vuepress.cn/guide' },
          { text: '掘金', link: 'https://juejin.cn/user/712139234359182/posts' }
        ]
      }
    ],
    // 侧边栏
    sidebar: [
      {
        title: "笔记",
        path: '/handbook/element-ui-verify的使用',
        collapsable: false, // 不折叠
        children: [
          { title: "element-ui-verify的使用", path: "/handbook/element-ui-verify的使用" },
          { title: "Vue3笔记", path: "/handbook/Vue3笔记" }
        ],
      }
    ],
  },
}

// 在git bush中运行  sh deploy.sh  部署项目