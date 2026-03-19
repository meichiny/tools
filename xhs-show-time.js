/**
 * 小红书帖子列表显示发布时间
 * 功能：在所有帖子列表中，将发布时间追加到作者昵称后
 *
 * 配置：
 * ^https?://edith\.xiaohongshu\.com/api/sns/v\d+/.*(feed|note|search|home|discover|user).* url script-response-body xhs-show-time.js
 */

const url = $request.url;
let body = $response.body;

// 时间格式化
function formatTime(ts) {
    if (!ts) return "";
    const now = Date.now();
    const t = ts.toString().length === 10 ? ts * 1000 : ts;
    const diff = now - t;
    const m = 60 * 1000, h = 60 * m, d = 24 * h;
    if (diff < m) return "·刚刚";
    if (diff < h) return "·" + Math.floor(diff / m) + "分钟前";
    if (diff < d) return "·" + Math.floor(diff / h) + "小时前";
    if (diff < 7 * d) return "·" + Math.floor(diff / d) + "天前";
    const date = new Date(t);
    return "·" + (date.getMonth() + 1) + "-" + date.getDate();
}

// 处理笔记列表
function processNotes(data) {
    if (!data) return data;

    // 尝试各种可能的数据结构
    const items = data.items || data.data?.items || data.notes || data.data?.notes || [];

    items.forEach(item => {
        // 找时间戳
        const timeField = item.time || item.create_time || item.publish_time || item.at ||
                         item.note_card?.time || item.note_card?.create_time ||
                         item.user?.time;

        if (timeField) {
            const timeStr = formatTime(timeField);

            // 在昵称后追加时间
            if (item.user?.nickname) {
                item.user.nickname = item.user.nickname + timeStr;
            } else if (item.note_card?.user?.nickname) {
                item.note_card.user.nickname = item.note_card.user.nickname + timeStr;
            }
        }
    });

    return data;
}

try {
    let data = JSON.parse(body);
    data = processNotes(data);
    body = JSON.stringify(data);
} catch (e) {
    console.log("解析失败: " + e);
}

$done({ body: body });
