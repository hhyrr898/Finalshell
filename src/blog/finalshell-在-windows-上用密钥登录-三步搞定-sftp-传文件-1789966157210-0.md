---
layout: article.njk
title: FinalShell 在 Windows 上用密钥登录，三步搞定 SFTP 传文件！
description: FinalShell 无法连接服务器？本文教你如何在 Windows 上使用 FinalShell 2024.03 版本，通过 SSH 密钥安全登录，并轻松进行 SFTP 文件传输，告别密码烦恼，高效管理你的服务器文件。
date: 2026-09-21
generated: true
category: 工具使用
tags: ["Windows客户端","SFTP传输","密钥登录"]
heroImage: "/static/images/photo-1486406146926-c627a92ad1ab.jpg"
heroAlt: "FinalShell 在 Windows 上用密钥登录，三步搞定 SFTP 传文件！ 配图"
---

你是不是也遇到过这样的情况：服务器密码一长串，每次登录 FinalShell 都要手动输入，效率低不说，安全性也让人不放心？又或者，你急着上传下载文件，却发现没有方便的图形界面工具？别担心！今天我们就来聊聊如何在 Windows 系统的 FinalShell 2024.03 版本中，通过 SSH 密钥实现安全便捷的登录，并顺带轻松搞定 SFTP 文件传输。

密码登录虽然直观，但密钥登录的优势实在太多了。它不仅大幅提升安全性，还能让你告别繁琐的密码输入。而且，一旦连接成功，FinalShell 自带的 SFTP 功能更是文件传输的一把好手，让你像操作本地文件一样管理服务器上的数据。

## FinalShell 密钥登录与 SFTP 传输实操

### 第一步：生成或导入 SSH 密钥

首先，我们需要一对 SSH 密钥：一个私钥保存在本地，一个公钥上传到服务器。FinalShell 内置了生成工具，用起来很方便。

1.  **打开密钥生成器：** 启动 FinalShell，在顶部的菜单栏里找到「工具」->「SSH密钥生成器」。
2.  **生成密钥对：** 在弹出的 `SSH密钥生成器` 窗口中，你可以选择密钥类型（推荐 RSA）和长度（2048 位或 4096 位）。如果私钥需要密码保护，可在 `密码` 栏输入。设置完毕，点击 `生成` 按钮。
3.  **保存密钥：** 生成后，务必点击 `保存私钥` 将私钥文件（如 `.pem` 或 `.ppk`）保存到本地安全位置。然后点击 `保存公钥`，将公钥内容复制下来或保存为 `.pub` 文件。稍后会用到。

如果你已有现成的 SSH 密钥对，可跳过此步，在后续会话配置中直接导入私钥文件。

### 第二步：配置服务器以接受公钥

私钥在你电脑上安全存放了，公钥则需要上传到你想要连接的 Linux 服务器上。我以 Linux 服务器为例：

1.  **登录服务器：** 暂时先用密码登录你的服务器。
2.  **创建或编辑 `authorized_keys` 文件：** 登录后，进入用户家目录 (`cd ~`)，检查是否存在 `.ssh` 目录。如果没有，创建它：`mkdir -p ~/.ssh`。**注意权限！** 最好设置 `chmod 700 ~/.ssh`。接着，用编辑器（如 `vi` 或 `nano`）打开或创建 `~/.ssh/authorized_keys` 文件：`vi ~/.ssh/authorized_keys`。
3.  **粘贴公钥内容：** 将第一步中保存的公钥内容（以 `ssh-rsa` 开头）完整地粘贴到 `authorized_keys` 文件的新一行里。一个文件可以有多行公钥，每行一个。
4.  **设置文件权限：** 这是很多人容易忽略的关键一步！`authorized_keys` 文件的权限必须是 `chmod 600 ~/.ssh/authorized_keys`。我测试时发现，如果文件权限不对，即使公钥上传了也无法通过密钥登录。

完成这些步骤后，你的服务器就已经准备好接受密钥登录了。如果你想深入了解 SSH 密钥的配置原理，可以看看这篇教程：[/blog/finalshell-ssh-key-configuration/](/blog/finalshell-ssh-key-configuration/)

