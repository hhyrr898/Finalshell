---
layout: article.njk
title: FinalShell 配合 Nginx 日志分析与故障排查
description: 使用 FinalShell 终端分析 Nginx access 与 error 日志的常见命令。
date: 2026-05-12
category: 服务器运维
tags: ["Nginx","日志分析","故障排查"]
heroImage: "https://tse-mm.bing.com/th?q=FinalShell%20%E9%85%8D%E5%90%88%20Nginx%20%E6%97%A5%E5%BF%97%E5%88%86%E6%9E%90%E4%B8%8E%E6%95%85%E9%9A%9C%E6%8E%92%E6%9F%A5"
heroAlt: "FinalShell 配合 Nginx 日志分析与故障排查 配图"
---

## 日志位置

Nginx 日志通常在 /var/log/nginx/。用 tail -f access.log 观察实时请求。

![FinalShell Nginx 日志](https://tse-mm.bing.com/th?q=FinalShell%20Nginx%20log%20analysis)

## 常用分析

awk 与 grep 统计 404、5xx 与慢请求 IP。结合日志轮转配置避免磁盘占满。

## 多标签配合

一个标签 tail error.log，一个标签执行 curl 复现，提高排查效率。
