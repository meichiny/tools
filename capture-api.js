/**
 * 小红书 API 抓包脚本
 * 用于捕获「发现」页 API 响应数据
 */

const url = $request.url;
const body = $response.body;

// 匹配小红书相关 API
if (url.includes("xiaohongshu")) {
    // 打印到控制台
    console.log("===== 小红书 API =====");
    console.log("URL: " + url);
    console.log("响应: " + body.substring(0, 3000));

    // 弹出通知
    $notify(
        "捕获小红书 API",
        url.substring(0, 60),
        "响应前100字符: " + body.substring(0, 100)
    );
}

$done({ body: body });
