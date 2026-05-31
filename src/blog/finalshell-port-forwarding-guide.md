---
layout: article.njk
title: FinalShell 端口转发配置与本地调试远程服务
description: FinalShell 本地端口转发、远程端口映射与开发调试场景说明。
date: 2026-05-23
category: 开发调试
tags: ["端口转发","本地调试","隧道配置"]
heroImage: "https://tse-mm.bing.com/th?q=FinalShell%20%E7%AB%AF%E5%8F%A3%E8%BD%AC%E5%8F%91%E9%85%8D%E7%BD%AE%E4%B8%8E%E6%9C%AC%E5%9C%B0%E8%B0%83%E8%AF%95%E8%BF%9C%E7%A8%8B%E6%9C%8D%E5%8A%A1"
heroAlt: "FinalShell 端口转发配置与本地调试远程服务 配图"
---

## 转发类型

本地转发可将远程服务映射到本机端口，便于用本地工具访问数据库或内网 API。

![FinalShell 端口转发](https://tse-mm.bing.com/th?q=FinalShell%20port%20forwarding)

## 配置步骤

在连接属性中找到端口转发，添加本地端口与远程目标地址。保存后重新连接使配置生效。

## 调试注意

转发端口不要与本地已有服务冲突。调试完成后关闭转发，减少暴露面。
