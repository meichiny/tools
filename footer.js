document.addEventListener('DOMContentLoaded', function() {
    // 1. 创建 footer 元素
    const footer = document.createElement('footer');
    
    // 2. 设置 footer 的样式 (也可以移到 CSS 文件中)
    const style = document.createElement('style');
    style.textContent = `
        footer {
            margin-top: 50px;
            padding: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 14px;
            color: #666;
        }
        footer a {
            color: #07c160;
            text-decoration: none;
            margin: 0 10px;
        }
        footer a:hover {
            text-decoration: underline;
        }
        .footer-links {
            margin-bottom: 10px;
        }
    `;
    document.head.appendChild(style);

    // 3. 定义 footer 内容
    // 获取当前页面的 GitHub 源码地址（可选）
    const currentPath = window.location.pathname;
    const githubRepo = "https://github.com/meichiny/tools"; // 替换为你的仓库地址

    footer.innerHTML = `
        <div class="footer-links">
            <a href="/tools/">首页</a>
            <a href="${githubRepo}">GitHub 源码</a>
            <a href="${githubRepo}/issues">反馈建议</a>
        </div>
        <div>
            &copy; ${new Date().getFullYear()} 我的工具箱
        </div>
    `;

    // 4. 将 footer 插入到 body 最后
    document.body.appendChild(footer);
});
