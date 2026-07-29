---
layout: article.njk
title: FinalShell macOS 版：告别密码，SSH 密钥登录这样做才省心！
description: 在 macOS 上使用 FinalShell 管理服务器时，还在手动输入密码？本文手把手教你如何配置 SSH 密钥登录，告别繁琐密码，提升连接安全性与效率。同时分享会话管理技巧，让你的服务器操作更流畅。
date: 2026-07-29
generated: true
category: 服务器管理
tags: ["会话管理","密钥登录","macOS客户端"]
heroImage: "/static/images/photo-1486406146926-c627a92ad1ab.jpg"
heroAlt: "FinalShell macOS 版：告别密码，SSH 密钥登录这样做才省心！ 配图"
---

很多朋友在 macOS 系统上管理 Linux 服务器时，会选择 FinalShell 这样的工具。它功能强大，但如果你还在每次连接都手动输入密码，那可就太费时费力了。今天就来聊聊如何在 FinalShell 的 macOS 客户端上配置 SSH 密钥登录，让你的服务器连接既安全又高效。

## 为什么要在 macOS 上用 FinalShell SSH 密钥登录？

SSH 密钥登录，顾名思义，就是用一对密钥（公钥和私钥）来替代传统的用户名密码认证方式。公钥放在服务器上，私钥保存在你的本地电脑。当你尝试连接服务器时，FinalShell 会用你的私钥去和服务器上的公钥进行匹配，匹配成功就能登录。

这种方式不仅省去了每次输入密码的麻烦，还能连接的安全性。毕竟，密钥比密码更难被破解和猜测。尤其对于 macOS 用户来说，操作起来同样方便快捷，配合 FinalShell 的会话管理功能，效率更是大大提升。

## FinalShell macOS 配置 SSH 密钥登录，三步搞定！

以 FinalShell macOS 客户端 **4.5.8 版本**为例，下面我们来看看具体操作步骤。

### 1. 生成 SSH 密钥对（如果还没有的话）

如果你已经有了 SSH 密钥对，可以跳过这一步。如果没有，打开 macOS 的“终端”应用，输入以下命令生成：

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

这条命令会生成一个 4096 位的 RSA 密钥对，并用你的邮箱作为注释。执行后，它会提示你输入保存密钥的路径和文件名，默认通常是 `~/.ssh/id_rsa`。我个人习惯使用默认路径。接着会让你设置一个密码（passphrase），这是一个保护你私钥的密码，强烈建议设置！这样即使私钥文件泄露，没有密码也无法使用。你会在终端中看到类似下面的输出：

```
Generating public/private rsa key pair.
Enter file in which to save the key (~/.ssh/id_rsa):
Created directory '/Users/yourusername/.ssh'.
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /Users/yourusername/.ssh/id_rsa.
Your public key has been saved in /Users/yourusername/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:...
your_email@example.com
```

这里会显示私钥和公钥的保存路径。`id_rsa` 是你的私钥，`id_rsa.pub` 是你的公钥。

### 2. 将公钥上传到你的服务器

有了公钥，下一步就是把它放到你的服务器上。最简单的方法是使用 `ssh-copy-id` 命令（如果你的服务器支持的话）：

```bash
ssh-copy-id -i ~/.ssh/id_rsa.pub username@your_server_ip
```

你需要把 `username` 替换成服务器上的用户名，`your_server_ip` 替换成服务器的 IP 地址或域名。执行这个命令后，它会提示你输入服务器的密码进行认证，成功后你的公钥就会自动添加到服务器用户家目录下的 `~/.ssh/authorized_keys` 文件中。如果 `ssh-copy-id` 不可用，你也可以手动复制 `~/.ssh/id_rsa.pub` 文件的内容，然后通过 SSH 登录服务器，将公钥内容追加到 `~/.ssh/authorized_keys` 文件末尾。切记，这个 `authorized_keys` 文件和 `.ssh` 目录的权限要设置正确，通常 `.ssh` 目录权限是 `700`，`authorized_keys` 文件权限是 `600`。

### 3. 在 FinalShell macOS 客户端中配置密钥登录

现在，我们回到 FinalShell 客户端来配置。打开 FinalShell，点击左上角的“连接”图标（一个插头形状），选择“新建会话”。在弹出的“新建 SSH 会话”窗口中，按照以下步骤操作：

