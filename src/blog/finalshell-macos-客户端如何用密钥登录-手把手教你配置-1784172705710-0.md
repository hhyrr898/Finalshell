---
layout: article.njk
title: FinalShell macOS 客户端如何用密钥登录？手把手教你配置
description: FinalShell macOS 客户端想用密钥登录服务器？还在输密码就OUT啦！本文手把手教你如何在 macOS 上生成 SSH 密钥，并将公钥部署到服务器，最后详细配置 FinalShell 客户端，实现免密安全连接。告别繁琐密码，提升
date: 2026-07-16
generated: true
category: 技术教程
tags: ["会话管理","密钥登录","macOS客户端"]
heroImage: "/static/images/photo-1486406146926-c627a92ad1ab.jpg"
heroAlt: "FinalShell macOS 客户端如何用密钥登录？手把手教你配置 配图"
---

各位 macOS 用户大家好，平时我们用 FinalShell 连接服务器，是不是经常得手动输入密码？特别是服务器多了，密码记不住，或者担心密码泄露，都挺让人头疼的。今天，我就来教大家一个更安全、更便捷的姿势：使用 SSH 密钥登录 FinalShell 的 macOS 客户端，彻底告别手动输入密码的烦恼。

## 准备工作：生成你的 SSH 密钥对

SSH 密钥登录的原理是，你在本地生成一对密钥：一个私钥（自己留着），一个公钥（放到服务器上）。当 FinalShell 尝试连接时，服务器会用你的公钥去验证你的私钥，如果匹配，就允许你登录。这个过程不需要密码，而且加密性更好。

这里我们以当前比较常见的 FinalShell 4.6.1 版本为例，操作步骤大同小异。

### 1. 在 macOS 终端生成密钥

打开你的 macOS 终端（在“应用程序” -> “实用工具”里可以找到），输入以下命令来生成 SSH 密钥对：

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

*   `ssh-keygen`：生成密钥的命令。
*   `-t rsa`：指定密钥类型为 RSA，目前仍然广泛使用。
*   `-b 4096`：指定密钥长度为 4096 位，安全性更高。
*   `-C "your_email@example.com"`：为你的密钥添加一个注释，通常是你的邮箱，方便识别。你可以替换成你自己的邮箱或其他标识。

执行命令后，它会问你“Enter file in which to save the key (/Users/yourusername/.ssh/id_rsa):”，这里直接回车，表示使用默认路径和文件名 `id_rsa`（私钥）和 `id_rsa.pub`（公钥）。

接下来会让你输入两次密码（`Enter passphrase`）。**这个密码是用来保护你的私钥的。** 如果你设置了，每次使用私钥时都需要输入。为了方便，也可以留空，这样就完全免密了。但从安全角度考虑，我个人建议设置一个复杂些的密码。

生成成功后，你的私钥文件 `id_rsa` 和公钥文件 `id_rsa.pub` 就会保存在 `~/.ssh/` 目录下。

![生成SSH密钥对](/static/images/photo-1486406146926-c627a92ad1ab.jpg)
*在macOS终端生成SSH密钥对的示意图，通常会有提示私钥和公钥的保存路径。*

### 2. 把公钥上传到服务器

私钥留在本地，公钥需要放到你要连接的服务器上。这里有两种常见方法：

**方法一：使用 `ssh-copy-id`（推荐）**

如果你的服务器支持 `ssh-copy-id` 命令，这是最简单的方法。在 macOS 终端输入：

```bash
ssh-copy-id -i ~/.ssh/id_rsa.pub user@your_server_ip
```

把 `user` 替换成你在服务器上的用户名，`your_server_ip` 替换成服务器的 IP 地址或域名。执行后会提示你输入服务器密码，输入正确后，你的公钥就会自动添加到服务器的 `~/.ssh/authorized_keys` 文件中。

**方法二：手动复制**

如果 `ssh-copy-id` 不可用，你就需要手动复制公钥内容。首先在 macOS 终端查看你的公钥内容：

```bash
cat ~/.ssh/id_rsa.pub
```

复制输出的全部内容。然后用 FinalShell 或其他方式（比如密码登录）连接到你的服务器，在服务器上执行以下命令：

