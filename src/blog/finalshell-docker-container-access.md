---
layout: article.njk
title: FinalShell 连接 Docker 宿主机与容器运维
description: 通过 FinalShell SSH 管理 Docker 宿主机、进入容器与查看资源占用。
date: 2026-05-21
category: 服务器运维
tags: ["Docker","容器运维","宿主机管理"]
heroImage: "/static/images/photo-1558494949-ef010cbdcc31.jpg"
heroAlt: "FinalShell 连接 Docker 宿主机与容器运维 配图"
---

## 宿主机连接

先 SSH 到 Docker 宿主机，使用 docker ps 查看运行容器。FinalShell 多标签可分别监控不同容器日志。

![FinalShell Docker 运维](/static/images/photo-1581092580497-e0d23cbdf1dc.jpg)

## 进入容器

使用 docker exec -it 进入容器排查。注意容器内可能没有完整工具链，必要时在宿主机侧分析。

## 资源监控

docker stats 可查看容器 CPU 与内存。结合 FinalShell 监控面板判断是否需要限制或扩容。
## 延伸阅读

若需进一步查阅，可先看本站以下教程：

- [服务器监控](/blog/finalshell-server-monitoring-basics/)
- [Linux SSH 配置](/blog/finalshell-linux-ssh-setup/)
- [会话分组](/blog/finalshell-session-group-management/)