1.  **填写基本信息**：在“名称”一栏给你的会话起个名字，在“主机”一栏填写服务器的 IP 地址或域名，端口一般是 `22`，用户是你在服务器上的用户名。
2.  **选择认证方式**：在“认证方式”下拉菜单中，选择“PublicKey”。
3.  **指定私钥文件**：点击“私钥文件”旁边的文件夹图标，在 macOS 的文件选择器中，找到并选择你在 **第一步** 生成的私钥文件，通常是 `~/.ssh/id_rsa`。如果你为私钥设置了密码，记得在“私钥密码”一栏中填入。
4.  **保存并连接**：确认所有信息无误后，点击右下角的“保存”按钮，然后双击左侧会话树中你刚刚创建的会话，就可以无密码连接到服务器了。

![配图说明：FinalShell 连接弹窗中的密钥配置区域](/static/images/photo-1486406146926-c627a92ad1ab.jpg)

## FinalShell macOS 会话管理小技巧

除了密钥登录，FinalShell 在会话管理方面也做得不错，尤其是在 macOS 客户端上：

*   **会话分组**：你可以将不同的服务器会话放到不同的分组里，例如“生产环境”、“测试环境”、“个人项目”等，这样左侧的会话树会更清晰。点击左侧会话树顶部的文件夹图标即可创建分组。
*   **标签颜色**：给重要的会话设置不同的标签颜色，一眼就能区分开来。在会话设置中，选择“样式”选项卡，就能自定义颜色了。
*   **快速搜索**：当会话非常多时，可以使用会话列表上方的搜索框快速查找。这在管理大量服务器时非常有用。 FinalShell 的 Windows 版本也有类似的会话管理功能，如果你也在使用 Windows，可以参考 [/blog/finalshell-windows-install-guide/](/blog/finalshell-windows-install-guide/) 这篇教程。
*   **会话备注**：在会话属性中添加详细的备注信息，记录服务器用途、管理员联系方式等，方便团队协作和个人回顾。

通过这些小技巧，你的 FinalShell 使用体验会更上一层楼，管理服务器也变得井井有条。

## 常见问题

### 1. 密钥配置后还是连不上，提示“Permission denied (publickey)”。

这通常是服务器端 `~/.ssh` 目录或 `authorized_keys` 文件权限设置不正确导致的。我记得我刚开始用 FinalShell macOS 版的时候，也经常因为私钥权限问题折腾好久，后来才发现是 `.ssh` 目录权限设置不对。你需要登录服务器（可能需要用密码方式），然后执行以下命令修正权限：

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

确保这两个文件的所有者是当前用户，并且其他用户没有写入权限。

### 2. 导入私钥文件后，FinalShell 提示“无法加载私钥”或“私钥格式错误”。

这可能是因为私钥的格式不是 FinalShell 所能识别的 OpenSSH 格式。某些工具生成的私钥可能是 Putty 的 `.ppk` 格式。你需要将其转换为 OpenSSH 格式。可以使用 `ssh-keygen` 命令进行转换：

```bash
ssh-keygen -p -f /path/to/your/private_key.ppk -m PEM
```

这会将 `.ppk` 文件转换为 PEM 格式，FinalShell 通常可以识别。然后在新生成的 PEM 格式私钥上再次尝试。

### 3. macOS 上 FinalShell 界面字体模糊怎么办？

这可能是 macOS 高分屏（Retina 屏幕）适配的问题。FinalShell 是基于 Java 开发的，在某些高分屏模式下可能会出现字体渲染不清晰的情况。你可以尝试在 FinalShell 的“工具”->“选项”中查看是否有界面相关的显示设置，或者在 macOS 的“系统设置”->“显示器”中调整显示分辨率或缩放模式，看看是否有改善。

### 4. `ssh-copy-id` 权限被拒，或者公钥上传到服务器后仍然无法登录。

这可能不仅仅是文件权限的问题。检查服务器的 SSH 服务配置（`/etc/ssh/sshd_config` 文件），确保 `PubkeyAuthentication yes` 已经开启，并且没有其他限制（如 `AllowUsers` 或 `DenyUsers`）。此外，防火墙（如 `firewalld` 或 `ufw`）或 SELinux（在某些 Linux 发行版上）也可能会阻止 SSH 连接。检查这些服务的日志和状态，确保它们没有误拦截你的连接尝试。如果你对 SSH 密钥配置有更深入的兴趣，可以参考这篇 [/blog/finalshell-ssh-key-configuration/](/blog/finalshell-ssh-key-configuration/) 教程获取更多信息。
## 延伸阅读

若需进一步查阅，可先看本站以下教程：

- [SSH 密钥轮换](/blog/finalshell-ssh-key-configuration/)
- [Linux 批量接入](/blog/finalshell-linux-ssh-setup/)
- [macOS 工作站配置](/blog/finalshell-macos-install-steps/)
