---
layout: article.njk
title: FinalShell SFTP 文件传输与目录同步实践
description: FinalShell SFTP 上传下载、目录浏览、权限处理与传输失败排查。
date: 2026-05-27
category: 文件传输
tags: ["SFTP","文件传输","目录同步"]
heroImage: "/static/images/photo-1550751827-4bd374c3f58b.jpg"
heroAlt: "FinalShell SFTP 文件传输与目录同步实践 配图"
---

## SFTP 面板

FinalShell 内置 SFTP 面板，连接 SSH 后可在同一窗口浏览远程目录。双击文件可下载，拖拽或右键可上传。

![FinalShell SFTP](/static/images/photo-1560179707-f14e90ef3623.jpg)

## 权限注意

上传至 /var/www 等目录时，确认目标用户有写权限。必要时先上传到临时目录，再用 mv 命令移动。

## 传输失败排查

若传输中断，检查网络稳定性与磁盘剩余空间。大文件建议分片或使用 rsync 命令配合终端操作。
