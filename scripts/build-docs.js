const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter');

// 导入版本配置
const versionsPath = path.join(__dirname, '../src/config/versions.ts');
const versionsContent = fs.readFileSync(versionsPath, 'utf-8');

// 简单解析版本配置（提取VERSIONS数组）
const versionsMatch = versionsContent.match(/export const VERSIONS = \[([\s\S]*?)\];/);
if (!versionsMatch) {
  throw new Error('Could not parse VERSIONS from versions.ts');
}

// 提取版本ID
const versionIds = [];
const versionEntries = versionsMatch[1].split('},').map(entry => entry.trim());
for (const entry of versionEntries) {
  const idMatch = entry.match(/id:\s*['"`]([^'"`]+)['"`]/);
  if (idMatch) {
    versionIds.push(idMatch[1]);
  }
}

console.log('Found configured versions:', versionIds);

// 配置marked
const renderer = new marked.Renderer();

// 自定义标题渲染器，添加ID
renderer.heading = function(text, level, raw) {
  const textContent = typeof text === 'string' ? text : (text.text || raw || '');
  const id = textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `<h${level} id="${id}">${textContent}</h${level}>`;
};

marked.setOptions({
  renderer: renderer,
  highlight: function(code, lang) {
    return `<pre><code class="language-${lang}">${code}</code></pre>`;
  },
  breaks: true,
  gfm: true,
});

async function buildDocs() {
  const contentDir = path.join(__dirname, '../content');
  const outputDir = path.join(__dirname, '../src/data');
  
  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 只处理配置文件中指定的版本
  const docsData = {};

  for (const version of versionIds) {
    const file = `${version}.md`;
    const filePath = path.join(contentDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    // 解析frontmatter和内容
    const { data: frontmatter, content } = matter(fileContent);
    
    // 分割内容为sections（基于h2标题）
    const sections = [];
    const sectionLines = content.split('\n');
    let currentSection = { id: '', title: '', content: '', level: 0, toc: [] };
    let sectionContent = [];

    for (const line of sectionLines) {
      const h1Match = line.match(/^# (.+)$/);
      const h2Match = line.match(/^## (.+)$/);
      
      if (h1Match) {
        // 主标题，跳过
        continue;
      } else if (h2Match) {
        // 保存上一个section
        if (currentSection.title) {
          // 处理当前section的内容和TOC
          const sectionContentStr = sectionContent.join('\n');
          currentSection.content = await marked(sectionContentStr);
          
          // 提取当前section的TOC
          const sectionToc = [];
          for (const sectionLine of sectionContent) {
            const h3Match = sectionLine.match(/^### (.+)$/);
            const h4Match = sectionLine.match(/^#### (.+)$/);
            
            if (h3Match) {
              const title = h3Match[1];
              sectionToc.push({
                id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
                title,
                level: 3
              });
            } else if (h4Match) {
              const title = h4Match[1];
              sectionToc.push({
                id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
                title,
                level: 4
              });
            }
          }
          currentSection.toc = sectionToc;
          sections.push({ ...currentSection });
        }
        
        // 开始新section
        const title = h2Match[1];
        currentSection = {
          id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
          title,
          content: '',
          level: 2,
          toc: []
        };
        sectionContent = [line];
      } else {
        sectionContent.push(line);
      }
    }

    // 添加最后一个section
    if (currentSection.title) {
      const sectionContentStr = sectionContent.join('\n');
      currentSection.content = await marked(sectionContentStr);
      
      // 提取最后一个section的TOC
      const sectionToc = [];
      for (const sectionLine of sectionContent) {
        const h3Match = sectionLine.match(/^### (.+)$/);
        const h4Match = sectionLine.match(/^#### (.+)$/);
        
        if (h3Match) {
          const title = h3Match[1];
          sectionToc.push({
            id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
            title,
            level: 3
          });
        } else if (h4Match) {
          const title = h4Match[1];
          sectionToc.push({
            id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
            title,
            level: 4
          });
        }
      }
      currentSection.toc = sectionToc;
      sections.push(currentSection);
    }

    // 如果没有sections，将整个内容作为一个section
    if (sections.length === 0) {
      const htmlContent = await marked(content);
      sections.push({
        id: 'main',
        title: frontmatter.title || `frx ${version}`,
        content: htmlContent,
        level: 1,
        toc: []
      });
    }

    // 生成导航结构
    const navigation = sections.map(section => ({
      id: section.id,
      title: section.title,
      href: `/docs/${version}/${section.id}`
    }));

    docsData[version] = {
      title: frontmatter.title || `frx ${version}`,
      version,
      sections,
      navigation
    };
  }

  // 写入JSON文件
  fs.writeFileSync(
    path.join(outputDir, 'docs.json'),
    JSON.stringify(docsData, null, 2)
  );

  console.log('Documentation built successfully!');
  console.log(`Generated data for versions: ${Object.keys(docsData).join(', ')}`);
}

buildDocs().catch(console.error);