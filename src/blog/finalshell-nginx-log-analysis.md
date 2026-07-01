---
layout: article.njk
title: FinalShell 配合 Nginx 日志分析与故障排查
description: 使用 FinalShell 终端分析 Nginx access 与 error 日志的常见命令。
date: 2026-05-12
category: 服务器运维
tags: ["Nginx","日志分析","故障排查"]
heroImage: "/static/images/photo-1552664730-d307ca884978.jpg"
heroAlt: "FinalShell 配合 Nginx 日志分析与故障排查 配图"
---

## 日志位置

Nginx 日志通常在 /var/log/nginx/。用 tail -f access.log 观察实时请求。

![FinalShell Nginx 日志](/static/images/photo-1510511459019-5dda7724fd87.jpg)

## 常用分析

awk 与 grep 统计 404、5xx 与慢请求 IP。结合日志轮转配置避免磁盘占满。

## 多标签配合

一个标签 tail error.log，一个标签执行 curl 复现，提高排查效率。
## 延伸阅读

若需进一步查阅，可先看本站以下教程：

- [会话分组](/blog/finalshell-session-group-management/)
- [服务器监控](/blog/finalshell-server-monitoring-basics/)
