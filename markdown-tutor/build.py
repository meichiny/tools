#!/usr/bin/env python3
"""构建单文件 markdown-tutor.html：把 highlight.js 和 markdown-it 内嵌进 template.html（输出到仓库根目录，即部署文件）"""
import pathlib

root = pathlib.Path(__file__).parent
repo = root.parent
tpl = (root / "template.html").read_text(encoding="utf-8")
hl = (root / "highlight.min.js").read_text(encoding="utf-8")
md = (root / "markdown-it.min.js").read_text(encoding="utf-8")

assert "/*__HIGHLIGHT_JS_SRC__*/" in tpl, "highlight 占位符缺失"
assert "/*__MARKDOWN_IT_SRC__*/" in tpl, "markdown-it 占位符缺失"

out = tpl.replace("/*__HIGHLIGHT_JS_SRC__*/", hl).replace("/*__MARKDOWN_IT_SRC__*/", md)
(repo / "markdown-tutor.html").write_text(out, encoding="utf-8")
print(f"✅ 构建完成: markdown-tutor.html = {len(out.encode('utf-8'))} bytes ({len(out.encode('utf-8'))/1024:.1f} KB)")
