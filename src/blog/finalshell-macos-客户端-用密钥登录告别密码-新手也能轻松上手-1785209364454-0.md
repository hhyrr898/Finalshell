---
layout: article.njk
title: FinalShell macOS 客户端：用密钥登录告别密码，新手也能轻松上手！
description: FinalShell macOS 客户端支持密钥登录，让连接服务器更安全便捷。这篇文章会教你如何在 FinalShell 4.6.9 版本中生成 SSH 密钥、上传公钥到服务器，并配置会话使用密钥登录，彻底告别每次手动输入密码的繁琐。
date: 2026-07-28
generated: true
category: 技术教程
tags: ["会话管理","密钥登录","macOS客户端"]
heroImage: "/static/images/photo-1486406146926-c627a92ad1ab.jpg"
heroAlt: "FinalShell macOS 客户端：用密钥登录告别密码，新手也能轻松上手！ 配图"
---

作为一名 macOS 用户，每次用 FinalShell 连接远程服务器，都要手动输入一长串密码，是不是觉得有点烦？特别是管理着好几台服务器，密码还不一样的时候，简直是效率杀手。其实，FinalShell 提供了更安全、更便捷的密钥登录方式，一次配置，终身受用！今天，我就以 FinalShell macOS 4.6.9 版本为例，手把手教你如何设置密钥登录，让你彻底告别密码输入的烦恼。

![配图说明](/static/images/photo-1486406146926-c627a92ad1ab.jpg)

## 为什么要用密钥登录？

密钥登录相比密码登录，优势显而易见：

*   **更安全**：SSH 密钥通常比密码更长、更复杂，难以被暴力破解。
*   **更便捷**：配置一次后，连接服务器无需再手动输入密码。
*   **自动化友好**：方便脚本和自动化工具进行无密码连接。

## 第一步：生成 SSH 密钥对

SSH 密钥对分为公钥和私钥。公钥放在服务器上，私钥保存在本地，两者配对才能成功连接。我们可以在 FinalShell 内部生成，也可以在 macOS 终端里生成。

**方式一：在 FinalShell 中生成**

1.  打开 FinalShell macOS 客户端。在主界面的左侧会话树中，右键点击一个空白区域，选择“导入/导出” -> “生成SSH密钥”。
2.  在弹出的“生成SSH密钥”窗口中，你可以选择密钥类型（通常使用 RSA 或 ECDSA），建议选择密钥长度为 2048 位或 4096 位。你可以给私钥设置一个密码（Passphrase），这个密码是保护你本地私钥的，每次使用私钥时需要输入。为了方便，也可以不设置密码，但安全性会略有降低。建议新手可以先不设置，熟悉流程后再考虑加强安全性。
3.  点击“生成”按钮。生成成功后，会在窗口下方显示公钥内容，并提示你私钥的保存路径。默认情况下，私钥会保存到 `~/.ssh` 目录下，例如 `id_rsa` 或 `id_rsa_finalshell`。记下这个私钥文件的路径，后续配置会用到。

**方式二：使用 macOS 终端生成**

如果你习惯用终端，也可以直接在终端里生成密钥对：

1.  打开“终端”应用。
2.  输入命令 `ssh-keygen -t rsa -b 4096 -C "your_email@example.com"`。 `-t rsa` 指定密钥类型为 RSA，`-b 4096` 指定密钥长度为 4096 位，`-C` 后面可以写一个注释，方便识别。
3.  命令执行后，会提示你选择密钥保存路径。默认是 `~/.ssh/id_rsa`。直接回车使用默认路径即可。然后会提示你输入私钥密码（passphrase），可以输入也可以直接回车留空。
4.  生成成功后，`~/.ssh` 目录下会有两个文件：`id_rsa`（私钥）和 `id_rsa.pub`（公钥）。

## 第二步：上传公钥到服务器

有了公钥文件，接下来就需要把它放到你想要连接的远程服务器上。

