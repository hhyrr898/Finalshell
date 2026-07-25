---
layout: article.njk
title: FinalShell 在 macOS 上用密钥登录？手把手教你安全又便捷
description: 在 macOS 上使用 FinalShell 密钥登录服务器，总觉得有点复杂？这篇教程手把手教你生成密钥对、将公钥部署到服务器，并正确配置 FinalShell v4.7.1 客户端，让你安全又便捷地管理服务器会话，告别每次输入密码的烦恼。
date: 2026-07-25
generated: true
category: 服务器管理
tags: ["会话管理","密钥登录","macOS客户端"]
heroImage: "/static/images/photo-1486406146926-c627a92ad1ab.jpg"
heroAlt: "FinalShell 在 macOS 上用密钥登录？手把手教你安全又便捷 配图"
---

嗨，macOS 用户们，FinalShell 是个挺不错的 SSH 工具，但每次连接服务器都要输密码是不是有点烦？而且密码登录安全性也确实不如密钥。今天咱们就来聊聊，怎么在 macOS 上优雅地用 FinalShell 配置密钥登录，一次设置，终身受益！

最近 FinalShell 更新到了 `v4.7.1`，界面和功能都越来越完善。我发现很多 Mac 用户在配置密钥登录时会遇到一些小麻烦，尤其是对命令行操作不熟悉的朋友。别担心，我来教你一步步搞定。

## 一、生成你的专属 SSH 密钥对

密钥登录的第一步，当然是先在你的 macOS 本地生成一对 SSH 密钥。这就像给你服务器的“门”配一把特殊的“钥匙”（私钥）和一个“锁眼”（公钥）。

1.  **打开终端应用：** 在 macOS 上，按下 `Command + Space` 搜索“终端”并打开。

2.  **输入生成命令：** 在终端中输入以下命令并回车：
    ```bash
    ssh-keygen -t rsa -b 4096 -C "你的邮箱或其他标识"
    ```
    *   `-t rsa`：指定密钥类型为 RSA。
    *   `-b 4096`：设置密钥长度为 4096 位，更安全。
    *   `-C "你的邮箱或其他标识"`：为密钥添加注释，方便你识别。

3.  **按提示操作：**
    *   系统会询问你密钥保存路径 (`Enter file in which to save the key (/Users/你的用户名/.ssh/id_rsa):`)。如果你没有特殊需求，直接按回车使用默认路径即可。这样会生成 `id_rsa` (私钥) 和 `id_rsa.pub` (公钥) 两个文件在 `~/.ssh/` 目录下。
    *   接着会让你输入一个密码（`Enter passphrase (empty for no passphrase):`）。这个密码是用来保护你的私钥的，强烈建议设置一个！每次使用私钥登录时都需要输入这个密码，但 FinalShell 可以帮你记住。如果你不想每次都输，也可以留空，但安全性会降低。

至此，你的密钥对就已经生成好了。私钥 `id_rsa` 留在本地，绝对不能泄露；公钥 `id_rsa.pub` 则需要上传到服务器上。

## 二、将公钥部署到远程服务器

有了公钥，下一步就是把它放到你要连接的服务器上。服务器通过这个公钥来识别你的私钥，允许你登录。

1.  **复制公钥内容：** 在终端中，使用 `cat` 命令查看你的公钥内容，并复制到剪贴板：
    ```bash
    cat ~/.ssh/id_rsa.pub
    ```
    把显示出来的以 `ssh-rsa` 开头的一长串内容全部复制下来。

2.  **登录服务器创建文件：** 使用你目前的密码登录方式或者其他方式（例如网页控制台）先登录到目标服务器。
    *   如果服务器上还没有 `.ssh` 目录，需要先创建：
        ```bash
        mkdir -p ~/.ssh
        chmod 700 ~/.ssh
        ```
    *   然后创建一个 `authorized_keys` 文件（如果已存在则追加）：
        ```bash
        touch ~/.ssh/authorized_keys
        chmod 600 ~/.ssh/authorized_keys
        ```
        我踩过一个坑，就是 `~/.ssh` 目录和 `~/.ssh/authorized_keys` 文件的权限设置不对，导致密钥登录一直失败，系统会提示权限过于开放。一定要记得 `chmod 700 ~/.ssh` 和 `chmod 600 ~/.ssh/authorized_keys`！

3.  **将公钥粘贴到 `authorized_keys` 文件：**
    ```bash
    echo "刚刚复制的公钥内容" >> ~/.ssh/authorized_keys
    ```
    请将 `"刚刚复制的公钥内容"` 替换为你之前复制的 `id_rsa.pub` 内容。注意是双 `>>`，表示追加，以免覆盖原有内容。

现在，服务器已经有了你的“锁眼”，可以识别你的“钥匙”了。

## 三、配置 FinalShell 使用密钥登录

重头戏来了！在 macOS 上的 FinalShell 客户端中配置使用我们刚刚生成的密钥。

1.  **打开 FinalShell 并创建新连接：** 启动 FinalShell，在左侧会话树上右键点击“新增会话”->“SSH会话”，或者点击上方工具栏的“文件”->“新增会话”->“SSH会话”。

