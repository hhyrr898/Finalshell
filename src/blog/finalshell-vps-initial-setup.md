---
layout: article.njk
title: FinalShell VPS 新机器初始化与安全加固
description: 新购 VPS 后通过 FinalShell 完成用户创建、防火墙与 SSH 安全加固。
date: 2026-05-19
category: 服务器运维
tags: ["VPS初始化","安全加固","新机器配置"]
heroImage: "https://tse-mm.bing.com/th?q=FinalShell%20VPS%20%E6%96%B0%E6%9C%BA%E5%99%A8%E5%88%9D%E5%A7%8B%E5%8C%96%E4%B8%8E%E5%AE%89%E5%85%A8%E5%8A%A0%E5%9B%BA"
heroAlt: "FinalShell VPS 新机器初始化与安全加固 配图"
---

## 首次登录

云厂商提供的 root 密码或密钥首次登录后，立即创建普通用户并配置 sudo 权限。

![FinalShell VPS 初始化](https://tse-mm.bing.com/th?q=FinalShell%20VPS%20setup)

## 安全加固

修改 SSH 默认端口、禁用 root 密码登录、配置 fail2ban 与防火墙规则。每一步在 FinalShell 终端中记录命令输出。

## 基础软件

安装 git、vim、htop 等常用工具，设置时区与 NTP 同步，确保日志时间准确。
