# FinalShell 静态站点

基于 Eleventy 的 FinalShell 资料站，支持 GitHub Pages 与 Cloudflare Pages 部署。

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 自动生成文章

手动测试（1-9 篇）：

```bash
set GEMINI_API_KEY=your_key
npm run generate:articles -- --count=3
```

## 必应 URL 提交

```bash
set SITE_URL=https://finalshell-ssh.com
set BING_API_KEY=your_bing_key
npm run push:bing:all
npm run push:bing:updated
```

## GitHub 配置

在仓库 Settings → Secrets and variables 中设置：

- Secret: `GEMINI_API_KEY`
- Secret: `BING_API_KEY`
- Variable: `SITE_URL`

## 部署

推送到 `main` 分支后，GitHub Actions 自动构建并发布 Pages。Cloudflare Pages 可指向 `_site` 输出目录。
