#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
更新 yt-dlp-tools.json 的数据快照：
- stars / lastPush 从 GitHub API 实时拉取
- 检测停更：仓库已归档（archived）或 12 个月以上没有推送 → 标记 stale
- 更新 meta.updatedAt

用法：
  python3 update-data.py          # 匿名调用（限速 60 次/小时）
  GH_TOKEN=xxx python3 update-data.py   # 带 token（限速 5000 次/小时）
"""
import json
import os
import sys
import urllib.request
from datetime import datetime, timezone, timedelta

BASE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(BASE, 'yt-dlp-tools.json')
TOKEN = os.environ.get('GH_TOKEN', '')
STALE_DAYS = 365  # 12 个月以上没更新 → 停更


def api(url):
    req = urllib.request.Request(url, headers={
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'yt-dlp-tools-updater',
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

    tools = [t for c in data['categories'] for t in c['tools']]
    now = datetime.now(timezone.utc)
    stale_cutoff = now - timedelta(days=STALE_DAYS)
    changed = []
    errors = []

    for t in tools:
        try:
            info = api('https://api.github.com/repos/' + t['repo'])
        except Exception as e:
            errors.append((t['repo'], str(e)))
            continue

        stars = info.get('stargazers_count')
        pushed = (info.get('pushed_at') or '')[:10]
        pushed_dt = parse_date(pushed)
        stale = bool(info.get('archived')) or (pushed_dt is not None and pushed_dt < stale_cutoff)

        old = (t.get('stars'), t.get('lastPush'), bool(t.get('stale')))
        new = (stars, pushed, stale)
        if old != new:
            t['stars'] = stars
            t['lastPush'] = pushed
            if stale:
                t['stale'] = True
            else:
                t.pop('stale', None)
            changed.append((t['repo'], old, new))

    data['meta']['updatedAt'] = now.strftime('%Y-%m-%d')

    with open(DATA, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f'GH_TOKEN: {"已配置（限速 5000/hr）" if TOKEN else "未配置（匿名，限速 60/hr）"}')
    print(f'共检查 {len(tools)} 个工具，{len(changed)} 个有变化')
    for repo, old, new in changed:
        flag = '，⚠️ 停更' if new[2] else ''
        print(f'  {repo}: stars {old[0]}→{new[0]}, lastPush {old[1]}→{new[1]}{flag}')
    if errors:
        print(f'⚠️ {len(errors)} 个仓库请求失败：', file=sys.stderr)
        for repo, err in errors:
            print(f'  {repo}: {err}', file=sys.stderr)
        sys.exit(1)

    # GitHub Actions 步骤摘要
    summary = os.environ.get('GITHUB_STEP_SUMMARY')
    if summary and changed:
        with open(summary, 'a', encoding='utf-8') as f:
            f.write(f'## 数据更新 {now.strftime("%Y-%m-%d")}\n\n共 {len(changed)} 个工具发生变化：\n\n')
            for repo, old, new in changed:
                flag = '，⚠️ 停更' if new[2] else ''
                f.write(f'- `{repo}`：⭐ {old[0]} → {new[0]}，最后更新 {old[1]} → {new[1]}{flag}\n')


if __name__ == '__main__':
    main()
