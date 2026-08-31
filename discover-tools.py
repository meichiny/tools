#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
发现候选工具：搜索 GitHub 上 topic:yt-dlp 的高星仓库，
筛选「未收录 + star ≥ 100 + 近 6 个月有更新」的候选，
生成 candidates/YYYY-MM-DD-yt-dlp-candidates.md 供人工审核。

用法：
  python3 discover-tools.py
  GH_TOKEN=xxx python3 discover-tools.py
"""
import json
import os
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timezone, timedelta

BASE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(BASE, 'yt-dlp-tools.json')
CAND_DIR = os.path.join(BASE, 'candidates')
TOKEN = os.environ.get('GH_TOKEN', '')
MIN_STARS = 100
ACTIVE_DAYS = 180  # 6 个月内有更新


def api(url):
    req = urllib.request.Request(url, headers={
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'yt-dlp-tools-discover',
    })
    if TOKEN:
        req.add_header('Authorization', 'Bearer ' + TOKEN)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def parse_date(s):
    if not s:
        return None
    if len(s) == 10:  # YYYY-MM-DD，按 UTC 处理
        s = s + 'T00:00:00+00:00'
    else:
        s = s.replace('Z', '+00:00')
        if '+' not in s:
            s = s + '+00:00'
    try:
        return datetime.fromisoformat(s)
    except ValueError:
        return None


def main():
    with open(DATA, encoding='utf-8') as f:
        data = json.load(f)
    known = {t['repo'].lower() for c in data['categories'] for t in c['tools']}

    q = urllib.parse.quote('topic:yt-dlp')
    result = api(f'https://api.github.com/search/repositories?q={q}&sort=stars&order=desc&per_page=50')

    now = datetime.now(timezone.utc)
    cut = now - timedelta(days=ACTIVE_DAYS)
    cands = []
    for it in result.get('items', []):
        repo = it['full_name']
        if repo.lower() in known:
            continue
        stars = it.get('stargazers_count') or 0
        pushed = (it.get('pushed_at') or '')[:10]
        if stars < MIN_STARS:
            continue
        pushed_dt = parse_date(pushed)
        if pushed_dt is None or pushed_dt < cut:
            continue
        cands.append({
            'repo': repo,
            'stars': stars,
            'lastPush': pushed,
            'desc': (it.get('description') or '').strip()[:120],
            'archived': bool(it.get('archived')),
            'lang': it.get('language') or '',
        })

    cands.sort(key=lambda x: -x['stars'])
    os.makedirs(CAND_DIR, exist_ok=True)
    date = now.strftime('%Y-%m-%d')
    path = os.path.join(CAND_DIR, f'{date}-yt-dlp-candidates.md')

    with open(path, 'w', encoding='utf-8') as f:
        f.write(f'# yt-dlp 候选工具（{date}）\n\n')
        f.write(f'筛选标准：star ≥ {MIN_STARS}、近 {ACTIVE_DAYS} 天有更新、尚未收录。\n')
        f.write('收录前请人工确认：确实是 yt-dlp 下载后端、维护状态良好、值得推荐。\n\n')
        if not cands:
            f.write('本次没有发现新候选。\n')
        for i, c in enumerate(cands, 1):
            f.write(f'{i}. **[{c["repo"]}](https://github.com/{c["repo"]})** ⭐{c["stars"]}（最后更新 {c["lastPush"]}）{(" · " + c["lang"]) if c["lang"] else ""}\n')
            if c['desc']:
                f.write(f'   {c["desc"]}\n')
            f.write('\n')

    print(f'发现 {len(cands)} 个候选 → {os.path.relpath(path, BASE)}')

    summary = os.environ.get('GITHUB_STEP_SUMMARY')
    if summary:
        with open(summary, 'a', encoding='utf-8') as f:
            f.write(f'## 候选发现（{date}）\n\n共 {len(cands)} 个候选，见 `candidates/{date}-yt-dlp-candidates.md`\n')
            for c in cands[:10]:
                f.write(f'- `{c["repo"]}` ⭐{c["stars"]}\n')


if __name__ == '__main__':
    main()
