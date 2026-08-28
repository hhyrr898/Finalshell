---
layout: article.njk
title: FinalShell：Windows 上用密钥登录和 SFTP 传文件，超简单！
description: 本文手把手教你在 Windows 系统上使用 FinalShell，通过 SSH 密钥安全登录服务器，并高效利用 SFTP 功能传输文件。如果你还在为密码登录服务器感到不便，或者不知道如何用 FinalShell 快速上传下载文件，这篇教程
date: 2026-08-28
generated: true
category: FinalShell
tags: ["Windows客户端","SFTP传输","密钥登录"]
heroImage: "/static/images/photo-1486406146926-c627a92ad1ab.jpg"
heroAlt: "FinalShell：Windows 上用密钥登录和 SFTP 传文件，超简单！ 配图"
---

经常和服务器打交道的朋友，肯定少不了 SSH 工具。FinalShell 作为一个功能强大又免费的工具，在 Windows 上用起来非常顺手。今天我们就来聊聊如何在 FinalShell 上设置密钥登录，以及高效地使用 SFTP 传输文件，彻底告别每次输入密码的烦恼。本文以 FinalShell 4.6.9 版本为例，带你一步步操作。

![使用 FinalShell 进行密钥登录和 SFTP 传输](/static/images/photo-1486406146926-c627a92ad1ab.jpg)

## FinalShell Windows 客户端安装小贴士

