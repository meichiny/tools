/**
 * 小红书 API 抓包脚本
 * 用于捕获「发现」页 API 响应数据
 */

const url = $request.url;
const body = $response.body;

// 匹配小红书 Feed/首页/发现相关 API
const isFeedApi = url.includes("feed") ||
    url.includes("home") ||
    url.includes("discover") ||
    url.includes("note") ||
    url.includes("rec") ||
    url.includes("edith.xiaohongshu.com");

if (isFeedApi && body.length > 100) {
    // 打印完整 URL
    console.log("===== 小红书 Feed API =====");
    console.log("URL: " + url);
    console.log("响应: " + body.substring(0, 5000));

    // 弹出通知
    $notify(
        "捕获小红书 Feed API",
        url.substring(0, 80),
        "响应长度: " + body.length
    );
}

$done({ body: body });
