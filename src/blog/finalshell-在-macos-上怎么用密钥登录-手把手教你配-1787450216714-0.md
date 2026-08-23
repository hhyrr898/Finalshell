---
layout: article.njk
title: FinalShell 在 macOS 上怎么用密钥登录？手把手教你配！
description: 在 macOS 上用 FinalShell 登录服务器时，密码输入太麻烦？这篇教程将详细指导你如何安装 FinalShell 并在 macOS 客户端上配置 SSH 密钥登录，省去每次输入密码的烦恼，让连接服务器更安全、更高效。解决你反复输
date: 2026-08-23
generated: true
category: FinalShell
tags: ["会话管理","密钥登录","macOS客户端"]
heroImage: "/static/images/photo-1486406146926-c627a92ad1ab.jpg"
heroAlt: "FinalShell 在 macOS 上怎么用密钥登录？手把手教你配！ 配图"
---

各位 FinalShell 的 macOS 用户们，是不是还在为每次连接服务器都要手动输入一长串密码而烦恼？尤其是管理多台服务器的时候，这效率真是让人头大。别担心，今天我就来教大家一个更安全、更便捷的登录方式——SSH 密钥登录。这篇教程以 FinalShell macOS 客户端为例，教你如何告别密码，实现一键登录。

## FinalShell macOS 版安装与初体验

首先，如果你还没有安装 FinalShell 的 macOS 客户端，可以前往其官网下载最新版本。截至我撰写本文时，最新稳定版是 **FinalShell 4.6.0**。安装过程非常简单，下载后通常双击 `.dmg` 文件，然后将 FinalShell 图标拖拽到“应用程序”文件夹即可。这和安装其他 macOS 应用没什么两样。

安装完成后，首次打开 FinalShell，你会看到一个简洁的界面。左侧是会话列表区域，右侧是终端显示区。如果你是第一次使用，这里会是空的。点击左上角的“连接”按钮或者“文件”->“新建会话”，就可以开始添加你的服务器了。

## 告别密码：配置 SSH 密钥登录

使用 SSH 密钥登录不仅省去了记忆复杂密码的麻烦，还能安全性，因为它依赖的是加密密钥对，远比普通密码更难被破解。下面我们就一步步来配置。

### 1. 生成 SSH 密钥对

这是密钥登录的第一步。密钥对包含一个私钥和一个公钥，私钥保存在你的 macOS 本地，公钥则上传到服务器。

打开 macOS 的“终端”应用（可以通过 Spotlight 搜索 `Terminal`），输入以下命令生成密钥对：

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

-   `-t rsa`：指定密钥类型为 RSA。
-   `-b 4096`：指定密钥长度为 4096 位，安全性更高。
-   `-C "your_email@example.com"`：为密钥添加注释，方便识别。

执行命令后，它会询问你将密钥保存在哪里。默认路径是 `~/.ssh/id_rsa`，直接按回车确认即可。接着会提示你输入 passphrase（密码短语），这是一个额外的安全层，每次使用私钥时都需要输入。如果你觉得每次都输入麻烦，可以直接按回车留空（不推荐在安全性要求高的场景下留空）。生成成功后，你会在 `~/.ssh/` 目录下看到 `id_rsa`（私钥）和 `id_rsa.pub`（公钥）两个文件。

### 2. 上传公钥到服务器

接下来，我们需要把刚刚生成的公钥 (`id_rsa.pub`) 上传到你要连接的服务器上。最简单的方法是使用 `ssh-copy-id` 命令，如果你的服务器支持的话：

```bash
sftp username@your_server_ip
```

连接上服务器后，进入你要放公钥的目录（通常是 `~/.ssh/`），然后将本地的 `id_rsa.pub` 文件传输上去。你可以使用 FinalShell 自带的 SFTP 功能来完成，这比命令行方便多了。具体可以参考这篇 [FinalShell SFTP 文件传输教程](/blog/finalshell-sftp-file-transfer/)。传输后，在服务器上执行：

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
cat id_rsa.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

这些命令的作用是：创建 `.ssh` 目录（如果不存在），设置 `.ssh` 目录的权限，将公钥内容追加到 `authorized_keys` 文件中，并设置 `authorized_keys` 文件的权限。特别注意，`~/.ssh` 目录的权限必须是 `700`，`authorized_keys` 文件的权限必须是 `600`，否则服务器会拒绝使用密钥登录。**我第一次在 macOS 上用 FinalShell 配置密钥登录的时候，就因为私钥文件权限不对，折腾了好久才搞明白，这是一个非常常见的坑！**

### 3. FinalShell 中配置密钥

现在，回到 FinalShell macOS 客户端，开始配置会话连接。

