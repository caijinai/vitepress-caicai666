// docs/.vitepress/sidebar.ts
import { readdirSync, statSync, existsSync } from 'fs'
import { join, extname, basename } from 'path'
import { fileURLToPath } from 'url'

// 获取docs目录的绝对路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = join(__filename, '..')
const docsRoot = join(__dirname, '..')

/**
 * 从文件名中提取日期
 * 支持格式：
 * 1. "12月2日-没有带伞但穿了风衣的一天" -> 12月2日
 * 2. "2024-12-01-文章标题" -> 2024-12-01
 * 3. "12-1-文章标题" -> 12月1日
 */
function extractDateFromFileName(fileName: string): Date {
  // 尝试匹配中文日期格式：X月X日
  const chineseDateMatch = fileName.match(/(\d{1,2})月(\d{1,2})日/)
  if (chineseDateMatch) {
    const month = parseInt(chineseDateMatch[1], 10)
    const day = parseInt(chineseDateMatch[2], 10)
    // 假设年份为2025（可根据需要调整）
    return new Date(2025, month - 1, day)
  }
  
  // 尝试匹配标准日期格式：YYYY-MM-DD
  const standardDateMatch = fileName.match(/(\d{4})-(\d{1,2})-(\d{1,2})/)
  if (standardDateMatch) {
    const year = parseInt(standardDateMatch[1], 10)
    const month = parseInt(standardDateMatch[2], 10)
    const day = parseInt(standardDateMatch[3], 10)
    return new Date(year, month - 1, day)
  }
  
  // 尝试匹配简单日期格式：MM-DD
  const simpleDateMatch = fileName.match(/^(\d{1,2})-(\d{1,2})/)
  if (simpleDateMatch) {
    const month = parseInt(simpleDateMatch[1], 10)
    const day = parseInt(simpleDateMatch[2], 10)
    // 假设年份为2025
    return new Date(2025, month - 1, day)
  }
  
  // 如果没有找到日期，返回一个很旧的日期（这样会排在最后）
  return new Date(1970, 0, 1)
}

/**
 * 格式化文件名显示（移除数字前缀等）
 */
function formatDisplayName(fileName: string): string {
  // 移除开头的数字和短横线（如"01-"）
  return fileName.replace(/^\d+[-.]\s*/, '')
}

/**
 * 判断是否为日记目录路径
 */
function isDairyPath(basePath: string): boolean {
  return basePath.startsWith('dairy')
}

/**
 * 扫描目录并生成侧边栏项目，支持按不同类型排序
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
    
    // 准备收集文件夹和文件
    const dirEntries: any[] = []
    const fileEntries: any[] = []

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
          dirEntries.push({
            entry,
            itemName,
            fullPath,
            children,
            relativePath,
            // 获取目录的创建时间
            birthtime: statSync(fullPath).birthtimeMs
          })
        }
      } else if (isMarkdownFile && entry !== 'index.md') {
        // 如果是Markdown文件（且不是索引页）
        const displayText = formatDisplayName(itemName)
        
        fileEntries.push({
          entry,
          itemName,
          displayText,
          linkPath,
          fullPath,
          // 获取文件的创建时间
          birthtime: statSync(fullPath).birthtimeMs,
          // 从文件名提取日期（用于日记排序）
          date: extractDateFromFileName(itemName)
        })
      }
    }

    // 判断当前是否为日记目录
    const isDairy = isDairyPath(basePath)
    
    if (isDairy) {
      // 日记目录特殊排序逻辑
      
      // 1. 对文件夹（年份）按名称倒序排列（最新年份在前）
      dirEntries.sort((a, b) => {
        const yearA = parseInt(a.entry) || 0
        const yearB = parseInt(b.entry) || 0
        return yearB - yearA // 倒序排列
      })
      
      // 2. 对文件按日期倒序排列（最新日期在前）
      fileEntries.sort((a, b) => b.date.getTime() - a.date.getTime())
    } else {
      // 其他目录按创建时间倒序排列
      dirEntries.sort((a, b) => b.birthtime - a.birthtime)
      fileEntries.sort((a, b) => b.birthtime - a.birthtime)
    }
    
    // 合并所有项目：先放文件夹，再放文件
    const sortedEntries = [...dirEntries, ...fileEntries]
    
    // 生成最终的侧边栏项目
    for (const entry of sortedEntries) {
      if (entry.children) {
        // 这是目录项目
        items.push({
          text: entry.itemName, // 使用目录名，如"2025"
          collapsed: true, // 默认折叠
          items: entry.children
        })
      } else {
        // 这是文件项目
        items.push({
          text: entry.displayText,
          link: entry.linkPath
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
  '/gym/': generateSidebarFor('gym', '💪 强身健体'),
  '/podcast/': generateSidebarFor('podcast', '👂 听听播客'),
  
  // 如果需要为其他目录生成，在这里添加
  // '/product/': generateSidebarFor('product', '💼 工作笔记'),
  // '/notes/': generateSidebarFor('notes', '📝 笔记'),
}