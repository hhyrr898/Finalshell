---
layout: article.njk
title: FinalShell 命令历史与快捷输入技巧
description: FinalShell 终端命令历史搜索、别名配置与高频命令复用方法。
date: 2026-05-17
category: 会话管理
tags: ["命令历史","快捷输入","终端技巧"]
heroImage: "/static/images/photo-1504639725590-34d0984388bd.jpg"
heroAlt: "FinalShell 命令历史与快捷输入技巧 配图"
---

## 历史搜索

使用 Ctrl+R 反向搜索历史命令，可快速复用部署、重启等长命令。不同标签共享同一会话历史。

![FinalShell 命令历史](/static/images/photo-1504639725590-34d0984388bd.jpg)

## 别名配置

在 ~/.bashrc 中为 docker compose、kubectl 等设置 alias，减少输入量。

## 脚本化

重复三步以上的操作可写成 shell 脚本，通过 FinalShell SFTP 上传后在终端执行。
## 延伸阅读

若需进一步查阅，可先看本站以下教程：

- [SFTP 传输](/blog/finalshell-sftp-file-transfer/)
- [会话分组](/blog/finalshell-session-group-management/)
