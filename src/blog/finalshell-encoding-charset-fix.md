---
layout: article.njk
title: 跨系统编码对齐：CentOS/Ubuntu 中文终端
description: 不同发行版 locale 与 FinalShell 终端编码的协同设置方法。
date: 2026-05-18
category: SSH 连接
tags: ["编码设置","中文乱码","UTF-8"]
heroImage: "/static/images/photo-1520607162513-77705c0f0d4a.jpg"
heroAlt: "跨系统编码对齐：CentOS/Ubuntu 中文终端 配图"
---

## 客户端设置

在 FinalShell 会话属性中将编码设为 UTF-8。Windows 终端还需注意系统区域设置是否影响显示。

![FinalShell 编码设置](/static/images/photo-1515879218367-8466d910aaa4.jpg)

## 服务端 locale

执行 locale 命令检查 LANG 与 LC_ALL。若未设置 UTF-8，在 ~/.bashrc 中 export LANG=en_US.UTF-8。

## 文件名问题

SFTP 浏览中文目录时若乱码，同步检查客户端与服务端编码是否一致。
## 延伸阅读

若需进一步查阅，可先看本站以下教程：

- [Windows 安装](/blog/finalshell-windows-install-guide/)
- [SFTP 传输](/blog/finalshell-sftp-file-transfer/)
- [会话分组](/blog/finalshell-session-group-management/)