### 第三步：在 FinalShell 中创建会话并连接

服务器端配置好了，现在回到 FinalShell，新建一个连接会话。

1.  **新建 SSH 会话：** 在 FinalShell 左上角点击 `连接` 图标，选择 `新建SSH会话`。
2.  **填写基本信息：** 在 `新建SSH会话` 窗口中，输入主机地址、SSH 端口（默认为 22），以及登录的用户名。
3.  **选择认证方式：** 在 `认证方式` 下拉菜单中，选择 `公钥`。然后，点击 `私钥文件` 输入框旁的文件夹图标，选择你第一步保存的私钥文件。如果私钥有密码，FinalShell 会提示你输入。
4.  **连接！** 确认无误，点击右下角的 `确定` 按钮。如果一切顺利，FinalShell 将通过私钥成功连接到服务器！

连接成功后，会话窗口分为上下两部分。上半部分是终端命令行，下半部分通常是 SFTP 文件列表。你可以在下半部分直接拖拽文件进行上传下载，或通过右键菜单操作文件和目录。这比命令行 `scp` 命令方便多了，具体操作可以参考这篇：[/blog/finalshell-sftp-file-transfer/](/blog/finalshell-sftp-file-transfer/)

![一个连接成功的FinalShell界面，显示终端和SFTP文件列表](/static/images/photo-1486406146926-c627a92ad1ab.jpg)

## 常见问题

### 1. 为什么密钥配置了还是无法登录？

*   **私钥密码：** 检查生成私钥时是否设置了密码？FinalShell 连接时需要输入这个密码。
*   **服务器端公钥：** 检查服务器 `~/.ssh/authorized_keys` 文件内容是否完整且正确，确保无格式问题。
*   **文件权限：** 再次确认 `~/.ssh` 目录权限为 `700`，`~/.ssh/authorized_keys` 文件权限为 `600`。这是最常见的问题之一。可使用 `ls -ld ~/.ssh` 和 `ls -l ~/.ssh/authorized_keys` 查看权限。
*   **服务器日志：** 查看服务器的 SSH 日志（通常在 `/var/log/auth.log` 或 `/var/log/secure`），获取具体错误信息。

### 2. SFTP 传输文件速度很慢或中断怎么办？

*   **网络带宽：** 检查本地网络和服务器网络带宽。带宽不足会直接影响传输速度。
*   **服务器负载：** 服务器当前是否负载很高？其他进程可能占用大量资源，影响文件传输。通过 `top` 或 `htop` 查看服务器负载。
*   **分批传输：** 传输大量小文件时，可尝试打包成压缩文件；超大文件可考虑使用 `screen`/`tmux` 配合 `scp` 后台运行，或利用 FinalShell 的断点续传功能（如有）。

### 3. 每次连接都要输入私钥密码，好麻烦！

这是因为你的私钥设置了加密密码。FinalShell 为了安全，每次连接都会要求输入。如果你觉得麻烦，有两种选择：

*   **记住密码：** FinalShell 连接对话框通常有“记住密码”选项。勾选后，密码会保存在本地，下次连接无需再输。但请注意，这会牺牲一定的安全性，请确保你的电脑环境是安全的。
*   **生成无密码私钥：** 在生成密钥时选择不设置密码。但**强烈不建议**这样做，尤其对于生产环境的服务器，因为任何拿到你私钥的人都能直接登录你的服务器，风险极高。

希望这篇教程能帮助你更高效、更安全地使用 FinalShell 来管理你的服务器！如果你对 FinalShell 在 Windows 上的安装有疑问，可以参考：[/blog/finalshell-windows-install-guide/](/blog/finalshell-windows-install-guide/)；如果想了解更多端口转发技巧，这篇也很有用：[/blog/finalshell-port-forwarding-guide/](/blog/finalshell-port-forwarding-guide/)。
## 延伸阅读

若需进一步查阅，可先看本站以下教程：

- [SSH 密钥轮换](/blog/finalshell-ssh-key-configuration/)
- [SFTP 发布工作流](/blog/finalshell-sftp-file-transfer/)
- [Linux 批量接入](/blog/finalshell-linux-ssh-setup/)
