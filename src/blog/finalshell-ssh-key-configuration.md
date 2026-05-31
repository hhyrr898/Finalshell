---
layout: article.njk
title: FinalShell SSH 密钥登录配置与安全实践
description: FinalShell 配置 SSH 私钥、公钥部署、权限设置与密钥轮换建议。
date: 2026-05-24
category: SSH 连接
tags: ["SSH密钥","安全登录","密钥管理"]
heroImage: "https://tse-mm.bing.com/th?q=FinalShell%20SSH%20%E5%AF%86%E9%92%A5%E7%99%BB%E5%BD%95%E9%85%8D%E7%BD%AE%E4%B8%8E%E5%AE%89%E5%85%A8%E5%AE%9E%E8%B7%B5"
heroAlt: "FinalShell SSH 密钥登录配置与安全实践 配图"
---

## 生成与导入

推荐使用 ed25519 或 RSA 4096 位密钥。私钥保存在本地安全目录，在 FinalShell 连接设置中选择密钥文件。

![FinalShell SSH 密钥](https://tse-mm.bing.com/th?q=FinalShell%20SSH%20key%20setup)

## 服务端配置

将公钥写入 ~/.ssh/authorized_keys，目录权限应为 700，文件权限 600。修改后无需重启 SSH 服务即可生效。

## 安全建议

私钥不要上传到服务器或共享目录。定期轮换密钥，离职人员及时从 authorized_keys 移除。
