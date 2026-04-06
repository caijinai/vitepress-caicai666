// docs/.vitepress/theme/index.ts
import type { Theme } from 'vitepress'
// 导入默认主题
import DefaultTheme from 'vitepress/theme'
// 导入自定义组件
import RecentUpdatesCarousel from './RecentUpdatesCarousel.vue'
// 导入你的自定义样式
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册全局组件
    app.component('RecentUpdatesCarousel', RecentUpdatesCarousel)
  }
} satisfies Theme