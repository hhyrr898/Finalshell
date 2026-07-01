---
layout: article.njk
title: FinalShell Git 拉取部署与发布流程实践
description: 使用 FinalShell 在服务器执行 git pull、构建与发布回滚流程。
date: 2026-05-10
category: 开发调试
tags: ["Git部署","发布流程","CI/CD"]
heroImage: "/static/images/photo-1562813733-b31f71025d54.jpg"
heroAlt: "FinalShell Git 拉取部署与发布流程实践 配图"
---

## 部署步骤

SSH 到发布机，进入项目目录执行 git pull。若有 composer 或 npm 构建，在独立标签中运行并观察输出。

![FinalShell Git 部署](/static/images/photo-1520607162513-77705c0f0d4a.jpg)

## 回滚准备

发布前打 tag 或记录 commit hash。出问题时可 git checkout 到上一稳定版本。

## 权限控制

生产部署账号应仅有必要目录写权限，FinalShell 中区分个人开发账号与部署专用账号。
## 延伸阅读

若需进一步查阅，可先看本站以下教程：

- [Linux SSH 配置](/blog/finalshell-linux-ssh-setup/)
- [会话分组](/blog/finalshell-session-group-management/)
