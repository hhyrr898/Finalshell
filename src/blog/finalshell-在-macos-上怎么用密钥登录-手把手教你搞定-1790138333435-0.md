---
layout: article.njk
title: FinalShell 在 macOS 上怎么用密钥登录，手把手教你搞定！
description: FinalShell macOS 客户端如何配置 SSH 密钥登录？本文从生成密钥对、上传公钥到服务器，到最终在 FinalShell 中配置会话的全过程，帮你解决登录难题，提升安全性，让连接服务器更便捷高效。
date: 2026-09-23
generated: true
category: 服务器工具
tags: ["会话管理","密钥登录","macOS客户端"]
heroImage: "/static/images/photo-1486406146926-c627a92ad1ab.jpg"
heroAlt: "FinalShell 在 macOS 上怎么用密钥登录，手把手教你搞定！ 配图"
---

很多用 Mac 的朋友，都希望找到一个既稳定又功能丰富的 SSH 工具来管理远程服务器。FinalShell 在 macOS 上的表现确实可圈可点，它集成了 SSH、SFTP、本地终端等多种功能，尤其适合我们日常维护和开发。不过，初次在 macOS 上配置 SSH 密钥登录，特别是对于习惯了密码登录的朋友，可能会觉得有点无从下手。今天，我就以 FinalShell 4.6.14 版为例，手把手教大家如何在 macOS 客户端上配置并使用 SSH 密钥登录，让你的服务器管理更安全、更高效。

## 为什么要用 SSH 密钥登录？

简单来说，SSH 密钥登录相比传统的密码登录，在安全性上有着显著的提升，而且操作起来更加便捷。你不需要每次连接都输入那些又长又复杂的密码，密钥对的加密强度远高于普通密码。它通过公钥和私钥的匹配来验证身份，即使有人截获了你的连接数据，没有私钥和对应的密码，也无法登录你的服务器。

## 第一步：生成 SSH 密钥对

这是我们实现密钥登录的基础。我们会在 macOS 本地生成一对 SSH 密钥。

1.  **打开终端：** 在 macOS 系统中，你可以按下 `Command + Space` 快捷键，输入 `Terminal` 并回车，就能打开终端应用程序。
2.  **生成密钥：** 在终端中输入以下命令，然后回车：
    ```bash
    ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
    ```
    -   `-t rsa`：指定要生成的密钥类型为 RSA。这是目前广泛使用且安全性较好的类型。
    -   `-b 4096`：指定密钥的位数。4096 位比默认的 2048 位更安全，强烈推荐使用。
    -   `-C "your_email@example.com"`：为你的公钥添加一个注释。这个注释可以是你的邮箱、用户名或者任何能帮助你识别这个密钥的信息，方便你未来管理多个密钥。
3.  **设置保存路径和私钥密码：**
    -   命令执行后，系统会首先询问你密钥的保存路径。默认路径是 `~/.ssh/id_rsa`。对于大多数用户来说，直接按回车键使用默认路径即可。如果你想为不同的服务器生成不同的密钥，可以指定一个不同的文件名，例如 `~/.ssh/my_server_key`。
    -   接着，系统会要求你输入一个“私钥密码”（passphrase）。这个密码是用来保护你的私钥的。强烈建议设置一个，这样即使你的私钥文件不慎泄露，没有这个密码，攻击者也无法使用它。输入两次密码确认。如果你选择不设置，直接按回车键跳过即可，但安全性会降低。
    -   成功生成后，你会在 `~/.ssh/` 目录下看到两个文件：`id_rsa`（这是你的私钥，请务必妥善保管，绝不能泄露）和 `id_rsa.pub`（这是你的公钥，可以安全地分享给服务器）。

![macOS 上 FinalShell 密钥登录流程示意图](/static/images/macos-finalshell-ssh-key.jpg)

## 第二步：上传公钥到服务器

现在你已经有了公钥，接下来需要把 `id_rsa.pub` 文件的内容添加到你想要连接的服务器上。

1.  **复制公钥内容：** 在 macOS 终端中，输入以下命令并回车，会显示 `id_rsa.pub` 文件的全部内容：
    ```bash
    cat ~/.ssh/id_rsa.pub
    ```
    选中并复制屏幕上显示的从 `ssh-rsa` 开头到你邮箱注释结尾的所有字符。
2.  **登录服务器：** 使用 FinalShell 或者直接通过终端以密码方式登录到你的目标服务器。如果你还没有在 FinalShell 中配置任何会话，可以参考 [FinalShell Windows 安装教程](/blog/finalshell-windows-install-guide/) 中的基础连接方法，先用密码方式登录一次。
3.  **配置服务器上的授权文件：**
    -   登录到服务器后，进入你的用户主目录（通常是 `/home/your_username/` 或者对于 root 用户是 `/root/`）。
    -   检查是否存在 `.ssh` 目录。如果没有，需要先创建它并设置正确的权限：
        ```bash
        mkdir -p ~/.ssh && chmod 700 ~/.ssh
        ```
    -   然后，编辑或创建 `~/.ssh/authorized_keys` 文件。这个文件用于存放所有允许通过密钥登录的公钥。
        ```bash
        vi ~/.ssh/authorized_keys
        ```
    -   按下 `i` 键进入 `vi` 编辑器的插入模式，然后将你之前复制的公钥内容粘贴到文件的末尾。**请注意，一个公钥必须单独占据一行，不要有换行或多余的空格。**
    -   粘贴完成后，按下 `Esc` 键退出插入模式，然后输入 `:wq` 并回车，保存并退出 `vi` 编辑器。
    -   最后，设置 `authorized_keys` 文件的权限。这一步非常关键，权限不对会导致密钥登录失败：
        ```bash
        chmod 600 ~/.ssh/authorized_keys
        ```
    -   至此，服务器端的配置就完成了。

