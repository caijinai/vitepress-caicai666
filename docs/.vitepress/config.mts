import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base:'/vitepress-caicai666/',
<<<<<<< HEAD
  title: "菜菜",
=======
  title: "Cai's blog",
  
>>>>>>> d69dd78e4947ab6409eb3edf21862fb95a688d96
  description: "be bright.be happy.be you",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
<<<<<<< HEAD
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
      { text:'testing',link:'/new'},   
=======
      { text: '首页', link: '/' },
       
>>>>>>> d69dd78e4947ab6409eb3edf21862fb95a688d96
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
