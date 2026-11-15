/**
 * 给日记标题补上年份：
 * 1) 合并文档 YYYY.md：每个一级标题前加「YYYY年」
 * 2) 按日文档（2020/2025/2026）：文件名 + 文内一级标题都加「YYYY年」
 */
const fs = require('fs')
const path = require('path')

const dairyDir = path.join(__dirname, '..', 'docs', 'dairy')
const MERGED_YEARS = [2016, 2017, 2018, 2019, 2021, 2022, 2023, 2024]
const DAILY_YEARS = [2020, 2025, 2026]

function ensureYearPrefix(title, year) {
  const trimmed = title.trim()
  if (new RegExp(`^${year}年`).test(trimmed)) return trimmed
  if (/^\d{4}年/.test(trimmed)) {
    // 已有其他年份前缀时，替换为当前目录年份
    return trimmed.replace(/^\d{4}年/, `${year}年`)
  }
  return `${year}年${trimmed}`
}

function updateH1Content(content, year) {
  let changed = false
  const next = content.replace(/^#\s+(.+)$/m, (match, title) => {
    // 只改文首第一个一级标题（文档标题）
    const updated = ensureYearPrefix(title, year)
    if (updated !== title.trim()) changed = true
    return `# ${updated}`
  })
  return { content: next, changed }
}

function updateMergedYearFile(year) {
  const filePath = path.join(dairyDir, `${year}.md`)
  if (!fs.existsSync(filePath)) {
    console.warn(`⏭️  跳过合并文档：${year}.md 不存在`)
    return
  }

  const original = fs.readFileSync(filePath, 'utf8')
  let count = 0
  const updated = original.replace(/^#\s+(.+)$/gm, (match, title) => {
    const nextTitle = ensureYearPrefix(title, year)
    if (nextTitle !== title.trim()) count++
    return `# ${nextTitle}`
  })

  if (updated !== original) {
    fs.writeFileSync(filePath, updated, 'utf8')
  }
  console.log(`✅ 合并文档 ${year}.md：更新 ${count} 个一级标题`)
}

function updateDailyYearDir(year) {
  const yearDir = path.join(dairyDir, String(year))
  if (!fs.existsSync(yearDir)) {
    console.warn(`⏭️  跳过目录：${year}/ 不存在`)
    return
  }

  const files = fs
    .readdirSync(yearDir)
    .filter((name) => name.endsWith('.md') && name !== 'index.md')

  let renamed = 0
  let h1Updated = 0

  for (const file of files) {
    const oldPath = path.join(yearDir, file)
    const baseName = file.replace(/\.md$/, '')
    const newBaseName = ensureYearPrefix(baseName, year)
    const newFile = `${newBaseName}.md`
    const newPath = path.join(yearDir, newFile)

    let content = fs.readFileSync(oldPath, 'utf8')
    const result = updateH1Content(content, year)
    content = result.content
    if (result.changed) h1Updated++

    // 若文内没有一级标题，补一个
    if (!/^#\s+/m.test(content.trim()) && !content.trim().startsWith('---')) {
      content = `# ${newBaseName}\n\n${content}`
      h1Updated++
    } else if (content.startsWith('---')) {
      // frontmatter 后若无 h1，不强制插入，保持原结构
    }

    if (newFile !== file) {
      if (fs.existsSync(newPath) && path.resolve(newPath) !== path.resolve(oldPath)) {
        console.warn(`⚠️  目标已存在，跳过重命名: ${newFile}`)
        fs.writeFileSync(oldPath, content, 'utf8')
        continue
      }
      fs.writeFileSync(newPath, content, 'utf8')
      fs.unlinkSync(oldPath)
      renamed++
    } else {
      fs.writeFileSync(oldPath, content, 'utf8')
    }
  }

  console.log(`✅ 目录 ${year}/：重命名 ${renamed} 个文件，更新 ${h1Updated} 个文内标题`)
}

console.log('🚀 开始为日记标题补充年份...\n')

for (const year of MERGED_YEARS) {
  updateMergedYearFile(year)
}

for (const year of DAILY_YEARS) {
  updateDailyYearDir(year)
}

console.log('\n🎉 标题年份处理完成')
