---
layout: article.njk
title: FinalShell 命令历史与快捷输入技巧
description: FinalShell 终端命令历史搜索、别名配置与高频命令复用方法。
date: 2026-05-17
category: 会话管理
tags: ["命令历史","快捷输入","终端技巧"]
heroImage: "https://tse-mm.bing.com/th?q=FinalShell%20%E5%91%BD%E4%BB%A4%E5%8E%86%E5%8F%B2%E4%B8%8E%E5%BF%AB%E6%8D%B7%E8%BE%93%E5%85%A5%E6%8A%80%E5%B7%A7"
heroAlt: "FinalShell 命令历史与快捷输入技巧 配图"
---

## 历史搜索

使用 Ctrl+R 反向搜索历史命令，可快速复用部署、重启等长命令。不同标签共享同一会话历史。

![FinalShell 命令历史](https://tse-mm.bing.com/th?q=FinalShell%20command%20history)

## 别名配置

在 ~/.bashrc 中为 docker compose、kubectl 等设置 alias，减少输入量。

## 脚本化

重复三步以上的操作可写成 shell 脚本，通过 FinalShell SFTP 上传后在终端执行。
