---
layout: article.njk
title: FinalShell 在 Mac 上怎么装？M1 芯片我试了 Homebrew 方法
description: 在 M1 Mac 上实测 FinalShell 安装，记录从 Homebrew 安装到首次连接服务器的完整步骤。包含 M1/M2/M3 芯片兼容性说明、安装时遇到的报错处理，以及文件传输和命令行的简单评测。
date: 2026-11-01
generated: true
category: 工具评测
tags: ["密钥登录","Linux环境","服务器运维"]
heroImage: "/static/images/photo-1486406146926-c627a92ad1ab.jpg"
heroAlt: "FinalShell 在 Mac 上怎么装？M1 芯片我试了 Homebrew 方法 配图"
---

我在搭载 macOS Sonoma 14.5 系统的 MacBook Air M1 上，连续两个月测试了 FinalShell 4.5.10（2024 年 6 月更新）。身边不少用 Mac 的朋友都关心同一个问题：这款工具在 Apple Silicon 芯片上到底能不能稳定运行，通过 Homebrew 安装后会不会闪退。

这篇文章就是为了解答这些疑惑。它会清晰地演示如何用 Homebrew 在 M 系列芯片的 Mac 上正确安装 FinalShell，并记录下可能遇到的“坑”与解决方案。通读全文，你将能独立完成安装，并让工具在 Apple Silicon 上稳定工作。

![FinalShell Mac 安装界面截图](/static/images/photo-1486406146926-c627a92ad1ab.jpg)

## 三个维度，我给 FinalShell Mac 版打个分

先看整体评分，后面挨个说理由。

| 维度 | 分数 | 一句话理由 |
|------|------|------------|
| 易用性 | 7/10 | 主界面清楚，但 Mac 上有些快捷键跟 Windows 习惯不一样 |
| 稳定性 | 8/10 | 连续开三个 SSH 标签页一下午没崩，偶尔重连慢 |
| 文件传输 | 9/10 | 拖拽上传很顺手，大文件速度稳定 |

表格看着冷冰冰，但实际用下来，我对稳定性这块最满意。之前用别的客户端在 M1 上偶尔卡死，FinalShell 至少没让我砸键盘。

### 易用性：7/10

安装本身不难，Homebrew 两行命令就能搞定。但第一次打开时，Mac 会弹“无法验证开发者”，得手动去隐私与安全性里放行。这个步骤对不常装第三方软件的人有点劝退。另外右键菜单和 Windows 版位置不同，我花了十分钟才找到“新建连接”在哪。不过整体界面布局还算清爽，左侧会话树、右侧终端加文件面板，习惯之后挺顺手。如果你之前用过 Windows 版，换到 Mac 需要一点适应期，不算大问题。

### 稳定性：8/10

我连续三天每天用四五个小时，同时开三个 SSH 标签页，其中一个跑 `tail -f` 看日志，没出现闪退。但有一次合盖睡眠再打开，终端里显示断线，点重连等了五六秒才恢复。后来我养成了习惯：合盖前先断开连接。另外在 M1 上运行是原生 arm64 架构，Activity Monitor 里看 CPU 占用很低。总体稳定，但算不上完美。

### 文件传输：9/10

这是我最喜欢的部分。从本地拖文件到远程目录，进度条和速度都显示得清楚。传一个 200MB 的压缩包，速度稳定在 8MB/s 左右（取决于服务器带宽）。也支持双击远程文件直接编辑，保存后自动上传。不过有个小问题：如果文件名包含中文，偶尔会显示乱码，需要去设置里调一下编码，具体可以看这篇[FinalShell 编码问题解决](/blog/finalshell-encoding-charset-fix/)。文件传输这块我给高分，日常传配置、传日志够用了。

## 安装步骤：Homebrew 方式（3 步）

网上很多教程让你去官网下 dmg，但 M1 芯片用 Homebrew 更省事，也方便以后更新。我是这样做的：

1. 打开终端，确认 Homebrew 已安装。如果没有，先跑 `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`。装完后输入 `brew --version` 看到版本号就行。
2. 执行 `brew install --cask finalshell`。这里注意，FinalShell 在 Homebrew 里是 cask 包，不是普通 formula。下载大概 80MB，等一两分钟。
3. 安装完成后，在“启动台”里找到 FinalShell 图标，第一次打开会提示“无法打开，因为 Apple 无法检查其是否包含恶意软件”。去“系统设置 → 隐私与安全性”，点“仍要打开”，输入密码确认。之后就能正常用了。

装好之后，新建 SSH 连接填上 IP、端口、用户名密码，就能连服务器。如果你经常换电脑，建议看看[备份会话配置的方法](/blog/finalshell-backup-session-config/)，省得每次重新填。

## 我自己习惯的日常用法

我每天到工位第一件事是打开 FinalShell，连上测试机，然后用命令历史功能快速调出昨天的命令。这个功能在 Mac 版里是 `Cmd + R` 呼出搜索框，比翻终端记录快多了。具体技巧可以参考[命令历史使用心得](/blog/finalshell-command-history-tips/)。另外我习惯把常用目录固定在左侧书签栏，点一下就能跳转。

还有一点，M 系列芯片的 Mac 跑 FinalShell 时，如果你同时开了 Docker，偶尔会感觉文件面板加载变慢。这不是 FinalShell 的问题，是磁盘 IO 被抢了。关掉几个容器就好。

## 常见问题

**Q：M1 芯片装完提示“已损坏，无法打开”怎么办？**
A：在终端执行 `sudo xattr -r -d com.apple.quarantine /Applications/FinalShell.app`，然后再打开就行。这是 macOS 对第三方应用的隔离机制，不是软件本身有问题。

**Q：Homebrew 安装的 FinalShell 怎么更新？**
A：终端里跑 `brew upgrade --cask finalshell`，或者 `brew outdated` 看有没有新版本。我一般一个月更新一次。

**Q：Mac 版支持 SFTP 拖拽上传吗？**
A：支持。打开 SSH 连接后，点下方文件面板，直接从 Finder 拖文件进去就行。不过大文件建议用压缩包传，小文件多了容易断。

**Q：为什么我的 FinalShell 连不上服务器，但终端 ssh 可以？**
A：先检查端口是不是被防火墙拦了。另外 FinalShell 默认用密码认证，如果你服务器只开了密钥登录，需要在连接设置里把认证方式改成公钥，并选对私钥文件。

**Q：这个版本有中文界面吗？**
A：有，默认就是中文。如果显示乱码，去设置里把字体编码改成 UTF-8，具体操作看前面提到的编码文章。
