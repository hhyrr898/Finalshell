---
layout: article.njk
title: 堡垒机链路：二级跳转与内网主机访问
description: 跳板机与 ProxyJump 思路在 FinalShell 中的多级 SSH 会话链配置。
date: 2026-05-20
category: SSH 连接
tags: ["跳板机","内网访问","代理链"]
heroImage: "/static/images/photo-1550751827-4bd374c3f58b.jpg"
heroAlt: "堡垒机链路：二级跳转与内网主机访问 配图"
---

## 跳板机场景

内网服务器通常无法直接访问，需先连接跳板机，再转发至目标主机。FinalShell 支持在连接属性中设置代理或 SSH 跳板。

![FinalShell 跳板机](/static/images/photo-1515879218367-8466d910aaa4.jpg)

## 配置要点

代理主机需可公网访问，目标主机仅需对跳板机开放。确认各层用户名、端口与密钥一致。

## 稳定性

跳板机网络波动会影响整体连接。建议启用 keepalive 并配合 tmux 保持会话。
## 延伸阅读

若需进一步查阅，可先看本站以下教程：

- [端口转发](/blog/finalshell-port-forwarding-guide/)
- [Linux SSH 配置](/blog/finalshell-linux-ssh-setup/)
- [SSH 密钥](/blog/finalshell-ssh-key-configuration/)