1.  点击左上角的“连接”按钮，选择“新建会话”。
2.  在弹出的“新建 SSH 会话”窗口中，首先填写“名称”（方便识别），“主机”（服务器 IP 地址或域名），“端口”（SSH 端口，默认为 22）。
3.  在连接弹窗左侧的“认证方式”选项中，选择“密钥登录”。
4.  然后在右侧的“私钥文件”路径处，点击文件夹图标，定位到你本地生成的私钥文件 `~/.ssh/id_rsa`。
5.  如果你的私钥设置了 passphrase，记得在“密码”字段中输入。如果没设置，留空即可。
6.  输入“用户”（你的服务器登录用户名）。
7.  点击“确定”保存设置。

现在，尝试连接你的服务器。如果一切顺利，你会发现无需输入密码，直接就登录成功了！

![FinalShell macOS 密钥登录配置界面](/static/images/macbook-desk.jpg)

## 常用会话管理技巧

FinalShell 不仅提供了强大的连接功能，它的会话管理功能也相当实用。对于管理多台服务器的用户来说，合理利用这些功能可以大大提高效率。

-   **会话分组**：在 FinalShell 的左侧会话树中，你可以创建文件夹来对不同的服务器进行分组。例如，你可以创建“生产环境”、“测试环境”、“个人项目”等文件夹，将相关的服务器会话拖拽进去。这样即使服务器再多，也能一目了然。
-   **快速复制会话**：如果你有多个配置相似的服务器，可以右键点击已有的会话，选择“复制”，然后修改 IP 地址等少量信息即可，省去了重复填写的麻烦。
-   **标签与搜索**：给会话添加标签或者利用搜索功能，可以帮助你快速找到目标服务器。

这些小技巧看似不起眼，但在日常工作中却能节省不少时间，尤其是在你需要频繁切换不同服务器时。

## 常见问题

### 问题一：连接时提示 `Permissions for 'id_rsa' are too open`

**原因**：SSH 客户端检测到你的私钥文件权限过高，为了安全考虑，它会拒绝使用这个私钥。

**解决办法**：在 macOS 终端中，给私钥文件设置正确的权限：

```bash
chmod 600 ~/.ssh/id_rsa
```

这个命令会将 `id_rsa` 文件设置为只有所有者可读写，其他用户没有任何权限，这是 SSH 私钥的安全要求。

### 问题二：密钥配置后仍然提示 `Permission denied (publickey)`

**原因**：这通常意味着服务器没有成功识别你的公钥，或者服务器端 SSH 配置不允许密钥登录。

**解决办法**：
1.  **检查服务器端 `~/.ssh/authorized_keys` 文件内容**：确保你上传的公钥内容完整且格式正确，并且没有多余的空格或换行符。同时，确保该文件的权限是 `600`，`~/.ssh` 目录的权限是 `700`。
2.  **检查 SSH 服务配置**：登录服务器（可能需要使用密码登录），检查 `/etc/ssh/sshd_config` 文件。确保 `PubkeyAuthentication yes` 未被注释，且 `PasswordAuthentication no`（如果希望禁用密码登录）或 `yes`（如果允许密码和密钥同时登录）。修改后需要重启 SSH 服务，例如在 Ubuntu 上使用 `sudo systemctl restart sshd`。
3.  **检查 SElinux 或防火墙**：在某些 Linux 发行版上，SElinux 可能会阻止 SSH 访问 `authorized_keys` 文件。尝试临时禁用 SElinux 进行测试（生产环境不建议），或者配置正确的安全上下文。此外，确认服务器防火墙（如 `ufw` 或 `firewalld`）没有阻断 SSH 端口的连接。

### 问题三：FinalShell macOS 版界面字体太小/显示不清晰

**原因**：macOS 的 Retina 屏幕分辨率较高，FinalShell 默认的字体设置可能显得过小，影响阅读体验。

**解决办法**：
1.  **调整 FinalShell 偏好设置**：在 FinalShell 菜单栏中，点击“文件” -> “偏好设置”（或快捷键 `⌘,`），在弹出的窗口中寻找“字体”或“终端”相关的设置项。你可以调整字体大小，选择更适合你屏幕的字体。
2.  **系统级字体缩放**：如果 FinalShell 内部设置无效或不满意，也可以考虑在 macOS 的“系统设置” -> “显示器”中，调整“分辨率”或“文本大小”选项，但这会影响所有应用的显示。

掌握 SSH 密钥登录后，你的 FinalShell 使用体验会更上一层楼。不仅方便快捷，安全性也大大提升。如果你对 [FinalShell 在 Windows 上的安装](/blog/finalshell-windows-install-guide/) 或者 [FinalShell 端口转发](/blog/finalshell-port-forwarding-guide/) 感兴趣，也可以点击链接查看更多教程。希望这篇教程能帮到你！
## 延伸阅读

若需进一步查阅，可先看本站以下教程：

- [SSH 密钥轮换](/blog/finalshell-ssh-key-configuration/)
- [SFTP 发布工作流](/blog/finalshell-sftp-file-transfer/)
- [macOS 工作站配置](/blog/finalshell-macos-install-steps/)
