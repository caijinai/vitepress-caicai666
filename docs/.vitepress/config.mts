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
      { text: '个人说明书', link: '/resume' },
    
       
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
            { text: '2022年', link: '/dairy/2022.md' },
          ]
      }
        ],
      'read':[
        {
          text: '读书',
          items:[
            { text: '《被讨厌的勇气》划线', link: '/weread/《被讨厌的勇气》划线.md' },
            { text: '《彷徨之刃》', link: '/weread/《彷徨之刃》划线与笔记.md' },
            { text: '读书2025', link: '/weread/read2025.md' },
            { text: '被驯化的大脑', link: '/weread/《被驯化的大脑》.md' },
          ]
      }
    ],   
  },

    // 文章底部切换按钮展示文本
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },
  
    socialLinks: [
      { icon: 'github', link: 'https://github.com/caijinai/vitepress-caicai666' }
    ],

search: {
      provider: 'local', // 指定使用本地搜索
      options: {
        // 本地搜索的选项
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        },
        // 你可以根据需要调整搜索的详细程度
        // detailedView: true // 默认启用，会显示更详细的结果摘要
      }
    }

  },
})

