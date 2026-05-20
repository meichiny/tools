# 朋友圈文字防折叠工具 — 开发记录

## 项目概述

单页 HTML 应用，通过多种策略使长文字在微信朋友圈发布时不被折叠。无后端依赖，通过 GitHub Pages 部署。

- 访问地址：https://meichiny.github.io/tools/wechat-moments-unfurl.html
- 代码仓库：https://github.com/meichiny/tools
- 开发流程：讨论分支（`discuss/*`）→ 确认后合并到 `main`

---

## 架构

### 页面布局（6 个卡片）

| 卡片 | 功能 |
|------|------|
| 标题 | 工具名称 + 简介 |
| 输入文案 | `<textarea>` + 实时统计（字数、行数、风险等级） |
| 反折叠策略 | 4 个策略 checkbox +「处理并复制」按钮 |
| 处理后文案 | 输出处理结果 +「复制到剪贴板」按钮；智能分段指引在此展示 |
| 朋友圈预览 | 模拟朋友圈卡片，可切换折叠/展开状态 |
| 优化建议 | 基于字数/行数的风险评估与建议 |

### 数据流

```
用户输入原始文案
  → 输入事件: getEffectiveText() → updateStats() / updatePreview()
  → 点击「处理并复制」:
      raw text
      → 1. convertWechatEmoji()  (微信表情还原, 可选)
      → 2. replaceHomoglyphs()   (同形字符替换, 可选)
      → 3. injectZeroWidth()     (零宽字符注入, 可选)
      → output + copyToClipboard()
```

---

## 反折叠策略

### 1. 零宽字符注入（默认开启）

**原理：** 在文字中按间隔插入 U+200B（Zero Width Space），改变字节序列特征，使微信的复制粘贴检测失效，判定为"手动输入"。

**实现：** `injectZeroWidth()`