如果你还没有安装 FinalShell，可以前往官网下载最新版。我个人建议直接下载免安装版，解压即用，非常方便。对于 [FinalShell 在 Windows 上的安装](https://example.com/blog/finalshell-windows-install-guide/) 细节，本站有更详细的教程，你可以参考。确保你的 FinalShell 已经成功运行。

## 告别密码：设置 SSH 密钥登录

使用 SSH 密钥登录不仅更安全，而且大大提升了登录效率，省去了每次输入密码的麻烦。

### 第一步：生成 SSH 密钥对

1.  打开 FinalShell。在顶部菜单栏找到“工具箱”图标（通常是一个扳手或齿轮），点击后选择“生成SSH密钥”。
2.  在弹出的“SSH密钥生成器”窗口中，你可以选择密钥类型（通常推荐 RSA 或 Ed25519），以及密钥长度。为了安全起见，长度建议选择 2048 位或更高。你还可以设置一个密钥密码（Passphrase），这会为你的私钥再加一层保护，不过每次连接时都需要输入。如果你觉得麻烦，也可以留空。
3.  点击“生成”按钮，等待密钥对生成完成。
4.  生成完成后，你会看到公钥和私钥的内容。**务必将私钥保存到本地**。点击“保存私钥”按钮，选择一个安全的位置保存为 `.ppk` 或其他格式的文件（FinalShell 通常保存为 `privatekey.key` 类型的文件）。公钥内容可以先复制下来。

### 第二步：将公钥上传到服务器

密钥对生成好后，我们需要把公钥放到你想要连接的服务器上。

1.  **临时用密码登录服务器：** 如果这是你第一次配置密钥登录，你可能需要先用传统的用户名密码方式登录一次服务器。
2.  **创建或编辑 `authorized_keys` 文件：**
    *   登录服务器后，进入你的用户主目录（`cd ~`）。
    *   检查是否存在 `.ssh` 目录：`ls -ld ~/.ssh`。如果不存在，创建它：`mkdir ~/.ssh`。
    *   设置 `.ssh` 目录的权限：`chmod 700 ~/.ssh`。
    *   现在，我们需要将你刚才复制的公钥内容添加到 `~/.ssh/authorized_keys` 文件中。如果文件不存在，就创建它：`nano ~/.ssh/authorized_keys` 或 `vim ~/.ssh/authorized_keys`。
    *   将你本地生成的公钥内容（通常以 `ssh-rsa AAAA...` 或 `ssh-ed25519 AAAA...` 开头）粘贴到 `authorized_keys` 文件的末尾，确保每行公钥都是完整的。
    *   保存并退出编辑器。
    *   **设置 `authorized_keys` 文件权限：** 这一步非常关键！`chmod 600 ~/.ssh/authorized_keys`。如果权限不正确，SSH 服务器会拒绝使用该密钥。
3.  关于 [SSH 密钥的详细配置和最佳实践](https://example.com/blog/finalshell-ssh-key-configuration/)，本站也有专门的文章可以参考，帮你更深入地理解。

### 第三步：配置 FinalShell 使用密钥登录

现在万事俱备，我们可以配置 FinalShell 来使用私钥登录了。

1.  在 FinalShell 左侧的“会话”面板中，右键点击你要配置的服务器会话，选择“修改”。如果是新会话，则点击“新建会话”。
2.  在弹出的“连接”弹窗中，填写好会话名称、主机（IP地址或域名）、端口和用户名。
3.  重点来了：在**连接弹窗的右下角区域**，你会看到“认证方式”的下拉菜单。选择“公钥”。
4.  然后点击“私钥文件”旁边的文件夹图标，找到并选择你在第一步中保存到本地的私钥文件（`privatekey.key`）。
5.  如果你的私钥设置了密码（Passphrase），还需要在下方的“私钥密码”字段中输入。
6.  点击“确定”保存设置。
7.  现在，双击该会话尝试连接。如果一切顺利，你就能免密码直接登录到服务器了！我最近在测试 FinalShell 4.6.9 版本时，发现密钥导入的兼容性做得很好，基本没有遇到什么问题，整个流程下来非常顺畅。

## 文件传输利器：玩转 SFTP 功能

FinalShell 不仅仅是一个 SSH 终端，它的内置 SFTP 功能也非常实用，让你在管理文件时如虎添翼。

### 1. 快速开启 SFTP 视图

当你成功连接上服务器后，有几种方式可以打开 SFTP 文件传输界面：

*   **直接在会话窗口中切换：** 在当前 SSH 会话窗口的顶部菜单栏中，通常会有一个“文件”选项卡或图标。点击它，就可以在终端和 SFTP 文件管理界面之间快速切换。
*   **左侧会话树：** 在 FinalShell 的**左侧会话树**中，右键点击你已连接的服务器会话，选择“文件管理”。这会直接打开一个独立的 SFTP 窗口。

无论哪种方式，你都会看到一个类似文件管理器的界面，左侧是本地文件，右侧是服务器文件，非常直观。

### 2. 上传和下载文件

SFTP 的文件传输操作非常简单：

*   **拖拽文件：** 最直接的方式就是从你的本地文件管理器中，将文件或文件夹直接拖拽到 FinalShell SFTP 界面的服务器文件区域，即可完成上传。反之，从服务器文件区域拖拽到本地文件区域，即可下载。
*   **右键菜单：** 你也可以在文件或文件夹上点击右键，选择“上传”或“下载”选项。
*   **同步目录：** 对于需要保持本地和远程目录一致的场景，FinalShell 也提供了目录同步功能，非常省心。

FinalShell 的 SFTP 传输速度通常很快，而且支持断点续传，即使传输大文件也不必担心。如果你想更深入地了解 [FinalShell 的 SFTP 文件传输](https://example.com/blog/finalshell-sftp-file-transfer/) 技巧，本站也有详细的进阶教程。

## 常见问题解答

在使用 FinalShell 进行密钥登录和 SFTP 传输时，你可能会遇到一些小麻烦，这里列出几个常见问题及其解决方案。

### 1. 密钥登录失败，提示权限不足或认证失败？

*   **检查公钥是否正确：** 确认你上传到服务器 `~/.ssh/authorized_keys` 文件中的公钥是完整的，且没有多余的空格或换行符。
*   **检查服务器文件权限：** 这是最常见的问题！确保 `~/.ssh` 目录权限是 `700` (`drwx------`)，`~/.ssh/authorized_keys` 文件权限是 `600` (`-rw-------`)。
    ```bash
    chmod 700 ~/.ssh
    chmod 600 ~/.ssh/authorized_keys
    ```
*   **检查服务器 SSH 配置：** 有些服务器默认可能禁用密钥登录，或者禁用了某些密钥类型。检查 `/etc/ssh/sshd_config` 文件中的 `PubkeyAuthentication yes` 和 `PasswordAuthentication no`（如果想完全禁用密码登录）等配置，修改后记得重启 SSH 服务（`sudo systemctl restart sshd` 或 `sudo service sshd restart`）。

### 2. SFTP 传输过程中卡住或中断？

*   **网络连接问题：** 检查你的网络连接是否稳定。服务器网络负载高也可能导致传输中断。
*   **服务器存储空间：** 确认服务器目标目录有足够的存储空间。
*   **防火墙设置：** 有时本地或服务器的防火墙可能会限制 SFTP 端口（SSH 默认端口 22）。确保相关端口已开放。

### 3. SFTP 传输中文文件或目录名乱码？

*   FinalShell 会话设置中的编码不匹配是主要原因。在会话设置中，尝试将“编码”选项从“自动”切换到“UTF-8”或“GBK”，这通常能解决大部分乱码问题。
*   如果服务器是较老的系统，可能需要尝试其他编码，但现在大部分 Linux 系统都已使用 UTF-8。

### 4. 无法保存 FinalShell 的会话信息或配置？

*   这通常是由于 FinalShell 配置目录的权限问题。在 Windows 上，FinalShell 的配置数据通常保存在用户目录下的某个文件夹里。确保你的 Windows 用户对该目录有写入权限。尝试以管理员身份运行 FinalShell，看看问题是否解决。

希望通过这些详细的步骤和常见问题解答，能让你在 Windows 上更顺畅地使用 FinalShell 进行密钥登录和 SFTP 文件传输。如果你在使用过程中遇到其他问题，欢迎留言交流。
## 延伸阅读

若需进一步查阅，可先看本站以下教程：

- [SSH 密钥轮换](/blog/finalshell-ssh-key-configuration/)
- [SFTP 发布工作流](/blog/finalshell-sftp-file-transfer/)
- [Windows 生产部署](/blog/finalshell-windows-install-guide/)
