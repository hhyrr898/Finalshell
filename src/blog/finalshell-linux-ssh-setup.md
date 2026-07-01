---
layout: article.njk
title: FinalShell Linux SSH 连接配置与主机管理
description: FinalShell 连接 Linux 服务器的基础配置、主机分组与连接参数说明。
date: 2026-05-29
category: Linux 客户端
tags: ["Linux环境","SSH连接","主机管理"]
heroImage: "/static/images/photo-1486406146926-c627a92ad1ab.jpg"
heroAlt: "FinalShell Linux SSH 连接配置与主机管理 配图"
---

## 连接参数

连接 Linux 服务器时，需填写主机名或 IP、端口、用户名与认证信息。默认 SSH 端口为 22，若服务器修改过端口，务必与运维文档保持一致。

![FinalShell Linux SSH](/static/images/photo-1510511459019-5dda7724fd87.jpg)

## 主机分组

按项目或环境创建分组，例如开发、测试、生产。分组后可在侧边栏快速切换，减少重复搜索。

## 连接验证

连接成功后执行 uname -a 与 df -h，确认系统信息与磁盘空间。若需 root 权限，优先使用 sudo 而非直接 root 登录。
