---
layout: article.njk
title: FinalShell 终端中文乱码与编码设置修复
description: FinalShell 终端 UTF-8 编码配置、locale 设置与中文文件名显示问题。
date: 2026-05-18
category: SSH 连接
tags: ["编码设置","中文乱码","UTF-8"]
heroImage: "https://tse-mm.bing.com/th?q=FinalShell%20%E7%BB%88%E7%AB%AF%E4%B8%AD%E6%96%87%E4%B9%B1%E7%A0%81%E4%B8%8E%E7%BC%96%E7%A0%81%E8%AE%BE%E7%BD%AE%E4%BF%AE%E5%A4%8D"
heroAlt: "FinalShell 终端中文乱码与编码设置修复 配图"
---

## 客户端设置

在 FinalShell 会话属性中将编码设为 UTF-8。Windows 终端还需注意系统区域设置是否影响显示。

![FinalShell 编码设置](https://tse-mm.bing.com/th?q=FinalShell%20UTF-8%20encoding)

## 服务端 locale

执行 locale 命令检查 LANG 与 LC_ALL。若未设置 UTF-8，在 ~/.bashrc 中 export LANG=en_US.UTF-8。

## 文件名问题

SFTP 浏览中文目录时若乱码，同步检查客户端与服务端编码是否一致。
