/**
 * 生成最近更新的文档数据
 * 用于在首页显示轮播
 */

const fs = require('fs');
const path = require('path');

// 排除的目录和文件
const EXCLUDE_DIRS = ['.vitepress', '.vscode', 'public'];
const EXCLUDE_FILES = ['index.md', 'resume.md'];

/**
 * 递归获取所有 markdown 文件
 */
function getAllMarkdownFiles(dirPath, fileList = []) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!EXCLUDE_DIRS.includes(file) && !file.startsWith('.')) {
        getAllMarkdownFiles(filePath, fileList);
      }
    } else if (file.endsWith('.md') && !EXCLUDE_FILES.includes(file)) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * 从文件内容中提取标题和摘要
 */
function extractMetadata(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // 移除 YAML frontmatter
    let cleanContent = content;
    if (content.startsWith('---')) {
      const endIndex = content.indexOf('---', 3);
      if (endIndex >= 0) {
        cleanContent = content.substring(endIndex + 3).trim();
      }
    }
    
    // 提取第一个 # 标题
    const lines = cleanContent.split('\n');
    let title = path.basename(filePath, '.md');
    let summary = '';
    
    for (const line of lines) {
      if (line.startsWith('# ')) {
        title = line.replace(/^#\s+/, '').trim();
        break;
      }
    }
    
    // 提取前 2-3 行非空、非标题的内容作为摘要
    const summaryLines = [];
    for (const line of lines) {
      if (line.trim() && !line.startsWith('#') && !line.startsWith('---')) {
        summaryLines.push(line.trim());
        if (summaryLines.length >= 3) break;
      }
    }
    summary = summaryLines.join(' ').substring(0, 150);
    
    // 获取文件修改时间
    const stat = fs.statSync(filePath);
    const updateTime = new Date(stat.mtime);
    
    // 相对于 docs 目录的路径
    const docsDir = path.join(__dirname, '..', 'docs');
    const relativePath = path.relative(docsDir, filePath);
    const linkPath = '/' + relativePath.replace(/\\/g, '/').replace(/\.md$/, '');
    
    return {
      title,
      summary,
      updateTime: updateTime.getTime(),
      updateTimeStr: formatDate(updateTime),
      path: linkPath,
    };
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
    return null;
  }
}

/**
 * 格式化日期
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 主函数
 */
function generateRecentUpdates() {
  const docsDir = path.join(__dirname, '..', 'docs');
  
  console.log('🔍 正在扫描 markdown 文件...');
  
  // 获取所有 markdown 文件
  const mdFiles = getAllMarkdownFiles(docsDir);
  console.log(`📄 找到 ${mdFiles.length} 个文件`);
  
  // 提取元数据
  const updates = mdFiles
    .map((file) => extractMetadata(file))
    .filter((item) => item !== null)
    .sort((a, b) => b.updateTime - a.updateTime) // 按时间倒序排列
    .slice(0, 5); // 取前 5 条
  
  // 生成输出文件到 public 目录
  const outputPath = path.join(docsDir, 'public', 'recent-updates.json');
  fs.writeFileSync(outputPath, JSON.stringify(updates, null, 2), 'utf-8');
  
  console.log(`✅ 已生成 recent-updates.json (${updates.length} 个最新更新)`);
  console.log('📋 最近更新的文件：');
  updates.forEach((item, index) => {
    console.log(`  ${index + 1}. [${item.updateTimeStr}] ${item.title}`);
  });
}

generateRecentUpdates();
