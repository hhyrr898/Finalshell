---
layout: article.njk
title: FinalShell 在 macOS 上搞定 SSH 密钥登录，告别密码输入烦恼！
description: FinalShell macOS 用户看过来！这篇指南手把手教你如何在 macOS 系统上配置 SSH 密钥登录服务器，彻底告别繁琐的密码输入。从生成密钥到 FinalShell 会话配置，全程指引，让你的远程管理更高效、更安全。轻松搞定 
date: 2026-07-22
generated: true
category: 技术实操
tags: ["会话管理","密钥登录","macOS客户端"]
heroImage: "/static/images/photo-1486406146926-c627a92ad1ab.jpg"
heroAlt: "FinalShell 在 macOS 上搞定 SSH 密钥登录，告别密码输入烦恼！ 配图"
---

作为一名经常要维护服务器的技术人，我深知每次输入服务器密码的痛苦。尤其是在 macOS 上使用 FinalShell 这样的工具，如果能直接用密钥登录，那效率和安全性都会大大提升。今天就手把手教你在 macOS 系统上，如何利用 FinalShell 的 4.6.0 版本进行 SSH 密钥登录，彻底告别频繁输入密码的烦恼。

![在 FinalShell macOS 客户端中配置 SSH 密钥登录](/static/images/photo-1486406146926-c627a92ad1ab.jpg)

## 为什么推荐密钥登录？

传统的密码登录方式，密码越简单越容易被破解，密码越复杂又越难记忆和输入。而 SSH 密钥登录（Public Key Authentication）则完美解决了这些痛点。它通过一对加密的密钥来验证身份：一个私钥保存在本地，一个公钥上传到服务器。这种方式的优点显而易见：

*   **安全性更高：** 密钥对通常长度更长，加密性更强，比普通密码更难被暴力破解。
*   **操作更便捷：** 一旦配置完成，你无需每次手动输入密码，一键连接，省时省力。
*   **自动化集成：** 方便脚本进行自动化操作，无需人工干预。

## 第一步：在 macOS 上生成 SSH 密钥对

首先，我们需要在你的 macOS 电脑上生成一对 SSH 密钥。这个过程非常简单，只需要打开“终端”应用，然后输入以下命令：

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

这条命令的含义是：
*   `ssh-keygen`: 用于生成密钥的工具。
*   `-t rsa`: 指定密钥类型为 RSA。
*   `-b 4096`: 指定密钥长度为 4096 位，安全性更高（默认是 2048 位）。
*   `-C "your_email@example.com"`: 为密钥添加一个注释，通常是你的邮箱，方便识别。

执行命令后，它会询问你密钥的保存位置，默认是在 `~/.ssh/id_rsa`，直接按回车即可。然后会让你输入一个密码（passphrase），这是用于保护私钥的密码。如果你不希望每次使用私钥时都输入密码，可以直接按回车留空，但我个人建议为了安全还是设置一个。当你执行完命令后，终端会提示你密钥文件保存的路径，通常是 `~/.ssh/id_rsa` (私钥) 和 `~/.ssh/id_rsa.pub` (公钥)，一定要记下这个路径。

## 第二步：将公钥上传到你的服务器

生成了密钥对之后，我们需要把公钥 `id_rsa.pub` 上传到你想要连接的服务器上。这里有两种常见的方法：

### 方法一：使用 `ssh-copy-id` 命令（推荐）

如果你的 macOS 系统和服务器都安装了 `ssh-copy-id` 工具（通常是默认安装），这是最方便的方法：

```bash
ssh-copy-id -i ~/.ssh/id_rsa.pub user@your_server_ip
```

*   `-i ~/.ssh/id_rsa.pub`: 指定要上传的公钥文件。
*   `user@your_server_ip`: 服务器的用户名和 IP 地址。

执行后会让你输入一次服务器的密码，成功后，公钥就会自动添加到服务器用户家目录下的 `~/.ssh/authorized_keys` 文件中。想了解更多关于 SSH 密钥的配置细节，可以参考 [FinalShell SSH 密钥配置指南](/blog/finalshell-ssh-key-configuration/)。

### 方法二：手动上传公钥

如果 `ssh-copy-id` 不可用，你也可以手动完成：

1.  **获取公钥内容：** 在本地 macOS 终端中输入 `cat ~/.ssh/id_rsa.pub`，然后复制显示出来的全部内容。
2.  **连接服务器：** 使用密码方式首次连接到服务器：`ssh user@your_server_ip`。
3.  **创建或编辑 `authorized_keys` 文件：**
    *   首先，确保 `~/.ssh` 目录存在并且权限正确：
        ```bash
        mkdir -p ~/.ssh
        chmod 700 ~/.ssh
        ```
    *   然后，将你复制的公钥内容添加到 `~/.ssh/authorized_keys` 文件中。注意是 `>>` 而不是 `>`，以避免覆盖已有内容。
        ```bash
        echo "你的公钥内容（从本地复制的）" >> ~/.ssh/authorized_keys
        ```
    *   最后，设置 `authorized_keys` 文件的权限：
        ```bash
        chmod 600 ~/.ssh/authorized_keys
        ```

完成以上步骤后，你的服务器就配置好了，可以接受你本地的密钥登录请求了。