2.  **填写连接信息：**
    *   **名称：** 给你的连接起个好听的名字，比如“我的云服务器-密钥”。
    *   **主机：** 填写你的服务器 IP 地址或域名。
    *   **端口：** 默认是 22，如果你的服务器修改过 SSH 端口，请填写对应端口。
    *   **用户：** 填写你在服务器上的用户名，通常是 `root` 或你创建的其他用户。

3.  **配置身份验证：**
    *   在连接弹窗中，找到“身份验证”区域。
    *   将“方式”下拉菜单从“密码”切换到“RSA/DSA（SSH密钥）”。
    *   点击“私钥文件”右侧的文件夹图标，在弹出的文件选择器中，导航到你之前生成私钥的路径（默认在 `~/.ssh/` 下），选择 `id_rsa` 文件。
    *   如果你的私钥设置了密码，在“私钥密码”字段中输入。FinalShell 会提示你是否保存密码，建议保存，这样下次连接就不用再次输入了。

4.  **保存并连接：**
    *   确认所有信息无误后，点击右下角“确定”按钮保存会话。
    *   在左侧会话树中双击你新建的会话，FinalShell 就会尝试使用私钥进行连接了。
    *   如果一切顺利，你应该就能成功进入服务器的命令行界面了！

恭喜你，现在你可以通过 FinalShell 在 macOS 上，使用更安全的密钥方式登录服务器了！你还可以利用 FinalShell 的文件传输功能 ![配图说明](/static/images/photo-1486406146926-c627a92ad1ab.jpg) 轻松管理服务器文件，参考 `/blog/finalshell-sftp-file-transfer/`，或者设置更高级的端口转发功能 `/blog/finalshell-port-forwarding-guide/` 来做更多事情。

## 常见问题

即使按照步骤操作，也可能会遇到一些小麻烦。这里列出几个常见问题及其解决办法。

1.  **问题：FinalShell 连接时提示“认证失败”或“Permission denied (publickey).”**
    *   **原因分析：** 最常见的是服务器上的公钥文件 `~/.ssh/authorized_keys` 权限不对，或者公钥内容有误。也可能是私钥密码输入错误。
    *   **解决办法：**
        *   登录服务器，检查 `~/.ssh` 目录权限是否为 `700` (`drwx------`)，`~/.ssh/authorized_keys` 文件权限是否为 `600` (`-rw-------`)。如果不正确，使用 `chmod 700 ~/.ssh` 和 `chmod 600 ~/.ssh/authorized_keys` 进行修正。
        *   再次 `cat ~/.ssh/id_rsa.pub` 检查本地公钥内容，然后 `cat ~/.ssh/authorized_keys` 检查服务器上的公钥内容是否完全一致，是否有额外的空格或换行。
        *   确认在 FinalShell 中输入的私钥密码是否正确。

2.  **问题：FinalShell 提示“连接超时”或“Connection refused”。**
    *   **原因分析：** 这通常不是密钥配置的问题，而是服务器 SSH 服务没有运行、防火墙阻挡了连接、或者 IP 地址/端口输入错误。
    *   **解决办法：**
        *   首先检查服务器的 IP 地址和端口号是否正确。
        *   确认服务器 SSH 服务是否正常运行（例如，对于 Ubuntu/Debian 系统，`sudo systemctl status ssh`）。
        *   检查服务器防火墙（如 `ufw` 或云服务商的安全组）是否允许你的 IP 地址访问 SSH 端口（默认 22）。

3.  **问题：FinalShell 私钥文件选择器中找不到我生成的 `id_rsa` 文件。**
    *   **原因分析：** macOS 默认隐藏了 `~/.ssh` 这样的点开头文件，在文件选择器中可能不容易找到。
    *   **解决办法：**
        *   在 FinalShell 的文件选择器中，当你打开“选择私钥文件”的窗口时，可以尝试按下 `Command + Shift + .` (句号键)，这会显示隐藏文件和文件夹。然后你就能看到 `.ssh` 文件夹了。
        *   或者，你可以在路径栏中手动输入 `~/.ssh/id_rsa` 来选择。

4.  **问题：我想在 Windows 上也使用这个密钥怎么办？**
    *   **原因分析：** 你可能需要在不同操作系统之间迁移你的私钥文件。
    *   **解决办法：** 将你的 `id_rsa` 私钥文件（切记！是私钥，不是公钥）通过安全的方式（如 U盘加密传输、SFTP）复制到你的 Windows 电脑上，然后在 Windows 版 FinalShell 中同样选择这个私钥文件进行配置。如果你是 FinalShell 的老用户，可以参考 `/blog/finalshell-windows-install-guide/` 这篇文章，里面有 Windows 客户端安装和基础使用的介绍。
## 延伸阅读

若需进一步查阅，可先看本站以下教程：

- [SSH 密钥轮换](/blog/finalshell-ssh-key-configuration/)
- [macOS 工作站配置](/blog/finalshell-macos-install-steps/)
- [Linux 批量接入](/blog/finalshell-linux-ssh-setup/)
