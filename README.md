# twins-pages

TWINS Center 反向代理（Cloudflare Pages Function）。

将 `https://<project>.pages.dev` 代理到 `http://103.217.191.79:11008`（SotF Center），提供干净域名的 HTTPS 访问，隐藏 IP 与端口。

- 根路径 `/` 302 到 `/docs`（Swagger 界面）
- 其余路径透传（API 端点 /docs /redoc 均可访问）
