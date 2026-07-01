#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG = path.join(__dirname, "..", "src", "blog");

/** finalshell-ssh.com pillar：运维实战 / 工作流角度，与 cn 站下载排查向区分 */
const RETITLES = {
  "finalshell-windows-install-guide.md": {
    title: "生产环境 Windows 客户端部署与 SSH 连通验收",
    description: "面向运维团队的 Windows 端 FinalShell 部署检查、会话创建与首次 SSH 连通验收流程。",
  },
  "finalshell-macos-install-steps.md": {
    title: "macOS 运维终端授权与 FinalShell 工作站配置",
    description: "macOS 下安装 FinalShell、辅助功能权限与终端会话工作站的标准化配置。",
  },
  "finalshell-linux-ssh-setup.md": {
    title: "Linux 主机批量接入与会话模板规范",
    description: "多台 Linux 主机接入时的会话模板、命名规范与连接参数统一做法。",
  },
  "finalshell-ssh-key-configuration.md": {
    title: "生产环境 SSH 密钥轮换与 FinalShell 私钥托管",
    description: "密钥生成、服务器 authorized_keys 部署及 FinalShell 私钥引用与轮换建议。",
  },
  "finalshell-sftp-file-transfer.md": {
    title: "运维 SFTP 工作流：发布包传输与目录权限",
    description: "上线发布场景的 SFTP 目录操作、权限 chmod 与大文件传输注意点。",
  },
  "finalshell-port-forwarding-guide.md": {
    title: "本地调试远程服务：隧道与端口映射实战",
    description: "本地转发映射内网数据库或 API，配合 FinalShell 隧道做开发联调。",
  },
  "finalshell-session-group-management.md": {
    title: "多环境会话树：测试/预发/生产分组策略",
    description: "按环境与项目线组织 SSH 会话树，减少误连生产主机风险。",
  },
  "finalshell-server-monitoring-basics.md": {
    title: "线上负载异常判读：FinalShell 实时监控面板",
    description: "结合 CPU、内存与网络曲线判断服务器负载突增与常见误报。",
  },
  "finalshell-multi-tab-workflow.md": {
    title: "多标签并行运维：日志、部署与数据库同屏操作",
    description: "同一窗口多标签并行 tail、git pull 与数据库客户端操作的工作流。",
  },
  "finalshell-command-history-tips.md": {
    title: "高频命令复用：历史检索与快捷输入",
    description: "命令历史搜索、片段复用与减少重复输入的运维习惯。",
  },
  "finalshell-theme-customization.md": {
    title: "值班可读性：终端主题与配色长时间优化",
    description: "深色或浅色主题与高对比配色，降低长时间值班的眼部疲劳。",
  },
  "finalshell-encoding-charset-fix.md": {
    title: "跨系统编码对齐：CentOS/Ubuntu 中文终端",
    description: "不同发行版 locale 与 FinalShell 终端编码的协同设置方法。",
  },
  "finalshell-backup-session-config.md": {
    title: "团队会话资产导出与交接前连接清单",
    description: "导出会话配置、整理密钥清单，用于团队交接与灾备恢复。",
  },
  "finalshell-vps-initial-setup.md": {
    title: "新购 VPS 上线：SSH 加固与首批会话建立",
    description: "新机 sshd 加固、防火墙放行与 FinalShell 首批生产会话创建清单。",
  },
  "finalshell-jump-server-connection.md": {
    title: "堡垒机链路：二级跳转与内网主机访问",
    description: "跳板机与 ProxyJump 思路在 FinalShell 中的多级 SSH 会话链配置。",
  },
  "finalshell-docker-container-access.md": {
    title: "Docker 宿主机运维：容器日志与 exec 排查",
    description: "连接 Docker 宿主机、查看容器日志与 docker exec 进入容器排错。",
  },
  "finalshell-remote-debugging-php.md": {
    title: "PHP 线上排错：远程 tail 与 FPM 状态查看",
    description: "远程 tail PHP/Nginx 错误日志、查看 php-fpm 进程状态的常用命令。",
  },
  "finalshell-nginx-log-analysis.md": {
    title: "Nginx 5xx 与慢请求：日志 awk/grep 快速定位",
    description: "access/error 日志字段解读与 awk 统计慢 URL、5xx 比例。",
  },
  "finalshell-mysql-remote-maintenance.md": {
    title: "远程 MySQL：慢查询导出与变更操作规范",
    description: "慢查询日志、mysqldump 与线上 DDL 变更的终端操作规范。",
  },
  "finalshell-git-deploy-workflow.md": {
    title: "Git 拉码发布：FinalShell 终端部署流水线",
    description: "测试与生产环境 git pull、依赖安装与服务 reload 的标准步骤。",
  },
  "finalshell-android-ssh-client.md": {
    title: "移动端应急运维：外网 SSH 与现场重启",
    description: "手机端紧急登录、重启服务与临时查看日志的应急场景。",
  },
  "finalshell-team-server-handover.md": {
    title: "运维交接 SOP：会话、密钥与文档同步",
    description: "离职或轮岗时 FinalShell 会话、密钥与 runbook 的交接步骤。",
  },
};

function patchFrontMatter(raw, meta) {
  let out = raw;
  out = out.replace(/^title:.*$/m, `title: ${meta.title}`);
  out = out.replace(/^description:.*$/m, `description: ${meta.description}`);
  if (/^heroAlt:/m.test(out)) {
    out = out.replace(/^heroAlt:.*$/m, `heroAlt: "${meta.title} 配图"`);
  }
  if (/^videoTitle:/m.test(out)) {
    out = out.replace(/^videoTitle:.*$/m, `videoTitle: "${meta.title}"`);
  }
  if (/^videoDescription:/m.test(out)) {
    out = out.replace(
      /^videoDescription:.*$/m,
      `videoDescription: "本教程展示 ${meta.title} 的实操流程。"`
    );
  }
  return out;
}

let updated = 0;
for (const [file, meta] of Object.entries(RETITLES)) {
  const fp = path.join(BLOG, file);
  if (!fs.existsSync(fp)) {
    console.warn("skip missing", file);
    continue;
  }
  const raw = fs.readFileSync(fp, "utf-8");
  const next = patchFrontMatter(raw, meta);
  if (next !== raw) {
    fs.writeFileSync(fp, next, "utf-8");
    updated++;
    console.log("✓", file, "→", meta.title);
  }
}
console.log(`Updated ${updated} pillar titles`);
