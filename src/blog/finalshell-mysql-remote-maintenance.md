---
layout: article.njk
title: FinalShell 远程 MySQL 维护与慢查询排查
description: 通过 FinalShell 连接数据库服务器、备份数据与慢查询日志分析。
date: 2026-05-11
category: 服务器运维
tags: ["MySQL","数据库维护","慢查询"]
heroImage: "/static/images/photo-1535378917042-10a22c95931a.jpg"
heroAlt: "FinalShell 远程 MySQL 维护与慢查询排查 配图"
---

## 连接方式

SSH 到数据库服务器后，使用 mysql 客户端本地连接。避免将 3306 直接暴露公网。

![FinalShell MySQL 维护](/static/images/photo-1639322537228-f710d846310a.jpg)

## 备份命令

mysqldump 导出前确认磁盘空间。大库备份建议在低峰期执行并用 FinalShell 监控进度。

## 慢查询

开启 slow_query_log 后，用 tail 观察慢 SQL，配合 explain 分析执行计划。
## 延伸阅读

若需进一步查阅，可先看本站以下教程：

- [Linux SSH 配置](/blog/finalshell-linux-ssh-setup/)
- [服务器监控](/blog/finalshell-server-monitoring-basics/)
- [Windows 安装](/blog/finalshell-windows-install-guide/)