```bash
# 如果没有 .ssh 目录，先创建它并设置权限
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# 将复制的公钥内容添加到 authorized_keys 文件中
# 注意：如果文件已存在，请不要直接覆盖，而是追加！
echo "在这里粘贴你的公钥内容" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

完成这一步，服务器就认识你的公钥了。关于更详细的 SSH 密钥配置，可以参考这篇教程：[FinalShell SSH 密钥配置指南](/blog/finalshell-ssh-key-configuration/)。

## FinalShell macOS 客户端配置密钥登录

现在，我们回到 FinalShell macOS 客户端，配置它使用刚才生成的密钥连接服务器。

### 1. 打开 FinalShell 并添加新会话

启动 FinalShell macOS 客户端。在主界面的左侧会话树上，你可以点击顶部工具栏的“连接”按钮，或者右键点击空白处选择“新建会话”。在弹出的“新建 SSH 连接”窗口中，按照常规步骤填写连接信息：

*   **名称**：给你的连接起个好记的名字（比如“我的阿里云服务器”）。
*   **主机**：填写你的服务器 IP 地址或域名。
*   **端口**：SSH 端口，默认为 22。
*   **用户名**：填写你在服务器上的登录用户名（通常是 `root` 或你自己创建的用户）。

### 2. 配置会话的认证方式

在同一个“新建 SSH 连接”窗口中，找到“认证方式”或类似的选项。这里是关键一步：

*   将认证方式从“密码”切换到“PublicKey”或“密钥登录”（不同版本或语言可能略有差异）。
*   点击“密钥文件”旁边的文件夹图标，在弹出的文件选择器中，浏览并选择你之前在 macOS 上生成的私钥文件 `~/.ssh/id_rsa`。
*   如果你的私钥设置了密码（passphrase），请在“密钥密码”字段中输入。如果留空了，这里也留空。

**小提示**：我踩过一个坑，刚开始没注意到 FinalShell 默认的文件选择器不显示隐藏文件（比如 `.ssh` 目录）。你需要按下 `Command + Shift + .` 组合键来显示隐藏文件，才能找到 `~/.ssh/id_rsa`。

### 3. 保存并连接

确认所有信息填写无误后，点击窗口右下角的“保存”按钮。现在，你的新会话就出现在左侧会话树里了。双击这个会话，FinalShell 就会尝试使用你配置的密钥进行连接。如果一切顺利，你就能直接进入服务器终端，无需输入密码！

你会发现，通过 FinalShell 传文件也变得更顺手了。如果你想了解更多文件传输技巧，可以看看这篇：[FinalShell SFTP 文件传输指南](/blog/finalshell-sftp-file-transfer/)。

## 常见问题

在使用密钥登录时，偶尔会遇到一些小麻烦，别担心，这里列出几个常见问题及解决办法。

### 问题一：连接失败，提示权限问题（`Permissions denied`）

这通常是服务器上的 `~/.ssh` 目录或 `authorized_keys` 文件的权限设置不正确导致的。SSH 为了安全，对这些文件的权限要求很严格。请通过密码登录服务器，然后执行以下命令检查并修正权限：

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

同时，确保你的家目录（`/home/yourusername` 或 `/root`）权限也正确，通常是 `755` 或 `700`，且所有者是你当前用户。

### 问题二：私钥文件找不到或无法读取

确保你在 FinalShell 中选择的私钥文件路径是正确的，并且文件确实存在。在 macOS 上，`~/.ssh/id_rsa` 是一个隐藏文件。如上文所说，在文件选择器里，你需要按下 `Command + Shift + .` 来显示隐藏文件。

另外，确保 FinalShell 应用程序本身有权限访问你的用户目录。在某些 macOS 版本中，你可能需要在“系统设置” -> “隐私与安全性” -> “文件和文件夹”中，为 FinalShell 授予“完全磁盘访问权限”。

### 问题三：明明配置了密钥，连接时却一直弹出密码框

这通常有几种可能：

1.  **服务器上的公钥未正确添加**：检查服务器 `~/.ssh/authorized_keys` 文件内容是否完整，是否包含你本地 `id_rsa.pub` 的全部内容。
2.  **FinalShell 中选错了私钥文件**：确认你选择的 `id_rsa` 文件是你上传公钥到服务器时对应的私钥。
3.  **私钥密码输入错误**：如果你为 `id_rsa` 设置了密码，确保在 FinalShell 的“密钥密码”字段中输入正确。如果 FinalShell 尝试了密码登录，说明它未能成功使用你的密钥。

密钥登录一旦配置成功，你会发现管理服务器的体验会大大提升。特别是当你需要维护多台服务器，或者像我一样，经常需要远程开发时，这种免密登录方式简直是生产力工具！祝大家使用愉快！
## 延伸阅读

若需进一步查阅，可先看本站以下教程：

- [SSH 密钥轮换](/blog/finalshell-ssh-key-configuration/)
- [macOS 工作站配置](/blog/finalshell-macos-install-steps/)
- [Linux 批量接入](/blog/finalshell-linux-ssh-setup/)
