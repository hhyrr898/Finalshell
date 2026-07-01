---
layout: article.njk
title: FinalShell 远程 PHP 项目调试与日志定位
description: 使用 FinalShell 连接 PHP 服务器、查看错误日志与常见问题排查流程。
date: 2026-05-22
category: 开发调试
tags: ["PHP调试","日志定位","远程开发"]
heroImage: "/static/images/photo-1639762681485-074b7f938ba0.jpg"
heroAlt: "FinalShell 远程 PHP 项目调试与日志定位 配图"
---

## 日志路径

PHP 错误日志常见路径包括 /var/log/php-fpm/ 与项目 runtime 目录。用 FinalShell 终端 tail -f 实时查看。

![FinalShell PHP 调试](/static/images/photo-1498050108023-c5249f4df085.jpg)

## 权限与配置

确认 php.ini 中 error_log 与 display_errors 设置符合环境要求。生产环境避免开启详细错误输出。

## 协作流程

开发者在 FinalShell 中修改配置后，记录变更时间与影响范围，便于团队回溯。
## 延伸阅读

若需进一步查阅，可先看本站以下教程：

- [Linux SSH 配置](/blog/finalshell-linux-ssh-setup/)
- [Windows 安装](/blog/finalshell-windows-install-guide/)
- [SSH 密钥](/blog/finalshell-ssh-key-configuration/)
