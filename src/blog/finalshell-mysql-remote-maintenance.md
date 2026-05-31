---
layout: article.njk
title: FinalShell 远程 MySQL 维护与慢查询排查
description: 通过 FinalShell 连接数据库服务器、备份数据与慢查询日志分析。
date: 2026-05-11
category: 服务器运维
tags: ["MySQL","数据库维护","慢查询"]
heroImage: "https://tse-mm.bing.com/th?q=FinalShell%20%E8%BF%9C%E7%A8%8B%20MySQL%20%E7%BB%B4%E6%8A%A4%E4%B8%8E%E6%85%A2%E6%9F%A5%E8%AF%A2%E6%8E%92%E6%9F%A5"
heroAlt: "FinalShell 远程 MySQL 维护与慢查询排查 配图"
---

## 连接方式

SSH 到数据库服务器后，使用 mysql 客户端本地连接。避免将 3306 直接暴露公网。

![FinalShell MySQL 维护](https://tse-mm.bing.com/th?q=FinalShell%20MySQL%20maintenance)

## 备份命令

mysqldump 导出前确认磁盘空间。大库备份建议在低峰期执行并用 FinalShell 监控进度。

## 慢查询

开启 slow_query_log 后，用 tail 观察慢 SQL，配合 explain 分析执行计划。
