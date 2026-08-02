---
layout: article.njk
title: FinalShell 在 Windows 上用密钥登录和传文件，这个教程够新手用了！
description: FinalShell 在 Windows 上用密钥登录是不是总搞不定？文件传输又懵圈了？别急，这篇实操帖手把手教你如何配置SSH密钥，安全又高效地管理服务器文件，让你轻松告别密码登录的烦恼，快速上手SFTP，享受便捷的远程操作。
date: 2026-08-02
generated: true
category: 服务器管理
tags: ["Windows客户端","SFTP传输","密钥登录"]
heroImage: "/static/images/photo-1486406146926-c627a92ad1ab.jpg"
heroAlt: "FinalShell 在 Windows 上用密钥登录和传文件，这个教程够新手用了！ 配图"
---

在日常服务器管理中，通过SSH密钥登录比传统密码方式更安全高效。FinalShell 作为 Windows 用户常用的SSH客户端，它集成了终端、SFTP、进程管理等功能，深受大家喜爱。今天，我就来手把手教你如何在 FinalShell 4.6.8 版本中，从零配置SSH密钥登录，并高效使用SFTP传输文件。

如果你还没安装 FinalShell，可以参考这篇教程：[FinalShell Windows 安装指南](/blog/finalshell-windows-install-guide/)。

## 第一步：生成 SSH 密钥对

SSH 密钥对包含公钥（放在服务器）和私钥（保存在本地）。

1.  **打开密钥管理：**
    启动 FinalShell，点击顶部菜单栏“工具(T)” -> “SSH密钥(K)”，打开“SSH密钥管理”弹窗。
    ![配图说明](/static/images/photo-1486406146926-c627a92ad1ab.jpg)

2.  **生成并保存密钥：**
    在弹窗中点击“生成”按钮。
    -   **密钥类型：** 推荐“RSA”。
    -   **密钥长度：** 2048 或 4096 位，我一般选 2048 位。
    -   **密码：** 可选，为私钥设置密码，增加安全性。新手可留空。
    -   **名称：** 给密钥起个易识别的名字。
    点击“确定”生成后，点击“导出私钥”按钮，将私钥文件（如 `.ppk`）保存到本地安全目录，比如 `C:\Users\YourUser\.ssh\`。同时复制公钥内容（`ssh-rsa AAAA...` 开头）。私钥安全，切勿泄露！

## 第二步：配置服务器接受公钥

我们需要将公钥部署到远程服务器上。

1.  **登录服务器：**
    暂时用密码方式登录服务器。如需帮助，可查阅 [FinalShell 连接服务器基础教程](/blog/finalshell-windows-install-guide/)。

2.  **创建或编辑 `authorized_keys` 文件：**
    在服务器终端执行：
    ```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
    ```
    这些命令会创建 `.ssh` 目录及 `authorized_keys` 文件，并设置正确的权限，这是密钥登录生效的关键。

3.  **添加公钥：**
    -   将第一步中复制的公钥内容，通过 `vi` 或 `nano` 编辑器粘贴到服务器的 `~/.ssh/authorized_keys` 文件中。
    -   确保公钥内容完整，并另起一行粘贴。保存并退出。
    **提示：** 公钥配置完成后，可以考虑禁用服务器的密码登录，以提高安全性。

## 第三步：使用密钥登录服务器

公钥配置完毕后，就可以用私钥连接了。

1.  **新建或修改会话：**
    在 FinalShell 左侧会话树，右键点击“连接” -> “新建会话(S)” -> “SSH连接”，或右键现有连接选择“修改会话(M)”。

2.  **配置密钥认证：**
    在弹窗中填写服务器信息：
    -   **主机：** 服务器IP或域名。
    -   **端口：** 默认 22。
    -   **用户名：** 服务器登录用户名。
    -   **认证方式：** 选择“publickey”。
    -   **私钥文件：** 点击文件夹图标，选择本地保存的私钥文件。
    -   **私钥密码：** 如果私钥有密码则输入。

3.  **测试连接：**
    点击“确定”保存会话。双击连接尝试登录。如果成功，将无需输入密码。我测试时发现，首次连接可能需要你确认服务器指纹，点击“是”即可。

## 第四步：SFTP 文件传输实操

密钥登录后，FinalShell 的SFTP功能使用起来非常直观便捷。

1.  **打开 SFTP 界面：**
    成功登录 SSH 会话后，点击终端界面上方的“SFTP”标签页即可切换到文件传输界面。也可以在左侧会话树右键已连接会话，选择“打开 SFTP”。

2.  **文件浏览与操作：**
    SFTP 界面左右两栏分别是本地和远程文件系统。你可以像管理本地文件一样，浏览、创建、删除、重命名服务器上的文件和目录。

3.  **高效传输：**
    -   **下载：** 将右侧服务器文件拖拽到左侧本地目录，或右键选择“下载”。
    -   **上传：** 将左侧本地文件拖拽到右侧服务器目录，或右键选择“上传”。
    上传大文件时有进度显示，非常方便。我个人在上传部署包时，觉得比命令行 `scp` 效率高不少。
    此外，SFTP 界面还支持图形化修改文件权限。更多传输技巧，可参考：[FinalShell SFTP 文件传输技巧](/blog/finalshell-sftp-file-transfer/)。

## 常见问题

### 1. 私钥权限过宽 (Permissions too open)

**问题：** 使用密钥登录时，FinalShell 提示私钥文件权限过宽 (`Permissions for '...' are too open.`)。

**解决：**
Windows 上，右键私钥文件 -> “属性” -> “安全”选项卡。确保只有当前用户拥有“读取”或“完全控制”权限，移除其他用户和组。服务器上的 `~/.ssh` 目录权限需为 `700`，`authorized_keys` 文件权限需为 `600`。

### 2. SFTP 连接失败或无权限

**问题：** SSH 终端正常，但 SFTP 界面无法打开或显示“Permission denied”。

**解决：**
检查服务器防火墙是否阻止 SFTP 端口（通常与 SSH 端口 22 相同）。同时，确认当前登录的服务器用户对目标目录拥有足够的访问权限。如果权限不足，尝试用 `root` 用户登录、使用 `sudo` 提升权限，或调整目录权限。

### 3. 公钥未生效，仍需密码登录

**问题：** 公钥已配置，但 FinalShell 仍要求输入密码或连接失败。

**解决：**
仔细核对服务器端公钥配置：
-   `~/.ssh/authorized_keys` 文件中的公钥内容是否完整、正确，且是你的公钥。
-   `~/.ssh` 目录和 `authorized_keys` 文件的权限是否严格设置为 `700` 和 `600`。
-   修改 `/etc/ssh/sshd_config` 文件（确保 `PubkeyAuthentication yes` 且未被注释）后，是否重启了 SSH 服务（`sudo systemctl restart sshd`）。

通过以上步骤，你应已掌握 FinalShell 密钥登录和SFTP文件传输的技巧。告别繁琐密码，享受更安全便捷的服务器管理吧！
## 延伸阅读

若需进一步查阅，可先看本站以下教程：

- [SSH 密钥轮换](/blog/finalshell-ssh-key-configuration/)
- [SFTP 发布工作流](/blog/finalshell-sftp-file-transfer/)
- [Windows 生产部署](/blog/finalshell-windows-install-guide/)
