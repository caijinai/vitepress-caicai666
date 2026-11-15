/**
 * 将指定年份目录下的日记合并为 docs/dairy/YYYY.md
 * 每个原文件标题变为合并文档中的一级标题，便于文章目录跳转
 */
const fs = require('fs')
const path = require('path')

const YEARS = process.argv.slice(2).map(Number).filter(Boolean)
const DEFAULT_YEARS = [2016, 2017, 2018, 2019, 2021, 2022, 2023, 2024]
const yearsToMerge = YEARS.length > 0 ? YEARS : DEFAULT_YEARS
const dairyDir = path.join(__dirname, '..', 'docs', 'dairy')

function extractDate(fileName) {
  const chinese = fileName.match(/(\d{1,2})月(\d{1,2})日/)
  if (chinese) {
    return new Date(2000, parseInt(chinese[1], 10) - 1, parseInt(chinese[2], 10))
  }
  const standard = fileName.match(/(\d{4})-(\d{1,2})-(\d{1,2})/)
  if (standard) {
    return new Date(
      parseInt(standard[1], 10),
      parseInt(standard[2], 10) - 1,
      parseInt(standard[3], 10)
    )
  }
  return new Date(1970, 0, 1)
}

function stripFrontmatter(content) {
  if (!content.startsWith('---')) return content
  const end = content.indexOf('\n---', 3)
  if (end === -1) return content
  return content.slice(end + 4).replace(/^\r?\n/, '')
}

function demoteHeadings(body) {
  return body.replace(/^(#{1,5})(\s+)/gm, (_, hashes, space) => `#${hashes}${space}`)
}

function parseEntry(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8')
  const content = stripFrontmatter(raw).trim()
  const baseName = path.basename(filePath, '.md')

  const lines = content.split(/\r?\n/)
  let title = baseName
  let bodyStart = 0

  if (lines[0] && /^#\s+/.test(lines[0])) {
    title = lines[0].replace(/^#\s+/, '').trim() || baseName
    bodyStart = 1
    while (bodyStart < lines.length && lines[bodyStart].trim() === '') bodyStart++
  }

  const body = demoteHeadings(lines.slice(bodyStart).join('\n').trim())
  return { title, body, date: extractDate(baseName), file: baseName }
}

function mergeYear(year) {
  const yearDir = path.join(dairyDir, String(year))
  const outFile = path.join(dairyDir, `${year}.md`)

  if (!fs.existsSync(yearDir) || !fs.statSync(yearDir).isDirectory()) {
    console.warn(`⏭️  跳过 ${year}：目录不存在`)
    return false
  }

  const files = fs
    .readdirSync(yearDir)
    .filter((name) => name.endsWith('.md') && name !== 'index.md')
    .map((name) => path.join(yearDir, name))

  if (files.length === 0) {
    console.warn(`⏭️  跳过 ${year}：没有 markdown 文件`)
    return false
  }

  const entries = files
    .map(parseEntry)
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  const sections = entries.map((entry) => {
    const parts = [`# ${entry.title}`]
    if (entry.body) parts.push(entry.body)
    return parts.join('\n\n')
  })

  const output = [
    '---',
    `title: ${year}年日记`,
    `description: ${year}年日记合集，共 ${entries.length} 篇`,
    '---',
    '',
    ...sections,
    ''
  ].join('\n')

  fs.writeFileSync(outFile, output, 'utf8')
  console.log(`✅ 已合并 ${year}：${entries.length} 篇 -> dairy/${year}.md`)

  fs.rmSync(yearDir, { recursive: true, force: true })
  console.log(`🗑️  已删除目录 dairy/${year}/`)
  return true
}

console.log('🚀 开始合并日记年份...\n')
for (const year of yearsToMerge) {
  mergeYear(year)
}
console.log('\n🎉 合并完成')
