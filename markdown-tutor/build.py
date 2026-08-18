#!/usr/bin/env python3
"""构建单文件 index.html：把 highlight.js 和 markdown-it 内嵌进 template.html"""
import pathlib

root = pathlib.Path(__file__).parent
tpl = (root / "template.html").read_text(encoding="utf-8")
hl = (root / "highlight.min.js").read_text(encoding="utf-8")
md = (root / "markdown-it.min.js").read_text(encoding="utf-8")

assert "/*__HIGHLIGHT_JS_SRC__*/" in tpl, "highlight 占位符缺失"
assert "/*__MARKDOWN_IT_SRC__*/" in tpl, "markdown-it 占位符缺失"

out = tpl.replace("/*__HIGHLIGHT_JS_SRC__*/", hl).replace("/*__MARKDOWN_IT_SRC__*/", md)
(root / "index.html").write_text(out, encoding="utf-8")
print(f"✅ 构建完成: index.html = {len(out.encode('utf-8'))} bytes ({len(out.encode('utf-8'))/1024:.1f} KB)")
