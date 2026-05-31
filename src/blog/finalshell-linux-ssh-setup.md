---
layout: article.njk
title: FinalShell Linux SSH 连接配置与主机管理
description: FinalShell 连接 Linux 服务器的基础配置、主机分组与连接参数说明。
date: 2026-05-29
category: Linux 客户端
tags: ["Linux环境","SSH连接","主机管理"]
heroImage: "https://tse-mm.bing.com/th?q=FinalShell%20Linux%20SSH%20%E8%BF%9E%E6%8E%A5%E9%85%8D%E7%BD%AE%E4%B8%8E%E4%B8%BB%E6%9C%BA%E7%AE%A1%E7%90%86"
heroAlt: "FinalShell Linux SSH 连接配置与主机管理 配图"
---

## 连接参数

连接 Linux 服务器时，需填写主机名或 IP、端口、用户名与认证信息。默认 SSH 端口为 22，若服务器修改过端口，务必与运维文档保持一致。

![FinalShell Linux SSH](https://tse-mm.bing.com/th?q=FinalShell%20Linux%20SSH%20setup)

## 主机分组

按项目或环境创建分组，例如开发、测试、生产。分组后可在侧边栏快速切换，减少重复搜索。

## 连接验证

连接成功后执行 uname -a 与 df -h，确认系统信息与磁盘空间。若需 root 权限，优先使用 sudo 而非直接 root 登录。
