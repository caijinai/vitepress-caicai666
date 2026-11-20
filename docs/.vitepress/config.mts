import { defineConfig } from 'vitepress'
import { sidebar } from './sidebar'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/vitepress-caicai666/', // GitHub Pages 仓库名
  title: "Cai's blog",
  description: "be bright.be happy.be you",
  lastUpdated: true,

  // 修正 Vite 配置（移除嵌套）
  vite: {
    // 这里不需要再设置 base，因为外层已经有了
    build: {
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.match(/\.(woff2|woff|ttf|eot)$/)) {
              return 'assets/fonts/[name].[hash][extname]'
            }
            return 'assets/[name].[hash][extname]'
          }
        }
      }
    }
  },

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '个人说明书', link: '/resume.md' },
    ],
    sidebar: sidebar,
    lastUpdatedText: '更新时间',
    
    outline: { 
      label: '本页目录',
      level: [1, 2],
    },
    
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },
  
    socialLinks: [
      { icon: 'github', link: 'https://github.com/caijinai/vitepress-caicai666' }
    ],
    
    search: {
      provider: 'local',
      options: {
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
        }
      }
    }
  }
})