## 第三步：在 FinalShell 中配置密钥登录

公钥已经部署到服务器了，现在我们可以回到 FinalShell macOS 客户端，配置使用私钥进行登录了。

1.  **打开 FinalShell：** 在你的 macOS 上启动 FinalShell 应用程序。
2.  **新建或编辑会话：**
    -   在 FinalShell 界面的左侧，你会看到“会话树”。你可以在空白处右键点击，选择“新建连接”，或者如果你已经有了一个密码登录的会话，也可以右键选择“编辑”来修改它。
    -   在弹出的“新建会话”或“编辑会话”窗口中，首先填写“主机”（服务器的 IP 地址或域名）、“端口”（SSH 端口，默认为 22）和“描述”（一个容易识别的名称）。
3.  **配置私钥认证：**
    -   在会话配置界面的“认证”类型下拉菜单中，选择“私钥”。
    -   接着，点击“私钥文件”字段旁边的文件夹图标。在文件选择器中，导航到你之前生成私钥的路径（默认是 `~/.ssh/id_rsa`），选中 `id_rsa` 文件并点击“打开”。
    -   如果你的私钥在生成时设置了密码（passphrase），请务必在“私钥密码”字段中输入。如果没设置，这个字段留空即可。
    -   所有信息填写完毕后，点击连接弹窗右下角的“确定”按钮保存你的会话配置。
    -   至此，一个使用 SSH 密钥登录的 FinalShell 会话就配置成功了！你可以尝试双击这个会话进行连接。
    -   我踩过一个坑，有一次我发现连接一直提示认证失败，检查了服务器和密钥文件好几遍都没问题，结果最后才发现是 FinalShell 客户端里，“认证”类型我忘记从“密码”切换到“私钥”了。一个小细节，却卡了我好久，所以大家在设置的时候一定要细心核对每个选项。

如果你还想了解 FinalShell 其他强大的功能，比如它的 SFTP 文件传输，可以看看这篇 [FinalShell SFTP 文件传输指南](/blog/finalshell-sftp-file-transfer/)。关于 SSH 密钥更深入的配置和管理技巧，也可以参考我们的 [FinalShell SSH 密钥配置](/blog/finalshell-ssh-key-configuration/) 文章。

## 常见问题

1.  **问题：连接服务器时提示 "Authentication failed." 或者 "Permission denied."**
    -   **解决办法：** 这通常是密钥或文件权限配置不正确导致的。
        -   **检查服务器：** 确认服务器上的 `~/.ssh/authorized_keys` 文件中，你的公钥内容是否完整且正确复制，没有多余的空格或换行。同时，检查 `~/.ssh` 目录的权限是否为 `700` (`rwx------`)，以及 `~/.ssh/authorized_keys` 文件的权限是否为 `600` (`rw-------`)。权限不正确是导致连接失败的常见原因。
        -   **检查 FinalShell：** 确认 FinalShell 中私钥文件路径是否指向正确的 `id_rsa` 文件，并且私钥密码（如果设置了）输入是否正确。
2.  **问题：FinalShell 无法在文件选择器中看到 `~/.ssh/id_rsa` 文件。**
    -   **解决办法：** macOS 系统默认会将以 `.` 开头的文件和文件夹视为隐藏文件。在文件选择器中，你可以尝试按下 `Command + Shift + .` (句号) 快捷键，通常可以显示隐藏文件。如果不行，也可以直接在“私钥文件”输入框中手动输入完整的路径，例如 `/Users/你的用户名/.ssh/id_rsa`。
3.  **问题：密钥生成后，如何确认公钥已经上传到服务器并且生效了？**
    -   **解决办法：** 最直接的方法是尝试用 FinalShell 连接。如果连接失败，可以在服务器上查看 SSH 服务的日志文件，通常是 `/var/log/auth.log`（Debian/Ubuntu）或 `/var/log/secure`（CentOS/RHEL），查找 "Authentication refused" 或 "Permission denied" 相关的日志，可能会有更详细的错误提示。同时，确保服务器上的 SSH 服务（`sshd_config` 文件）允许密钥认证，通常是 `PubkeyAuthentication yes`。
## 延伸阅读

若需进一步查阅，可先看本站以下教程：

- [SSH 密钥轮换](/blog/finalshell-ssh-key-configuration/)
- [macOS 工作站配置](/blog/finalshell-macos-install-steps/)
- [Windows 生产部署](/blog/finalshell-windows-install-guide/)
