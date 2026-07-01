---
layout: article.njk
title: FinalShell 端口转发配置与本地调试远程服务
description: FinalShell 本地端口转发、远程端口映射与开发调试场景说明。
date: 2026-05-23
category: 开发调试
tags: ["端口转发","本地调试","隧道配置"]
heroImage: "/static/images/photo-1454165804606-c3d57bc86b40.jpg"
heroAlt: "FinalShell 端口转发配置与本地调试远程服务 配图"
---

## 转发类型

本地转发可将远程服务映射到本机端口，便于用本地工具访问数据库或内网 API。

![FinalShell 端口转发](/static/images/photo-1562813733-b31f71025d54.jpg)

## 配置步骤

在连接属性中找到端口转发，添加本地端口与远程目标地址。保存后重新连接使配置生效。

## 调试注意

转发端口不要与本地已有服务冲突。调试完成后关闭转发，减少暴露面。