- 按 grapheme cluster 遍历文本
- CJK 字符：每 3 个 grapheme 插入 1 个 ZWSP
- 非 CJK 字符：每 5 个 grapheme 插入 1 个 ZWSP
- 首尾各额外加 1 个 ZWSP
- `\n` 和 `\r` 换行符旁不插入
- ZWJ（U+200D）和 Variation Selector（U+FE0F）旁不插入（保护复杂 emoji）
- 详见 [emoji 兼容性处理](#emoji-兼容性处理)

### 2. 同形字符替换（默认关闭）

**原理：** 将全角中文标点替换为 ASCII/Unicode 同形字符，改变文本指纹。

**实现：** `replaceHomoglyphs()`

| 原字符 | 替换为 |
|--------|--------|
| `，` U+FF0C | `,` U+002C |
| `。` U+3002 | `.` U+002E |
| `；` U+FF1B | `;` U+003B |
| `：` U+FF1A | `:` U+003A |
| `！` U+FF01 | `!` U+0021 |
| `？` U+FF1F | `?` U+003F |

### 3. 微信表情还原（默认开启）

**原理：** 将从微信复制的 `[微笑]` 样式表情码替换为 Unicode emoji。

**实现：** `convertWechatEmoji()`

- 正则 `/\[[^\[\]]+\]/g` 匹配方括号内容
- 命中已知表情码则替换为对应 Unicode emoji
- 未命中的 `[未知]` 保留原样
- 覆盖 140+ 种微信表情码（经典 88 个 + 新版表情）
- 影响预览和统计的显示（通过 `getEffectiveText()`）

### 4. 智能分段指引（默认关闭）

**原理：** 超长文本自动分段（每段 ≤ 80 grapheme），生成分段粘贴操作指引。

**实现：** `segmentText()`

- 按 grapheme 边界分段，不会截断 emoji
- > 100 grapheme 时触发
- 第一段包含完整操作指引，后续段简化提示

---

## 统计与风险评估

### 行数估算 `calcEstLines()`

- 先按 `\n` 拆分为实际段落
- 每段分别估算视觉行数：`Math.ceil(graphemeCount / 25)`
- 空行计 1 行
- 确保手动换行被正确计入

### 风险评估 `assessRisk()`

| 条件 | 风险等级 | 提示 |
|------|:--------:|------|
| > 200 grapheme | 高 | "高度风险被折叠为一行" |
| 100–200 grapheme | 中 | "有一定风险被折叠" |
| > 6 行 | 信息 | "将显示「全文」按钮" |
| 其他 | 低 | "直接发布风险较低" |

---

## Emoji 兼容性处理

经历了 3 个迭代阶段：

### 阶段 1：初始实现

- `injectZeroWidth()` 按 UTF-16 编码单元遍历
- 问题：复杂 emoji（`👨‍👩‍👧‍👦`）由多个编码单元组成，ZWSP 插入到 emoji 内部导致显示异常
- `calcEstLines()` 用 `text.length` 统计，1 个 ZWJ emoji 数成 11 个字

### 阶段 2：Grapheme Cluster 感知

- 引入 `Intl.Segmenter` API，按用户可见字符（grapheme cluster）遍历
- 新增 `eachGrapheme()` / `countGraphemes()` / `clustersToArray()` 辅助函数
- 修复了：`injectZeroWidth()`、`calcEstLines()`、`assessRisk()`、`segmentText()`
- 回退方案：低版本浏览器使用 `for...of` 至少处理代理对

### 阶段 3：ZWJ/VS 跳过检查

- 部分浏览器 `Intl.Segmenter` 将 ZWJ 序列拆为多个 cluster
- 在 ZWSP 插入逻辑中增加 ZWJ（U+200D）和 VS（U+FE0F）的跳过检查
- 保证跨浏览器兼容性

### 阶段 4：微信表情码还原

- 新增 140+ 条 `[微笑]` → `😊` 映射
- 作为预处理步骤在反折叠策略之前运行
- 预览和统计同步使用转换后文本（`getEffectiveText()`）

---

## 分支历史

按时间从旧到新：

| 分支 | commit | 说明 |
|------|--------|------|
| `main` | `e2a723b` | 初始创建：工具基本功能，4 个卡片，3 种策略 |
| `discuss/emoji-handling` | `5e21275` | 引入 `Intl.Segmenter`，grapheme cluster 感知修复 |
| `(同上)` | `501a60b` | 增加 ZWJ/VS 跳过检查，跨浏览器兼容 |
| `discuss/wechat-emoji-convert` | `0d28318` | 微信 `[微笑]` → Unicode emoji 还原 |
| `discuss/line-count-fix` | `bd6da5b` | `calcEstLines()` 尊重手动换行 |
| `discuss/preview-emoji-fix` | `603fc91` | 预览/统计使用 emoji 转换后文本 |

---

## 测试方式

```bash
# 克隆仓库
git clone https://github.com/meichiny/tools.git
cd tools

# 直接打开（无需构建）
open wechat-moments-unfurl.html

# 或通过 GitHub Pages
# https://meichiny.github.io/tools/wechat-moments-unfurl.html
```

测试用例：

```
输入                        → 预期行为
─────────────────────────────────────────────────
纯中文文字                  → ZWSP 正常插入，行数正确
含 😊 等原生 emoji          → emoji 完整保留，不被 ZWSP 破坏
含 👨‍👩‍👧‍👦 ZWJ 序列 emoji    → 家庭 emoji 完整保留
含 [微笑][流泪] 微信表情码   → 替换为 😊😭
含 [未知内容]               → 保留原样，不替换
多行文字（手动换行）         → 行数按实际段落 + 字数估算
超 200 字 / 6 行            → 风险提示正确
```

---

## 部署

通过 GitHub Pages 自动部署。推送 `main` 分支后，约 1–2 分钟生效。

- 绑定域名：`meichiny.github.io`
- 仓库路径：`/tools/`
- 完整 URL：`https://meichiny.github.io/tools/wechat-moments-unfurl.html`
