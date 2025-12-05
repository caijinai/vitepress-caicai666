// docs/.vitepress/theme/index.ts
import type { Theme } from 'vitepress'
// 导入默认主题
import DefaultTheme from 'vitepress/theme'
// 导入你的自定义样式
import './style.css'

// 导出主题对象，继承默认主题
export default {
  extends: DefaultTheme,
  // 这里可以添加其他主题增强，例如注册全局组件
  // enhanceApp({ app }) { ... }
} satisfies Theme