## 第三步：在 FinalShell (macOS 4.6.0) 中配置 SSH 会话

现在，我们回到 FinalShell 客户端，配置一个新的会话来实现密钥登录：

1.  **打开 FinalShell：** 启动你的 FinalShell (macOS 4.6.0) 客户端。
2.  **新建会话：** 点击左上角的 “文件” -> “新建” -> “SSH会话”，或者直接点击界面上的“新建会话”按钮。
3.  **填写连接信息：**
    *   **名称：** 给你的会话起一个好记的名字，比如“我的生产服务器”。
    *   **主机：** 填写你的服务器 IP 地址或域名。
    *   **端口：** SSH 默认端口是 22，如果你的服务器修改了，记得填写正确的端口号。
    *   **用户名：** 填写你在服务器上的用户名，比如 `root` 或 `ubuntu`。
4.  **配置认证方式：**
    *   在弹出的连接配置窗口中，你会看到一个 “认证方式” 的下拉菜单，务必选择 `'publickey'`。
    *   接着，在下方出现的 “私钥文件” 文本框里，填入你本地私钥文件的完整路径，比如 `/Users/你的用户名/.ssh/id_rsa`。可以直接点击右侧的文件夹图标进行选择。
    *   如果你的私钥在生成时设置了密码（passphrase），别忘了在 “私钥密码” 栏位里也填上。
5.  **保存并连接：** 确认所有信息无误后，点击右下角的 “保存” 按钮。然后在左侧会话树中找到你刚创建的会话，双击即可连接。如果一切顺利，你应该就能无需密码直接连接到服务器了。

如果你是 FinalShell 新用户，也可以看看 [FinalShell Windows 安装指南](/blog/finalshell-windows-install-guide/)，了解一些基础操作。

## 常见问题和解决方法

在配置 SSH 密钥登录过程中，你可能会遇到一些问题，别担心，这里有一些常见的解决方法。

### 1. FinalShell 提示 '认证失败' 或 'Permission denied (publickey)'？

这是最常见的错误。通常是以下原因造成的：

*   **服务器 `~/.ssh/authorized_keys` 文件权限不正确：** 确保该文件权限是 `600` (`-rw-------`)，所属用户和用户组正确。`chmod 600 ~/.ssh/authorized_keys` 可以解决。
*   **服务器 `~/.ssh` 目录权限不正确：** 确保目录权限是 `700` (`drwx------`)。`chmod 700 ~/.ssh` 可以解决。
*   **公钥内容复制错误：** 检查 `authorized_keys` 文件中的公钥内容是否完整、正确，没有多余的空格或换行符。我之前就踩过一个坑，粗心大意地把公钥内容复制错了，或者文件权限没给对，结果连着好几次都报这个错，排查半天才发现是自己的小失误。
*   **FinalShell 私钥路径错误：** 再次检查你在 FinalShell 中填写的私钥文件路径是否正确，且本地私钥文件存在。
*   **服务器 SSH 服务配置：** 确认服务器的 `/etc/ssh/sshd_config` 文件中 `PubkeyAuthentication` 设置为 `yes`，修改后需要重启 SSH 服务 `sudo systemctl restart sshd`。

### 2. 每次连接都要输入私钥密码，太麻烦了？

如果你为私钥设置了密码，FinalShell 会在每次连接时要求你输入。在 macOS 上，你可以利用 `ssh-agent` 和钥匙串（Keychain）来记住这个密码：

在终端中运行：
```bash
ssh-add -K ~/.ssh/id_rsa
```
这会将你的私钥添加到 `ssh-agent`，并存储在 macOS 的钥匙串中。下次连接时，FinalShell 就无需再次询问密码了。

### 3. 连接速度慢或者文件传输有问题？

这通常与网络环境有关，可能是你本地网络不稳定，或者是服务器的带宽有限。你可以尝试更换一个网络环境再试，或者检查服务器负载。FinalShell 也提供了 SFTP 功能进行文件传输，如果你传输大文件遇到问题，可以参考 [FinalShell SFTP 文件传输攻略](/blog/finalshell-sftp-file-transfer/) 看看是否有空间。

### 4. macOS 系统更新后，FinalShell 突然连不上了？

macOS 系统更新有时会影响 SSH 代理或权限设置。这可能会导致 `ssh-agent` 无法正常工作，从而影响 FinalShell 的密钥认证。你可以尝试以下步骤：

*   重启 FinalShell 客户端。
*   在终端中运行 `ssh-add -D` 清除所有已加载的密钥。
*   然后重新运行 `ssh-add -K ~/.ssh/id_rsa` 将你的私钥重新添加到钥匙串和 `ssh-agent` 中。

了解更多 FinalShell 的高级功能，比如 [FinalShell 端口转发指南](/blog/finalshell-port-forwarding-guide/)，也能帮助你解决一些连接和访问的特殊需求。希望这篇教程能帮助你在 macOS 上顺利使用 FinalShell 密钥登录，提升你的工作效率！
## 延伸阅读

若需进一步查阅，可先看本站以下教程：

- [SSH 密钥轮换](/blog/finalshell-ssh-key-configuration/)
- [macOS 工作站配置](/blog/finalshell-macos-install-steps/)
- [Windows 生产部署](/blog/finalshell-windows-install-guide/)
