#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
更新 yt-dlp-tools.json 的数据快照：
- stars / lastPush 从 GitHub API 实时拉取
- 检测停更：仓库已归档（archived）或 12 个月以上没有推送 → 标记 stale
- 检测下线：仓库返回 404（已删除 / 转私有 / 被封禁）→ 标记 dead，只警告不中断
- 更新 meta.updatedAt

用法：
  python3 update-data.py                   # 匿名调用（限速 60 次/小时）
  GH_TOKEN=xxx python3 update-data.py      # 带 token（限速 5000 次/小时）
  python3 update-data.py --recheck-offline # 强制复查标了 repoOffline 的仓库
  python3 update-data.py --strict          # 任何非正常结果都算失败（旧的严格行为）

条目上的可选字段（人工维护，脚本按此调整行为）：
  url/homepage  官方站点；有则页面卡片名指向它，而不是 GitHub 仓库
  repoOffline   true = 该仓库暂时不可访问（账号被限制等），默认跳过轮询；
                用 --recheck-offline 复查，一旦恢复即自动清除该标记
  404 会自动标记 dead，无需人工干预

退出码（GitHub Actions 据此判断步骤成败）：
  0  数据已更新；个别仓库 404（已下线）、限速或网络抖动都不算失败，下次运行会重试
  1  致命：token 无效（401）、超过一半仓库请求失败、或数据文件写入失败
