---
layout: article.njk
title: FinalShell 连接 Docker 宿主机与容器运维
description: 通过 FinalShell SSH 管理 Docker 宿主机、进入容器与查看资源占用。
date: 2026-05-21
category: 服务器运维
tags: ["Docker","容器运维","宿主机管理"]
heroImage: "https://tse-mm.bing.com/th?q=FinalShell%20%E8%BF%9E%E6%8E%A5%20Docker%20%E5%AE%BF%E4%B8%BB%E6%9C%BA%E4%B8%8E%E5%AE%B9%E5%99%A8%E8%BF%90%E7%BB%B4"
heroAlt: "FinalShell 连接 Docker 宿主机与容器运维 配图"
---

## 宿主机连接

先 SSH 到 Docker 宿主机，使用 docker ps 查看运行容器。FinalShell 多标签可分别监控不同容器日志。

![FinalShell Docker 运维](https://tse-mm.bing.com/th?q=FinalShell%20Docker%20container)

## 进入容器

使用 docker exec -it 进入容器排查。注意容器内可能没有完整工具链，必要时在宿主机侧分析。

## 资源监控

docker stats 可查看容器 CPU 与内存。结合 FinalShell 监控面板判断是否需要限制或扩容。