1.  **复制公钥内容**：打开你刚刚生成的公钥文件（例如 `id_rsa.pub`），用文本编辑器打开它，复制里面的所有内容。它通常以 `ssh-rsa AAAA...` 或 `ssh-ed25519 AAAA...` 开头。
2.  **连接服务器**：用 FinalShell 以密码方式连接到你的远程服务器。如果你还没装 FinalShell，可以参考这篇文章 [/blog/finalshell-windows-install-guide/](https://www.example.com/blog/finalshell-windows-install-guide/) 了解安装。
3.  **创建或编辑授权文件**：在服务器上，进入用户家目录 (`cd ~`)。然后创建 `.ssh` 目录（如果不存在）：`mkdir -p ~/.ssh`。设置 `.ssh` 目录的权限：`chmod 700 ~/.ssh`。
4.  **添加公钥**：将你复制的公钥内容添加到 `~/.ssh/authorized_keys` 文件中。如果文件不存在，就创建它。如果已存在，就追加到新的一行。最简单的办法是使用 `echo` 命令：
    ```bash
    echo "你的公钥内容" >> ~/.ssh/authorized_keys
    ```
    请确保把“你的公钥内容”替换成你复制的完整公钥字符串。我踩过一个坑，第一次操作时，直接用 SFTP 上传公钥，但没有设置好 `authorized_keys` 文件的权限，导致密钥认证一直失败。正确的做法是，上传后记得设置权限：`chmod 600 ~/.ssh/authorized_keys`。

## 第三步：在 FinalShell 中配置会话使用密钥登录

现在，公钥已经在服务器上安家了，我们只需要告诉 FinalShell 使用对应的私钥进行认证。

1.  **编辑会话**：在 FinalShell 左侧的会话树中，找到你要配置的服务器会话，右键点击它，选择“属性”。如果你还没有创建会话，可以点击“新建”来创建一个新会话。
2.  **选择认证方式**：在弹出的连接配置窗口中，你会看到左侧有一个选项列表，找到并点击“认证”。在右侧的“认证方式”下拉菜单中，选择“SSH密钥”。
3.  **指定私钥文件**：点击“私钥文件”旁边的文件夹图标，找到你之前在 macOS 本地保存的私钥文件（例如 `~/.ssh/id_rsa` 或 `~/.ssh/id_rsa_finalshell`），选中它并点击“打开”。
4.  **输入私钥密码（如果设置了）**：如果你在生成私钥时设置了密码（Passphrase），请在“密钥密码”字段中输入。如果没设置，留空即可。
5.  **保存并连接**：点击“保存”按钮，然后双击会话，尝试连接服务器。如果一切顺利，你会发现 FinalShell 已经直接连接上服务器，不再需要你输入密码了！

如果你需要管理多个服务器或者经常进行文件传输，FinalShell 的 SFTP 功能会非常有用，可以参考 [/blog/finalshell-sftp-file-transfer/](https://www.example.com/blog/finalshell-sftp-file-transfer/) 这篇教程。

## 常见问题

在配置密钥登录时，你可能会遇到一些问题，这里列举几个常见的和它们的解决办法：

### 1. 密钥认证失败，提示 `Permission denied (publickey)`

这通常是服务器上 `.ssh` 目录或 `authorized_keys` 文件的权限设置不正确导致的。

*   **解决办法**：使用密码登录服务器，检查并修正权限。
    ```bash
    chmod 700 ~/.ssh
    chmod 600 ~/.ssh/authorized_keys
    ```
    确保 `authorized_keys` 文件只对所有者可读写，其他用户没有任何权限。

### 2. FinalShell 提示 `Passphrase for key` 但我没设置密码

这可能是你配置的私钥文件损坏，或者你误以为没有设置密码，实际上却设置了。

*   **解决办法**：
    1.  确认私钥文件是否正确。可以尝试重新生成密钥对并重复上述步骤。
    2.  如果确定没有设置密码，但 FinalShell 依然提示，尝试用文本编辑器打开私钥文件，检查其内容是否正常，或者使用 `ssh-keygen -y -f ~/.ssh/your_private_key` 来验证私钥。

### 3. macOS 终端可以密钥登录，但 FinalShell 不行

这种情况可能是 FinalShell 的私钥路径配置不正确，或者是 FinalShell 客户端对私钥文件的权限敏感。

*   **解决办法**：
    1.  仔细检查 FinalShell 会话属性中，“认证”选项下的“私钥文件”路径是否完全正确，没有打错字或选错文件。
    2.  确保 FinalShell 使用的私钥文件权限是安全的，通常是 `chmod 600 your_private_key_file`。
    3.  如果私钥文件是在其他地方生成的，确保它的格式兼容 FinalShell，并且没有被其他程序修改。

### 4. 连接速度慢或者卡顿

虽然密钥登录与连接速度关系不大，但偶尔会有用户反馈 FinalShell 连接问题。

*   **解决办法**：
    1.  检查你的网络连接是否稳定。可以尝试 Ping 服务器 IP 地址看丢包率和延迟。
    2.  尝试调整 FinalShell 会话的高级设置，例如禁用一些不常用的功能，或者调整连接超时时间。
    3.  查看 FinalShell 的日志，看看是否有异常报错信息。关于端口转发之类的进阶功能，如果遇到问题，可以参考 [/blog/finalshell-port-forwarding-guide/](https://www.example.com/blog/finalshell-port-forwarding-guide/) 寻求帮助。

通过上面的步骤，相信你已经成功在 FinalShell macOS 客户端上设置好了密钥登录。享受无密码连接的便捷和安全吧！以后管理服务器，效率可就大大提升了。
## 延伸阅读

若需进一步查阅，可先看本站以下教程：

- [SSH 密钥轮换](/blog/finalshell-ssh-key-configuration/)
- [macOS 工作站配置](/blog/finalshell-macos-install-steps/)
- [Windows 生产部署](/blog/finalshell-windows-install-guide/)