"""
import json
import os
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone, timedelta

BASE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(BASE, 'yt-dlp-tools.json')
TOKEN = os.environ.get('GH_TOKEN', '')
STALE_DAYS = 365  # 12 个月以上没更新 → 停更
RETRY_STATUS = {403, 429, 500, 502, 503, 504}  # 限速 / 服务端抖动：值得重试
MAX_RETRIES = 3


class Fatal(Exception):
    """无法继续的错误（如 token 失效），调用方应立即停止而不是计入普通失败。"""


def api(url, retries=MAX_RETRIES):
    """请求 GitHub API。

    - 仓库不存在 → 返回 None（属数据问题，不是故障）
    - 401 → 抛 Fatal（token 无效，重试也没用）
    - 403/429/5xx/网络错误 → 指数退避重试，仍失败则抛 RuntimeError
    """
    req = urllib.request.Request(url, headers={
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'yt-dlp-tools-updater',
    })
    if TOKEN:
        req.add_header('Authorization', 'Bearer ' + TOKEN)

    last = '未知错误'
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None
            if e.code == 401:
                raise Fatal('GH_TOKEN 无效或已过期（HTTP 401）') from None
            last = 'HTTP Error %d: %s' % (e.code, e.reason)
            if e.code not in RETRY_STATUS:
                break  # 400/422 之类重试也没意义
        except Exception as e:
            last = str(e)
        if attempt < retries - 1:
            time.sleep(2 ** attempt)  # 1s、2s 退避
    raise RuntimeError(last)


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


def write_summary(now, changed, gone, skipped, pin_offline, errors, fatal):
    """写 GitHub Actions 步骤摘要；本地运行（无 GITHUB_STEP_SUMMARY）时跳过。

    注意：必须在决定退出码之前调用，否则失败时摘要会丢。
    """
    summary = os.environ.get('GITHUB_STEP_SUMMARY')
    if not summary:
        return
    with open(summary, 'a', encoding='utf-8') as f:
        f.write(f'## 数据更新 {now.strftime("%Y-%m-%d")}\n\n')
        if fatal:
            f.write(f'❌ 运行中断：{fatal}\n')
            return
        f.write(f'共 {len(changed)} 个工具发生变化：\n\n')
        for repo, note in changed:
            f.write(f'- `{repo}`：{note}\n')
        if gone:
            f.write(f'\n### ⛔ 已下线 {len(gone)} 个（未影响本次运行）\n\n')
            for repo in gone:
                f.write(f'- `{repo}`\n')
        if skipped or pin_offline:
            f.write(f'\n### ℹ️ 仓库暂不可访问 {len(skipped) + len(pin_offline)} 个（已跳过轮询）\n\n')
            for repo in skipped + pin_offline:
                f.write(f'- `{repo}`\n')
        if errors:
            f.write(f'\n### ⚠️ 本轮请求失败 {len(errors)} 个（下次运行会重试）\n\n')
            for repo, err in errors:
                f.write(f'- `{repo}`：{err}\n')


def main():
    args = sys.argv[1:]
    strict = '--strict' in args
    recheck_offline = '--recheck-offline' in args

    with open(DATA, encoding='utf-8') as f:
        data = json.load(f)

    tools = [t for c in data['categories'] for t in c['tools']]
    now = datetime.now(timezone.utc)
    today = now.strftime('%Y-%m-%d')
    stale_cutoff = now - timedelta(days=STALE_DAYS)
    changed = []   # (repo, 说明)
    gone = []      # 本轮确认已下线（404）的仓库
    skipped = []   # 标了 repoOffline、本轮跳过轮询的仓库
    pin_offline = []  # --recheck-offline 复查后仍不可访问的仓库
    errors = []    # (repo, 错误信息)：限速 / 网络问题，下次运行会重试
    ok_count = 0   # 成功取到数据的工具数
    fatal = None

    for t in tools:
        repo = t['repo']
        offline = bool(t.get('repoOffline'))

        # 已声明「仓库暂不可访问」的条目：默认不浪费配额去请求
        if offline and not recheck_offline:
            skipped.append(repo)
            continue

        try:
            info = api('https://api.github.com/repos/' + repo)
        except Fatal as e:
            fatal = str(e)
            break
        except Exception as e:
            errors.append((repo, str(e)))
            continue

        if info is None:
            if offline:
                pin_offline.append(repo)  # 复查后仍 404：保持 repoOffline，不升级为 dead
                continue
            gone.append(repo)
            if not t.get('dead'):
                t['dead'] = True
                t['deadSince'] = today
                changed.append((repo, f'⛔ 仓库已下线（404），于 {today} 标记 dead 并停止展示为可访问'))
            continue

        if offline:  # 复查通过：GitHub 恢复了，摘掉标记
            t.pop('repoOffline', None)
            changed.append((repo, '✅ GitHub 仓库恢复可访问，已取消 repoOffline 标记'))

        revived = bool(t.pop('dead', None))  # 之前标记过下线、现在又能访问了 → 自愈
        t.pop('deadSince', None)
        ok_count += 1

        stars = info.get('stargazers_count')
        pushed = (info.get('pushed_at') or '')[:10]
        pushed_dt = parse_date(pushed)
        stale = bool(info.get('archived')) or (pushed_dt is not None and pushed_dt < stale_cutoff)

        old = (t.get('stars'), t.get('lastPush'), bool(t.get('stale')))
        new = (stars, pushed, stale)
        if old != new or revived:
            t['stars'] = stars
            t['lastPush'] = pushed
            if stale:
                t['stale'] = True
            else:
                t.pop('stale', None)
            note = f'stars {old[0]}→{new[0]}, lastPush {old[1]}→{new[1]}'
            if revived:
                note += '，✅ 恢复可访问'
            if stale:
                note += '，⚠️ 停更'
            changed.append((repo, note))

    # token 失效时不写文件，避免用半截数据覆盖快照并把 updatedAt 提前
    if not fatal:
        if ok_count:
            data['meta']['updatedAt'] = today
        else:
            # 一个仓库都没取到数据时，不要谎报快照日期
            print('⚠️ 本轮没有任何仓库取到数据，保留原 updatedAt', file=sys.stderr)
        try:
            with open(DATA, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        except OSError as e:
            fatal = f'写入 {DATA} 失败：{e}'

    print(f'GH_TOKEN: {"已配置（限速 5000/hr）" if TOKEN else "未配置（匿名，限速 60/hr）"}')
    print(f'共检查 {len(tools)} 个工具，{len(changed)} 个有变化')
    for repo, note in changed:
        print(f'  {repo}: {note}')

    if skipped:
        print(f'ℹ️ {len(skipped)} 个工具已标记「仓库暂不可访问」，本轮跳过轮询'
              '（加 --recheck-offline 可强制复查）：')
        for repo in skipped:
            print(f'  {repo}')
    if pin_offline:
        print(f'ℹ️ {len(pin_offline)} 个工具复查后仍不可访问，保持 repoOffline 标记：')
        for repo in pin_offline:
            print(f'  {repo}')
    if gone:
        print(f'⛔ {len(gone)} 个仓库已下线（404），已标记 dead 并跳过，不影响本次运行：')
        for repo in gone:
            print(f'  {repo}: HTTP Error 404: Not Found')
    if errors:
        print(f'⚠️ {len(errors)} 个仓库请求失败（限速或网络问题，下次运行会重试）：', file=sys.stderr)
        for repo, err in errors:
            print(f'  {repo}: {err}', file=sys.stderr)

    write_summary(now, changed, gone, skipped, pin_offline, errors, fatal)  # 先落摘要，再决定退出码

    if fatal:
        print(f'❌ {fatal}', file=sys.stderr)
        return 1
    if strict and (gone or errors):
        print('❌ --strict 模式：存在已下线或请求失败的仓库', file=sys.stderr)
        return 1
    if len(errors) * 2 > len(tools):
        print(f'❌ 超过一半工具（{len(errors)}/{len(tools)}）请求失败，'
              '疑似 token 被拦截或网络故障，请人工确认', file=sys.stderr)
        return 1

    print('✅ 数据快照已更新' + (f'（{len(errors)} 个工具本轮跳过）' if errors else ''))
    return 0


if __name__ == '__main__':
    sys.exit(main())
