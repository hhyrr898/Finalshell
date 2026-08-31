---
layout: article.njk
title: FinalShell 在 macOS 上用密钥登录，终于不用每次输密码了！
description: 厌倦了在 macOS 上用 FinalShell 连接服务器时反复输入密码？本文将手把手教你如何配置 SSH 密钥登录，告别繁琐，一劳永逸。包括安装、生成和上传密钥的详细步骤，以及常见问题解答，让你的远程管理体验更高效。
date: 2026-08-31
generated: true
category: 技术教程
tags: ["会话管理","密钥登录","macOS客户端"]
heroImage: "/static/images/photo-1486406146926-c627a92ad1ab.jpg"
heroAlt: "FinalShell 在 macOS 上用密钥登录，终于不用每次输密码了！ 配图"
---

每次在 Mac 上用 FinalShell 连接服务器，都要手动输入密码，真的让人很烦躁。尤其是需要频繁连接多台服务器时，再好的记忆力也顶不住。今天我来教大家一个一劳永逸的办法，那就是使用 SSH 密钥登录，彻底告别繁琐的密码困扰。

## 告别密码：FinalShell macOS 密钥登录实战

在开始之前，请确保你的 FinalShell macOS 客户端版本至少是 4.6.0。如果你还没安装 FinalShell 或者想了解更多基础配置，可以参考这篇教程：[FinalShell Windows 安装指南](/blog/finalshell-windows-install-guide/)（虽然是 Windows 版，但 macOS 的安装和基础设置思路也类似，你可以从中找到一些通用指导）。

### 第一步：打开终端，生成 SSH 密钥对

首先，我们需要在 macOS 系统上生成一对 SSH 密钥。这个过程非常简单，只需打开“终端”应用，然后输入以下命令：

```bash
ssh-keygen -t rsa -b 4096 -C "你的邮箱@example.com"
```

这条命令会生成一个 RSA 类型的密钥对，` -b 4096 ` 指定了密钥的长度为 4096 位，这能提供更高的安全性，` -C "你的邮箱@example.com" ` 则是为你的密钥添加一个备注，方便识别。执行命令后，它会提示你密钥的保存路径（默认是 `~/.ssh/id_rsa`），通常直接回车接受默认路径即可。

接着，系统会让你输入一个 passphrase（密码）。这个密码是用来保护你的私钥的，非常重要！如果你不希望每次使用私钥时都输入密码，可以选择留空直接回车。但我个人建议为了信息安全，最好还是设置一个。成功生成后，你的 `~/.ssh` 目录下就会有两个新文件：`id_rsa`（这是你的私钥，务必妥善保管）和 `id_rsa.pub`（这是你的公钥，可以分享给服务器）。

### 第二步：将公钥上传到你的服务器

密钥对生成好了，接下来就是把 `id_rsa.pub` 这个公钥文件上传到你想要连接的服务器上。最简单、最推荐的方法是使用 `ssh-copy-id` 命令：

```bash
ssh-copy-id -i ~/.ssh/id_rsa.pub user@your_server_ip
```

将 `user` 替换为你的服务器登录用户名，`your_server_ip` 替换为服务器的 IP 地址或域名。这条命令会提示你输入服务器的密码，成功后，你的公钥就会被自动添加到服务器上的 `~/.ssh/authorized_keys` 文件里。这个文件包含了所有允许通过密钥登录的用户公钥。

如果你没有 `ssh-copy-id` 命令，或者更喜欢手动操作，也可以这样做：

1.  打开你 macOS 上 `~/.ssh/id_rsa.pub` 文件，复制里面的全部内容。
2.  使用 FinalShell 或者其他方式，先用密码登录到你的目标服务器。
3.  在服务器上创建或编辑 `~/.ssh/authorized_keys` 文件（如果 `~/.ssh` 目录不存在，需要先创建 `mkdir -p ~/.ssh`），然后将你复制的公钥内容粘贴进去，一行一个公钥。
4.  **非常重要的一步：** 检查文件权限。服务器上的 `~/.ssh` 目录权限必须是 `700` (只有所有者可读写执行)，`~/.ssh/authorized_keys` 文件的权限必须是 `600` (只有所有者可读写)。你可以使用以下命令修正：`chmod 700 ~/.ssh` 和 `chmod 600 ~/.ssh/authorized_keys`。

