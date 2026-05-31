---
layout: article.njk
title: FinalShell Git 拉取部署与发布流程实践
description: 使用 FinalShell 在服务器执行 git pull、构建与发布回滚流程。
date: 2026-05-10
category: 开发调试
tags: ["Git部署","发布流程","CI/CD"]
heroImage: "https://tse-mm.bing.com/th?q=FinalShell%20Git%20%E6%8B%89%E5%8F%96%E9%83%A8%E7%BD%B2%E4%B8%8E%E5%8F%91%E5%B8%83%E6%B5%81%E7%A8%8B%E5%AE%9E%E8%B7%B5"
heroAlt: "FinalShell Git 拉取部署与发布流程实践 配图"
---

## 部署步骤

SSH 到发布机，进入项目目录执行 git pull。若有 composer 或 npm 构建，在独立标签中运行并观察输出。

![FinalShell Git 部署](https://tse-mm.bing.com/th?q=FinalShell%20git%20deploy%20workflow)

## 回滚准备

发布前打 tag 或记录 commit hash。出问题时可 git checkout 到上一稳定版本。

## 权限控制

生产部署账号应仅有必要目录写权限，FinalShell 中区分个人开发账号与部署专用账号。
