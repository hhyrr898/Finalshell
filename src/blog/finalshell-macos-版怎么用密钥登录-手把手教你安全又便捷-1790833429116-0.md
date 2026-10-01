---
layout: article.njk
title: FinalShell macOS 版怎么用密钥登录？手把手教你安全又便捷！
description: 本文教你如何在 FinalShell macOS 客户端上配置 SSH 密钥登录。从生成密钥对、上传公钥到服务器，再到 FinalShell 的具体设置步骤，手把手带你实现无需密码的安全连接。同时解决常见的连接失败和客户端卡顿问题，让你的服
date: 2026-10-01
generated: true
category: 工具技巧
tags: ["会话管理","密钥登录","macOS客户端"]
heroImage: "/static/images/photo-1486406146926-c627a92ad1ab.jpg"
heroAlt: "FinalShell macOS 版怎么用密钥登录？手把手教你安全又便捷！ 配图"
---

在 macOS 上管理服务器，很多朋友习惯用 FinalShell，因为它功能强大，会话管理和文件传输都很方便。但如果你还在手动输入密码登录，那效率和安全性都差了点。今天就来聊聊 FinalShell macOS 客户端怎么用 SSH 密钥登录，既安全又快捷，尤其是对频繁操作多台服务器的朋友来说，简直是福音。我最近在使用 FinalShell macOS 版 4.5.10 的时候，就亲自配置了一遍，下面就把我的经验分享给大家。

## 准备工作：生成 SSH 密钥对

如果你已经有了 SSH 密钥对，可以直接跳到下一步。如果没有，我们首先需要在 macOS 终端里生成一对。

### 1. 打开终端并生成密钥

打开 macOS 上的“终端”应用（可以通过 Spotlight 搜索）。输入以下命令来生成 RSA 密钥对：

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

这条命令会提示你保存密钥的路径，默认是 `~/.ssh/id_rsa`。你可以直接回车使用默认路径。接下来会让你输入一个密码（passphrase），这个密码是用来保护你的私钥的，强烈建议设置一个，提高安全性。如果不想设置，直接回车两次即可。

生成成功后，你会在 `~/.ssh/` 目录下看到两个文件：`id_rsa`（私钥）和 `id_rsa.pub`（公钥）。

### 2. 将公钥上传到服务器

生成的 `id_rsa.pub` 文件就是你的公钥。你需要将它内容添加到服务器上目标用户的 `~/.ssh/authorized_keys` 文件中。

最简单的办法是使用 `ssh-copy-id` 命令（如果你的服务器支持）：

```bash
cats ~/.ssh/id_rsa.pub | ssh user@your_server_ip "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

或者手动复制公钥内容：

```bash
cat ~/.ssh/id_rsa.pub
```

复制输出的全部内容。然后通过密码登录服务器，编辑服务器上的 `~/.ssh/authorized_keys` 文件，将公钥内容粘贴进去。如果 `~/.ssh` 目录或 `authorized_keys` 文件不存在，你需要手动创建它们，并确保权限设置正确（`chmod 700 ~/.ssh` 和 `chmod 600 ~/.ssh/authorized_keys`）。

关于 SSH 密钥的更多细节，你可以参考这篇 [FinalShell SSH 密钥配置指南](/blog/finalshell-ssh-key-configuration/)。

## FinalShell 配置：用密钥连接服务器

有了服务器上的公钥和本地的私钥，我们就可以开始在 FinalShell 中配置了。

### 1. 新建会话

打开 FinalShell 应用。在左侧的会话树区域，点击工具栏上的“文件夹”图标，选择“新建 SSH 会话”。会弹出一个连接设置窗口。

在弹出的“新建 SSH 会话”窗口中，你首先需要填写服务器的基本信息：

*   **名称:** 给这个连接起一个好记的名字（比如“我的生产服务器”）。
*   **主机:** 你的服务器 IP 地址或域名。
*   **端口:** SSH 端口，默认为 22。
*   **用户名:** 你在服务器上的用户名。

### 2. 配置密钥文件

在同一个“新建 SSH 会话”窗口中，找到“高级”选项卡（通常在底部或者右侧）。切换到“认证”或“密钥登录”相关的选项卡。

在这里，你会看到一个“私钥文件”的选项。点击旁边的“浏览”按钮，导航到你本地的 `~/.ssh/` 目录，选择之前生成的 `id_rsa` 私钥文件。

如果你在生成私钥时设置了密码，那么还需要在“私钥密码”字段中填入对应的密码（passphrase）。如果没设置，留空即可。

这里我曾经踩过一个坑，就是私钥文件选错了，或者密钥密码输错了。FinalShell 不会直接告诉你密码不对，只会说连接失败。所以一定要仔细核对私钥和对应的密码。

配置好后，点击“确定”保存会话。

### 3. 连接测试

回到 FinalShell 主界面，在左侧的会话树中找到你刚刚创建的会话。双击它，FinalShell 就会尝试使用你配置的密钥进行连接。如果一切顺利，你就能看到熟悉的服务器终端界面了！

如果你在传输文件方面有需求，可以看看这篇 [FinalShell SFTP 文件传输教程](/blog/finalshell-sftp-file-transfer/)。

## 常见问题

### 1. 连接时提示 `Permission denied (publickey).`

*   **原因:** 这通常意味着服务器拒绝了你的密钥登录请求。
*   **解决办法:**
    1.  **检查服务器 `authorized_keys`:** 确保你的公钥内容已正确添加到服务器上目标用户的 `~/.ssh/authorized_keys` 文件中，并且没有多余的空格或换行符。
    2.  **检查文件权限:** 服务器上的 `~/.ssh` 目录权限应该是 `700`，`~/.ssh/authorized_keys` 文件权限应该是 `600`。
    3.  **检查私钥文件:** 确保你在 FinalShell 中选择了正确的本地私钥文件 (`id_rsa`)，并且私钥密码（如果有）输入正确。

### 2. FinalShell macOS 客户端界面卡顿或显示异常

*   **原因:** FinalShell 是基于 Java 开发的，有时在 macOS 上可能与特定的 Java Runtime Environment (JRE) 版本不兼容，或者 JRE 配置有问题。
*   **解决办法:**
    1.  **更新 FinalShell:** 确保你使用的是最新版本的 FinalShell。开发者通常会修复兼容性问题。
    2.  **检查 JRE 环境:** 你可以尝试安装或切换到其他版本的 JRE。有时，FinalShell 内置的 JRE 可能不是最优的。
    3.  **调整显示设置:** 在 FinalShell 的“设置”中，尝试调整一些界面相关的选项，例如字体或主题。

![配图说明：FinalShell macOS 界面截图，展示会话列表和新建会话弹窗](/static/images/mac_finalshell_connect_screenshot.jpg)

FinalShell 不仅提供了强大的 SSH 连接能力，其内网穿透和端口转发功能也极为实用。如果你对端口转发感兴趣，不妨看看这篇 [FinalShell 端口转发实用指南](/blog/finalshell-port-forwarding-guide/)。希望这篇教程能帮助你在 macOS 上更高效、安全地使用 FinalShell。
## 延伸阅读

若需进一步查阅，可先看本站以下教程：

- [SSH 密钥轮换](/blog/finalshell-ssh-key-configuration/)
- [SFTP 发布工作流](/blog/finalshell-sftp-file-transfer/)
- [macOS 工作站配置](/blog/finalshell-macos-install-steps/)
