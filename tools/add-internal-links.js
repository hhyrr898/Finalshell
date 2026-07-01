#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.join(__dirname, "..", "src", "blog");
const DRY_RUN = process.argv.includes("--dry-run");

const PILLARS = [
  { path: "/blog/finalshell-windows-install-guide/", label: "Windows 生产部署", keywords: ["windows", "win10", "win11", "安装", "客户端", "验收"] },
  { path: "/blog/finalshell-macos-install-steps/", label: "macOS 工作站配置", keywords: ["macos", "mac", "苹果", "安装", "授权"] },
  { path: "/blog/finalshell-linux-ssh-setup/", label: "Linux 批量接入", keywords: ["linux", "ubuntu", "centos", "ssh", "连接", "模板"] },
  { path: "/blog/finalshell-ssh-key-configuration/", label: "SSH 密钥轮换", keywords: ["密钥", "key", "私钥", "公钥", "登录", "轮换"] },
  { path: "/blog/finalshell-sftp-file-transfer/", label: "SFTP 发布工作流", keywords: ["sftp", "传输", "上传", "下载", "文件", "发布"] },
  { path: "/blog/finalshell-port-forwarding-guide/", label: "隧道端口映射", keywords: ["端口", "转发", "隧道", "tunnel", "代理", "调试"] },
  { path: "/blog/finalshell-session-group-management/", label: "多环境会话树", keywords: ["会话", "分组", "标签", "多开", "环境"] },
  { path: "/blog/finalshell-server-monitoring-basics/", label: "负载异常判读", keywords: ["监控", "cpu", "内存", "磁盘", "top", "负载"] },
];

const DEFAULT_PILLARS = [PILLARS[0], PILLARS[3], PILLARS[4]];
const SECTION_HEADER = "## 延伸阅读";
const PILLAR_SKIP = new Set([
  "finalshell-windows-install-guide.md",
  "finalshell-macos-install-steps.md",
  "finalshell-linux-ssh-setup.md",
  "finalshell-ssh-key-configuration.md",
  "finalshell-sftp-file-transfer.md",
  "finalshell-port-forwarding-guide.md",
  "finalshell-session-group-management.md",
  "finalshell-server-monitoring-basics.md",
]);

function splitFrontMatter(raw) {
  if (!raw.startsWith("---")) return { fm: "", body: raw };
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return { fm: "", body: raw };
  return { fm: raw.slice(0, end + 4), body: raw.slice(end + 4).replace(/^\s+/, "") };
}

function parseTitle(fm) {
  const m = fm.match(/^title:\s*(.*)$/m);
  return m ? m[1].replace(/^["']|["']$/g, "") : "";
}

function parseDescription(fm) {
  const m = fm.match(/^description:\s*(.*)$/m);
  return m ? m[1].replace(/^["']|["']$/g, "") : "";
}

function scorePillars(text) {
  const lower = text.toLowerCase();
  return PILLARS.map((p) => {
    let score = 0;
    for (const kw of p.keywords) {
      const re = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
      if (re.test(lower)) score += 1;
    }
    return { pillar: p, score };
  }).sort((a, b) => b.score - a.score);
}

function pickPillars(title, description, body, fileName) {
  const haystack = `${title}\n${description}\n${body.slice(0, 2000)}`;
  const ranked = scorePillars(haystack).filter((x) => x.score > 0);
  const chosen = [];
  for (const { pillar } of ranked) {
    if (chosen.length >= 3) break;
    const slug = pillar.path.replace(/^\/blog\/|\//g, "");
    if (fileName.includes(slug)) continue;
    if (!chosen.some((c) => c.path === pillar.path)) chosen.push(pillar);
  }
  if (chosen.length < 2) {
    for (const p of DEFAULT_PILLARS) {
      if (chosen.length >= 3) break;
      if (!chosen.some((c) => c.path === p.path)) chosen.push(p);
    }
  }
  return chosen.slice(0, 3);
}

function buildSection(pillars) {
  const lines = pillars.map((p) => `- [${p.label}](${p.path})`);
  return `\n${SECTION_HEADER}\n\n若需进一步查阅，可先看本站以下教程：\n\n${lines.join("\n")}\n`;
}

function processFile(filePath) {
  const fileName = path.basename(filePath);
  if ([...PILLAR_SKIP].some((skip) => fileName === skip)) return { fileName, status: "skip-pillar" };
  const raw = fs.readFileSync(filePath, "utf-8");
  const { fm, body } = splitFrontMatter(raw);
  if (body.includes(SECTION_HEADER)) return { fileName, status: "skip-has-section" };
  const pillars = pickPillars(parseTitle(fm), parseDescription(fm), body, fileName);
  if (!pillars.length) return { fileName, status: "skip-no-pillars" };
  let newBody = body.trimEnd() + buildSection(pillars);
  const updated = `${fm}\n\n${newBody.replace(/^\n+/, "")}`;
  if (!DRY_RUN) fs.writeFileSync(filePath, updated.endsWith("\n") ? updated : `${updated}\n`, "utf-8");
  return { fileName, status: "updated" };
}

const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
const results = files.map((f) => processFile(path.join(POSTS_DIR, f)));
console.log(`更新 ${results.filter((r) => r.status === "updated").length} 篇, 跳过 ${results.filter((r) => r.status !== "updated").length} 篇`);
