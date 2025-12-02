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
          { text: '日记', link: '/dairy/2025.md' },
          { text: '产品经理', link: '/产品经理.md'}
          
        ]
        
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/caijinai/vitepress-caicai666' }
    ]
  }
})
