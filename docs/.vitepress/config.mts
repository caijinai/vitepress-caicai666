import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base:'/vitepress-caicai666/',
  title: "Cai's blog",
  
  description: "be bright.be happy.be you",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
       
    ],

    sidebar: [
      {
        text: '列表',
        items: [
          { text: '产品经理知识库', link: '/product maneger.md'},
          { text: '个人说明书', link: '/个人说明书.md' },
          { text: '产品经理的自我思考', link: '/产品经理的自我思考.md' }
        ]
        
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/caijinai/vitepress-caicai666' }
    ]
  }
})
