import { defineConfig } from 'vitepress'
import { sidebar } from './sidebar'

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
      { text: '个人说明书', link: '/resume.md' },
    ],
    sidebar: sidebar,
    lastUpdatedText: '更新时间',

    // 设置文章目录显示
    outline: { 
      label: '本页目录',
      level: [1,2],// 只显示一二级标题
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

