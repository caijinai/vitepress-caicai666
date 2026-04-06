# 首页轮播功能使用指南

## 功能说明

在首页首屏下方添加了一个**最近更新轮播组件**，自动展示你最近更新的 5 篇文档，包括：
- 📝 **文档标题**
- 📄 **文档摘要**（前 2-3 行内容）
- 📅 **更新时间**
- 🔗 **阅读链接**

## 轮播功能

- **自动播放**：每 5 秒自动切换到下一篇文档
- **导航按钮**：使用左右箭头手动切换
- **快速跳转**：点击下方圆点快速跳转到指定文档
- **播放控制**：点击右下角的暂停/播放按钮控制自动播放

## 工作流程

### 1. 开发模式

```bash
npm run dev
```

这会：
- 生成索引文件（如果需要）
- **生成最近更新数据** (`recent-updates.json`)
- 启动 VitePress 开发服务器

### 2. 构建部署

```bash
npm run build
```

这会：
- 生成索引文件
- **生成最近更新数据**
- 构建静态网站

### 3. 手动生成最近更新数据

如果只想更新轮播数据而不启动服务器：

```bash
npm run generate-recent-updates
```

## 数据来源

轮播数据来自 `docs/.vitepress/recent-updates.json` 文件，该文件由以下脚本自动生成：

**文件位置**：`scripts/generate-recent-updates.js`

**扫描范围**：`docs/` 目录下所有 `.md` 文件

**排除项**：
- 目录：`.vitepress`, `.vscode`, `public`
- 文件：`index.md`, `resume.md`

**排序规则**：按文件修改时间倒序，取最新的 5 条

## 自定义配置

如要修改轮播行为，编辑以下文件：

### 修改轮播间隔

**文件**：`docs/.vitepress/theme/RecentUpdatesCarousel.vue`

找到这行代码（约第 69 行）：
```javascript
autoPlayTimer = setInterval(() => {
  if (isAutoPlay.value) {
    nextSlide()
  }
}, 5000) // 每 5 秒切换一次 ← 改这里
```

改为你想要的毫秒数。例如 `3000` 为 3 秒，`8000` 为 8 秒。

### 修改显示数量

**文件**：`scripts/generate-recent-updates.js`

找到这行代码（约第 84 行）：
```javascript
.slice(0, 5) // 取前 5 条 ← 改这里
```

改为你想要的数量。

### 修改摘要长度

**文件**：`scripts/generate-recent-updates.js`

找到这行代码（约第 32 行）：
```javascript
summary = summaryLines.join(' ').substring(0, 150); // 150 个字符 ← 改这里
```

## 样式定制

所有样式都在 `RecentUpdatesCarousel.vue` 文件中的 `<style scoped>` 部分。

关键 CSS 变量（来自 VitePress 主题）：
- `--vp-c-brand`：品牌色
- `--vp-c-bg`：背景色
- `--vp-c-text-1`：主文本色
- `--vp-c-text-2`：次要文本色
- `--vp-c-divider`：分割线色

## 常见问题

### Q: 如何手动刷新轮播数据？
A: 运行 `npm run generate-recent-updates`，然后刷新浏览器。

### Q: 为什么轮播不显示？
A: 检查以下几点：
1. 是否运行过 `npm run dev` 或 `npm run build`（生成 recent-updates.json）
2. 浏览器是否在线（需要加载 JSON 数据）
3. 打开浏览器开发者工具检查网络错误

### Q: 如何排除某些文件不出现在轮播中？
A: 编辑 `scripts/generate-recent-updates.js`，在 `EXCLUDE_FILES` 数组中添加文件名。

### Q: 点击"阅读全文"为什么跳转 404？
A: 检查链接是否正确。如果你的部署 base 路径不是 `/vitepress-caicai666/`，需要调整路径生成逻辑。

## 文件列表

本功能涉及的文件：

```
docs/
├── .vitepress/
│   ├── theme/
│   │   ├── RecentUpdatesCarousel.vue  ← 轮播组件
│   │   ├── index.ts                    ← 注册组件
│   │   └── style.css
│   ├── config.mts                      ← VitePress 配置
│   └── recent-updates.json             ← 自动生成的数据
├── index.md                             ← 首页（已添加组件）
└── ...

scripts/
├── generate-recent-updates.js           ← 数据生成脚本
└── ...

package.json  ← 已更新脚本命令
```

## 技术栈

- **Vue 3**：组件框架
- **VitePress**：文档网站生成器
- **Node.js**：数据生成脚本
