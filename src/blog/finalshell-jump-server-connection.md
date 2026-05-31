---
layout: article.njk
title: FinalShell 跳板机连接与多级 SSH 访问
description: FinalShell 通过跳板机访问内网服务器、代理链配置与连接稳定性。
date: 2026-05-20
category: SSH 连接
tags: ["跳板机","内网访问","代理链"]
heroImage: "https://tse-mm.bing.com/th?q=FinalShell%20%E8%B7%B3%E6%9D%BF%E6%9C%BA%E8%BF%9E%E6%8E%A5%E4%B8%8E%E5%A4%9A%E7%BA%A7%20SSH%20%E8%AE%BF%E9%97%AE"
heroAlt: "FinalShell 跳板机连接与多级 SSH 访问 配图"
---

## 跳板机场景

内网服务器通常无法直接访问，需先连接跳板机，再转发至目标主机。FinalShell 支持在连接属性中设置代理或 SSH 跳板。

![FinalShell 跳板机](https://tse-mm.bing.com/th?q=FinalShell%20jump%20server%20SSH)

## 配置要点

代理主机需可公网访问，目标主机仅需对跳板机开放。确认各层用户名、端口与密钥一致。

## 稳定性

跳板机网络波动会影响整体连接。建议启用 keepalive 并配合 tmux 保持会话。