我踩过一个坑，就是 `authorized_keys` 的权限不对，导致密钥认证一直失败，排查了半天才发现问题所在。所以这一步请务必仔细操作。

### 第三步：在 FinalShell 中配置密钥登录

现在，回到 FinalShell macOS 客户端，我们来配置连接信息：

1.  在左侧的会话树中找到你要连接的服务器，右键点击选择“属性”，或者如果你是新建连接，直接进入连接配置界面。
2.  在弹出的连接配置窗口中，找到“认证”或“身份验证”选项卡。
3.  将认证方式选择为“Public Key”或“密钥”。
4.  在“私钥文件”字段旁，点击文件夹图标，选择你 macOS 上生成的私钥文件，也就是 `~/.ssh/id_rsa`。
5.  如果你之前为私钥设置了 passphrase，记得在“密码/Passphrase”字段中准确填写。如果没有设置，此处留空。
6.  确认“用户”是你服务器上的登录用户名。
7.  点击“确定”保存你的配置，然后尝试连接服务器。

连接成功后，你会发现不再需要输入密码了！是不是感觉整个世界都清爽了许多？

![配图说明](/static/images/photo-1486406146926-c627a92ad1ab.jpg)

## 常见问题

### 1. FinalShell 提示“认证失败”，但服务器密码登录是好的？

这通常是密钥配置或权限问题。你可以按照以下步骤排查：

-   **检查私钥文件路径：** 确保你在 FinalShell 中选择的 `id_rsa` 文件路径是正确的，并且文件确实存在且可访问。
-   **检查私钥 Passphrase：** 如果你生成私钥时设置了密码，FinalShell 中的“密码/Passphrase”字段必须准确填写，区分大小写。
-   **服务器权限问题：** 登录服务器（用密码登录），检查 `~/.ssh` 目录的权限是否为 `700`，`~/.ssh/authorized_keys` 文件的权限是否为 `600`。可以使用 `ls -ld ~/.ssh` 和 `ls -l ~/.ssh/authorized_keys` 命令查看。如果权限不对，请用 `chmod 700 ~/.ssh` 和 `chmod 600 ~/.ssh/authorized_keys` 修正。
-   **公钥内容是否正确：** 确认服务器上 `authorized_keys` 文件中的公钥内容是你 `id_rsa.pub` 的内容，没有多余的空格或换行符，并且是完整的一行。

### 2. 为什么我生成的密钥在 FinalShell 里选择不了，或者选择后无法识别？

这可能是文件权限或者密钥格式问题。

-   **文件权限：** macOS 上对 `~/.ssh` 目录及密钥文件的权限比较严格。确保你的用户对 `id_rsa` 文件有读取权限。
-   **FinalShell 版本：** 有些旧版本的 FinalShell 对某些密钥格式支持不佳。可以尝试更新 FinalShell 到最新版本，比如 FinalShell 4.6.0，这通常能解决兼容性问题。
-   **OpenSSH 格式：** 确保你的私钥是 OpenSSH 格式。`ssh-keygen` 默认生成的都是这种格式，但如果你是从其他工具导入的密钥，可能需要转换。

### 3. 我有多个服务器，需要为每个服务器生成一套密钥吗？

不需要！通常情况下，你可以使用同一对 SSH 密钥来访问多个服务器。你只需将同一个 `id_rsa.pub` 公钥上传到所有你想通过密钥访问的服务器上即可。当然，为了更高的安全性或项目隔离，一些经验丰富的用户可能会为不同的服务器或项目生成不同的密钥对，但这对于普通用户来说并非必需，一套密钥已经足够方便和安全了。

如果你对 FinalShell 的其他高级功能感兴趣，比如文件传输，可以看看这篇关于 SFTP 的教程：[FinalShell SFTP 文件传输完全攻略](/blog/finalshell-sftp-file-transfer/)。另外，关于端口转发的使用方法，也有详细教程可以参考：[FinalShell 端口转发实用指南](/blog/finalshell-port-forwarding-guide/)。
## 延伸阅读

若需进一步查阅，可先看本站以下教程：

- [SSH 密钥轮换](/blog/finalshell-ssh-key-configuration/)
- [Windows 生产部署](/blog/finalshell-windows-install-guide/)
- [macOS 工作站配置](/blog/finalshell-macos-install-steps/)
