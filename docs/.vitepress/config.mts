import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base:'/',
  title: "Cai's blog",

  description: "be bright.be happy.be you",
  // 是否展示最近git提交时间
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
    
       
    ],

    sidebar: {
      'product':[
       {
         text: '产品经理知识库',
         items:[
          { text: '一些有趣的观点', link: '/product/一些有趣的观点.md'},
          { text: '如何提升产品能力', link: '/product/如何提高产品能力.md' }, 
           { text: '产品经理职业技能树', link: '/product/产品经理职业技能树.md' }, 
         ]  
          }
         ],
      'dairy':[
        {
          text: '日常随记',
          items:[
            { text: '2025年', link: '/dairy/2025.md' },
            { text: '2024年', link: '/dairy/2024.md' },
            { text: '2023年', link: '/dairy/2023.md' },
            { text: '2023年', link: '/dairy/2023.md' },
          ]
      }
    ],
  },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/caijinai/vitepress-caicai666' }
    ],
  }
})
