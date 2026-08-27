// 装机小课堂 → 小红书小工具适配构建脚本
// 输入: ../install-game.html (原单文件网页版)
// 输出: minitool/index.html + minitool/app.js → install-game-xhs.zip
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'install-game.html');
const OUT_DIR = path.join(__dirname, 'minitool');

// ---------- 1. 读取并拆分 ----------
const html = fs.readFileSync(SRC, 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) { console.error('❌ 未找到内联 script'); process.exit(1); }
const js = scriptMatch[1];

// ---------- 2. 构建 index.html ----------
let head = html;

// 2.1 移除内联 script（改外置）
head = head.replace(scriptMatch[0], '');

// 2.1b 移除网页版页脚（footer.js：容器内无意义且外链被禁）
head = head.replace('<script src="footer.js"></script>', '');

// 2.2 viewport 对齐容器模板（禁缩放）
head = head.replace(
  'content="width=device-width, initial-scale=1.0, viewport-fit=cover"',
  'content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"'
);

// 2.3 安全区改用 var(--safe-area-inset-*, env(...)) 组合（PC 模拟器 + 真机兼容）
head = head.replace(
  'padding: calc(12px + env(safe-area-inset-top, 0px)) 14px calc(20px + env(safe-area-inset-bottom, 0px));',
  'padding: calc(12px + var(--safe-area-inset-top, env(safe-area-inset-top, 0px))) 14px calc(20px + var(--safe-area-inset-bottom, env(safe-area-inset-bottom, 0px)));'
);

// 2.4 触摸优化
head = head.replace(
  'html, body { min-height: 100%; }',
  'html, body { min-height: 100%; }\n  html { touch-action: manipulation; }'
);

// 2.4b 容器顶部悬浮按钮（回退/分享）预留空间：仅容器环境生效（body 级统一下移）
const bodyIdx = head.indexOf('  body {');
const bodyEnd = head.indexOf('\n  }', bodyIdx) + 4;
head = head.slice(0, bodyEnd) +
  `\n  /* 容器顶部悬浮按钮（回退/分享）预留：容器内 52px + 安全区，浏览器版不受影响 */\n  .in-container { padding-top: calc(52px + var(--safe-area-inset-top, env(safe-area-inset-top, 0px))); }` +
  head.slice(bodyEnd);

// 2.5 预览弹层（浏览器降级：长按/右键保存成绩单）
const previewOverlay = `  <!-- ========== 成绩单预览（浏览器环境） ========== -->
  <div class="overlay" id="overlay-preview">
    <div class="overlay-card" style="max-width:480px;">
      <img id="preview-img" alt="成绩单" style="width:100%; border:3px solid #2b2b2b; border-radius:14px; display:block;">
      <p style="margin:12px 0 4px; font-size:15px; color:#7a7265;">长按图片或右键可保存 📸</p>
      <button class="btn" id="btn-preview-close" style="margin-top:10px;">关闭</button>
    </div>
  </div>`;
head = head.replace('<div id="toast"></div>', previewOverlay + '\n  <div id="toast"></div>');

// 2.6 引入外置脚本
head = head.replace('</body>', '  <script src="./app.js"></script>\n</body>');

// ---------- 3. 构建 app.js ----------
let appjs = js;

// 3.0 容器环境检测：顶部悬浮按钮预留（须在业务逻辑前执行，body 已就绪）
appjs = `// 容器顶部悬浮按钮（回退/分享）预留空间：仅容器环境生效
if (window.xhs && window.xhs.miniTool) { document.body.classList.add('in-container'); }
` + appjs;

// 3.1 saveShareImage：容器走 JSBridge 存相册，浏览器降级为预览
const newSaveShare = `function saveShareImage() {
  const url = drawShareCard();
  if (window.xhs && window.xhs.miniTool && window.xhs.miniTool.saveImageToPhotosAlbum) {
    // 小工具容器：保存到系统相册
    window.xhs.miniTool.saveImageToPhotosAlbum({ filePath: url })
      .then(() => showToast('📸 成绩单已保存到相册！'))
      .catch(err => showToast('保存失败：' + ((err && err.errMsg) || '未知错误')));
  } else {
    // 普通浏览器：展示大图，长按/右键保存
    showPreview(url);
  }
}
function showPreview(url) {
  document.getElementById('preview-img').src = url;
  document.getElementById('overlay-preview').classList.add('show');
}
function hidePreview() {
  document.getElementById('overlay-preview').classList.remove('show');
}
document.getElementById('btn-preview-close').addEventListener('click', () => { sfx.click(); hidePreview(); });
document.getElementById('overlay-preview').addEventListener('click', (e) => { if (e.target === e.currentTarget) hidePreview(); });`;
appjs = appjs.replace(/function saveShareImage\(\) \{[\s\S]*?\n\}/, newSaveShare);

// ---------- 4. 写出 ----------
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, 'index.html'), head);
fs.writeFileSync(path.join(OUT_DIR, 'app.js'), appjs);

// ---------- 5. 自检 ----------
const outHtml = fs.readFileSync(path.join(OUT_DIR, 'index.html'), 'utf8');
const outJs = appjs;
const check = (name, cond) => console.log((cond ? '  ✅' : '  ❌') + ' ' + name);

check('内联 script 已移除', !/<script>[\s\S]*?<\/script>/.test(outHtml));
check('页脚 footer.js 已从容器版移除', !outHtml.includes('footer.js'));
check('外置 script src 已加', /<script src="\.\/app\.js"><\/script>/.test(outHtml));
check('viewport 含禁缩放', outHtml.includes('maximum-scale=1.0, user-scalable=no'));
check('a[download] 已移除', !/\.download\s*=/.test(outJs) && !/download=/.test(outJs));
check('JSBridge 存相册已接入', outJs.includes('saveImageToPhotosAlbum'));
check('浏览器降级预览已接入', outJs.includes('showPreview'));
check('容器顶部预留 CSS 已注入', outHtml.includes('.in-container'));
check('容器检测 JS 已注入', outJs.includes("classList.add('in-container')"));
check('无外部 http(s) 资源引用', !/https?:\/\/[^"' )]+/.test(outHtml) || !/src="https?:|href="https?:|url\(https?:/.test(outHtml));
check('无 eval/new Function', !/\beval\(|new Function/.test(outJs));
check('无 window.open/prompt', !/window\.open|window\.prompt/.test(outJs));
check('无 type=module', !/type=["']module["']/.test(outHtml));
check('无 <base href>/CSP meta', !/<base href/i.test(outHtml) && !/Content-Security-Policy/i.test(outHtml));
check('无 iframe/object', !/<iframe|<object/.test(outHtml));

console.log('\n📦 构建完成:');
console.log('  ' + path.join(OUT_DIR, 'index.html'), '(' + outHtml.length + ' B)');
console.log('  ' + path.join(OUT_DIR, 'app.js'), '(' + outJs.length + ' B)');
