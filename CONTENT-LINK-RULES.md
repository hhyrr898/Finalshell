# finalshell-cn.com 正文链接规则

## 数量

| 类型 | 每篇建议 |
|------|----------|
| 站内内链 | **2～5 条** |
| 外链 | **0 条**（FinalShell 无统一官方文档外链要求，避免乱链） |
| 同一关键词精确匹配链接 | **最多 1 次** |

## 可链 pillar（优先）

| 主题 | 路径 |
|------|------|
| Windows 生产部署 | `/blog/finalshell-windows-install-guide/` |
| macOS 工作站 | `/blog/finalshell-macos-install-steps/` |
| Linux 批量接入 | `/blog/finalshell-linux-ssh-setup/` |
| SSH 密钥轮换 | `/blog/finalshell-ssh-key-configuration/` |
| SFTP 发布工作流 | `/blog/finalshell-sftp-file-transfer/` |
| 隧道本地调试 | `/blog/finalshell-port-forwarding-guide/` |
| 多环境会话树 | `/blog/finalshell-session-group-management/` |
| 负载异常判读 | `/blog/finalshell-server-monitoring-basics/` |
| 下载中心 | `/dows.html` |
| 首页 | `/` |

## 索引策略

- 英文 slug pillar（`finalshell-*.md`）→ 可索引
- 带时间戳自动文（`-*-1780123456789-0.md`）→ `generated: true` + noindex

## 禁止

- 每个「FinalShell」都加链接
- 链到其它仿站或站群域名
- 为 SEO 硬塞无关内链
