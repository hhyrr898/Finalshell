---
layout: article.njk
title: 生产环境 SSH 密钥轮换与 FinalShell 私钥托管
description: 密钥生成、服务器 authorized_keys 部署及 FinalShell 私钥引用与轮换建议。
date: 2026-05-24
category: SSH 连接
tags: ["SSH密钥","安全登录","密钥管理"]
heroImage: "/static/images/photo-1526374965328-7f61d4dc18c5.jpg"
heroAlt: "生产环境 SSH 密钥轮换与 FinalShell 私钥托管 配图"
---

## 生成与导入

推荐使用 ed25519 或 RSA 4096 位密钥。私钥保存在本地安全目录，在 FinalShell 连接设置中选择密钥文件。

![FinalShell SSH 密钥](/static/images/photo-1516321318423-f06f85e504b3.jpg)

## 服务端配置

将公钥写入 ~/.ssh/authorized_keys，目录权限应为 700，文件权限 600。修改后无需重启 SSH 服务即可生效。

## 安全建议

私钥不要上传到服务器或共享目录。定期轮换密钥，离职人员及时从 authorized_keys 移除。
