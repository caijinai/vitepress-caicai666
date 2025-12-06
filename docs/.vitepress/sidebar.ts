// docs/.vitepress/sidebar.ts
import { readdirSync, statSync, existsSync } from 'fs'
import { join, extname, basename } from 'path'
import { fileURLToPath } from 'url'

// 获取docs目录的绝对路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = join(__filename, '..')
const docsRoot = join(__dirname, '..')

/**
 * 递归扫描目录，生成多级侧边栏项目
 * @param dirPath 要扫描的目录路径
 * @param basePath 相对基础路径，用于生成链接
 */
function scanDirectory(dirPath: string, basePath: string = ''): any[] {
  // 基础检查：目录是否存在
  if (!existsSync(dirPath)) {
    console.warn(`[sidebar] 目录不存在: ${dirPath}`)
    return []
  }

  const items = []

  try {
    // 读取目录下的所有文件和文件夹
    const entries = readdirSync(dirPath)

    for (const entry of entries) {
      const fullPath = join(dirPath, entry)
      const isDirectory = statSync(fullPath).isDirectory()
      const isMarkdownFile = !isDirectory && extname(entry) === '.md'

      // 跳过隐藏文件和非markdown文件（除非是目录）
      if (entry.startsWith('.') || (!isDirectory && !isMarkdownFile)) {
        continue
      }

      const itemName = basename(entry, '.md')
      const relativePath = basePath ? `${basePath}/${entry}` : entry
      const linkPath = `/${relativePath.replace(/\.md$/, '')}`

      if (isDirectory) {
        // 如果是目录，递归处理其内容
        const children = scanDirectory(fullPath, relativePath)
        
        if (children.length > 0) {
          items.push({
            text: itemName, // 可以直接使用目录名，如"2025"、"一月"
            collapsed: true, // 默认折叠，设为false则默认展开
            items: children
          })
        }
      } else if (isMarkdownFile && entry !== 'index.md') {
        // 如果是Markdown文件（且不是索引页），添加到侧边栏
        // 你可以在这里格式化标题，或直接使用文件名
        const displayText = itemName.replace(/^\d+-/, '') // 移除开头的数字和短横线（如"01-"）
        
        items.push({
          text: displayText,
          link: linkPath
        })
      }
    }
  } catch (error) {
    console.error(`[sidebar] 扫描目录时出错 ${dirPath}:`, error)
  }

  return items
}

/**
 * 为指定目录生成侧边栏配置
 */
function generateSidebarFor(directory: string, title: string = '目录') {
  const targetDir = join(docsRoot, directory)
  const items = scanDirectory(targetDir, directory)
  
  // 如果没有内容，返回空数组
  if (items.length === 0) return []
  
  return [
    {
      text: title,
      collapsed: false, // 顶级目录默认展开
      items: items
    }
  ]
}

// 导出最终的侧边栏配置
export const sidebar = {
  '/dairy/': generateSidebarFor('dairy', '📔 日记'),
  '/product/': generateSidebarFor('product', '💼 工作笔记'),
  '/weread/': generateSidebarFor('weread', '📝 好好读书'),
  '/recipe/': generateSidebarFor('recipe', '🍉 好好吃饭'),
  '/gym/': generateSidebarFor('gym', '🚀 强身健体'),
  
  // 如果需要为其他目录生成，在这里添加
  // '/product/': generateSidebarFor('product', '💼 工作笔记'),
  // '/notes/': generateSidebarFor('notes', '📝 笔记'),
}