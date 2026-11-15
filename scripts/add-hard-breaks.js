/**
 * 给日记文档补硬换行：
 * 1) 连续短句之间的软换行 -> 行尾 <br>
 * 2) 同一行内「句末标点 + 空格 + 下一句」-> <br>
 */
const fs = require('fs')
const path = require('path')

function isStructural(line) {
  const t = line.trim()
  if (!t) return true
  if (/^#{1,6}\s/.test(t)) return true
  if (t === '---') return true
  if (/^[-*+]\s/.test(t)) return true
  if (/^\d+\.\s/.test(t)) return true
  if (/^\|.+\|/.test(t)) return true
  if (/^>\s?/.test(t)) return true
  if (/^```/.test(t)) return true
  return false
}

function endsWithBreak(line) {
  return /<br\s*\/?>\s*$/i.test(line) || / {2}$/.test(line)
}

function breakInlineSentenceSpaces(line) {
  // 同一行：句末标点 + 空格 + 下一句
  return line.replace(
    /([。！？!?…～~])([ \t]+)(?=[\u4e00-\u9fffA-Za-z0-9「『"“‘（(【])/g,
    '$1<br>'
  )
}

function processFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8')
  const lines = raw.split(/\r?\n/)
  let changed = 0
  const out = []

  let i = 0
  if (lines[0] === '---') {
    out.push(lines[0])
    i = 1
    while (i < lines.length) {
      out.push(lines[i])
      if (lines[i] === '---') {
        i++
        break
      }
      i++
    }
  }

  for (; i < lines.length; i++) {
    let line = lines[i]
    const beforeInline = line
    line = breakInlineSentenceSpaces(line)
    if (line !== beforeInline) changed++

    const next = i + 1 < lines.length ? lines[i + 1] : ''
    if (
      !isStructural(line) &&
      next !== '' &&
      !isStructural(next) &&
      !endsWithBreak(line)
    ) {
      line = line.replace(/\s+$/, '') + '<br>'
      changed++
    }
    out.push(line)
  }

  const result = out.join('\n')
  if (result !== raw) fs.writeFileSync(filePath, result, 'utf8')
  return changed
}

const results = []

for (const y of [2021, 2022, 2023, 2024]) {
  const n = processFile(path.join('docs/dairy', `${y}.md`))
  results.push(`${y}.md: ${n}`)
}

for (const y of [2020, 2025, 2026]) {
  const dir = path.join('docs/dairy', String(y))
  let total = 0
  let touchedFiles = 0
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith('.md') || name === 'index.md') continue
    const n = processFile(path.join(dir, name))
    if (n > 0) {
      total += n
      touchedFiles++
    }
  }
  results.push(`${y}/: ${touchedFiles} files, ${total} breaks`)
}

console.log(results.join('\n'))

for (const y of [2021, 2022, 2023, 2024]) {
  const t = fs.readFileSync(path.join('docs/dairy', `${y}.md`), 'utf8')
  console.log(`verify ${y}.md br=${(t.match(/<br/g) || []).length}`)
}

for (const y of [2020, 2025, 2026]) {
  let br = 0
  const dir = path.join('docs/dairy', String(y))
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.md') || f === 'index.md') continue
    br += (fs.readFileSync(path.join(dir, f), 'utf8').match(/<br/g) || []).length
  }
  console.log(`verify ${y}/ br=${br}`)
}

const sample = fs.readFileSync('docs/dairy/2023.md', 'utf8')
const idx = sample.indexOf('# 2023年12月31日')
console.log('--- sample ---')
console.log(sample.slice(idx, idx + 380))
