// scripts/generate-index.js
const fs = require('fs');
const path = require('path');

// 配置：你要生成索引的目录
const TARGET_DIRS = [
  { input: 'docs/dairy/2025/', title: '2025 年日记' },
  { input: 'docs/recipe/', title: '吃货美食菜谱精选' },
  // 可以添加更多目录
];

/**
 * 智能格式化文件名
 * 处理不同类型的文件名：
 * 1. "01-新年计划" -> "新年计划"
 * 2. "12月2日" -> "12月2日" (保持不变)
 * 3. "2024-12-01-文章" -> "文章"
 */
function formatDisplayName(fileName) {
  let displayName = fileName;
  
  // 情况1：处理 "数字-文字" 格式（如 "01-新年计划"）
  // 匹配开头是数字，后面跟着连字符或点的模式
  const prefixMatch = displayName.match(/^(\d+)[-\.]\s*(.+)/);
  if (prefixMatch) {
    // 如果是 "01-新年计划" 这种格式，移除数字前缀
    displayName = prefixMatch[2];
  }
  
  // 情况2：处理包含中文字符的日期（如 "12月2日"）
  // 如果包含中文月份关键词，保持原样
  const hasChineseMonth = /[一二三四五六七八九十]月|\d+月/.test(displayName);
  if (hasChineseMonth) {
    // 包含中文月份，不进行进一步处理
    return displayName;
  }
  
  // 情况3：处理英文连字符和下划线
  displayName = displayName.replace(/[-_]/g, ' ');
  
  // 情况4：英文单词首字母大写（不影响中文）
  displayName = displayName.replace(/\b[a-z]/g, (match) => match.toUpperCase());
  
  return displayName;
}

/**
 * 生成一个目录的索引页
 */
function generateIndexForDir(dirConfig) {
  const { input, title } = dirConfig;
  const indexPath = path.join(__dirname, '..', input, 'index.md');
  
  console.log(`📁 正在处理: ${input}`);
  
  // 检查目标目录是否存在
  if (!fs.existsSync(path.dirname(indexPath))) {
    console.log(`  ⚠️  目录不存在，跳过: ${input}`);
    return;
  }
  
  // 读取目录中的所有文件
  const files = fs.readdirSync(path.dirname(indexPath));
  
  // 筛选出 .md 文件，排除 index.md 本身
  const mdFiles = files.filter(file => {
    return file.endsWith('.md') && file !== 'index.md';
  });
  
  // 按文件名排序（你可以自定义排序规则）
  mdFiles.sort((a, b) => {
    // 提取文件名中的数字前缀进行排序
    const numA = parseInt(a.match(/^(\d+)/)?.[1] || 0);
    const numB = parseInt(b.match(/^(\d+)/)?.[1] || 0);
    return numA - numB; // 升序排列
  });
  
  // 生成文章列表的Markdown内容
  let listContent = '';
  let totalCount = 0;
  
  mdFiles.forEach(file => {
    const fileName = file.replace('.md', '');
    // 使用智能格式化函数
    const displayName = formatDisplayName(fileName);
    
    listContent += `- [${displayName}](${fileName})\n`;
    totalCount++;
  });
  
  // 完整的索引页内容
  const indexContent = `---
title: ${title}
description: ${title} - 自动生成的索引页
---

# ${title}

共 ${totalCount} 篇文章，按时间顺序排列。

## 📋 文章列表

${listContent}

---

> 🚀 本页面由脚本自动生成，最后更新于：${new Date().toLocaleDateString('zh-CN')}
`;

  // 写入文件
  fs.writeFileSync(indexPath, indexContent, 'utf8');
  console.log(`  ✅ 已生成索引: ${input} (${totalCount}篇文章)`);
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 开始生成目录索引...');
  
  TARGET_DIRS.forEach(generateIndexForDir);
  
  console.log('\n🎉 索引生成完成！');
}

// 执行主函数
if (require.main === module) {
  main();
}