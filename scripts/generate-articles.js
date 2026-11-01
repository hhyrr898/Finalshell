import { GoogleGenAI } from "@google/genai";
import fs from "node:fs/promises";
import path from "node:path";
import { countChineseChars, getCharLimits, shortenBodyIfNeeded } from "./article-validation.js";

const root = process.cwd();
const blogDir = path.join(root, "src", "blog");
const outputFile = path.join(root, ".generated-urls.json");
const MAX_ATTEMPTS = 5;

const bannedPatterns = [
  /seo/gi,
  /关键词/g,
  /优化/g,
  /排名/g,
  /收录/g,
  /曝光/g,
  /综上所述/g,
  /毋庸置疑/g,
  /在当今数字化时代/g,
  /业界领先/g,
  /全方位/g,
  /深度融合/g,
  /极致/g,
  /深入探讨/g,
  /详细介绍/g,
  /全面解析/g,
  /助力您/g,
  /显著提升/g,
  /至关重要/g,
  /完美支持/g,
  /强大功能/g,
  /原生体验/g
];

const bannedTitlePatterns = [
  /白皮书/,
  /完整指南/,
  /全面指南/,
  /深度解析/,
  /技术详解/,
  /实用指南$/,
  /高效.*指南/
];

const tagPool = [
  "Windows客户端",
  "macOS客户端",
  "Linux环境",
  "SSH连接",
  "会话管理",
  "SFTP传输",
  "服务器运维",
  "开发调试",
  "端口转发",
  "密钥登录",
  "Docker",
  "移动端"
];

const articleStyles = [
  {
    id: "tutorial",
    name: "教程型",
    length: "750-2200字",
    structure: [
      "开头用一两句话交代场景，别写空话套话。",
      "正文用 h2/h3 分节，至少写 3 个带序号的具体操作步骤（如「第一步」「第二步」或 1. 2. 3.）。",
      "至少一处描述截图画面（如「左侧会话树」「连接弹窗右下角」），不必真截图。",
      "单独一节「## 常见问题」，列 2-4 个真实会遇到的问题和解决办法。"
    ]
  },
  {
    id: "review",
    name: "评测型",
    length: "750-2200字",
    structure: [
      "开头说明你在什么环境下测的（系统版本、FinalShell 版本）。",
      "选 3 个维度打分（如易用性、稳定性、文件传输），每个维度用 h3，写分数（如 8/10）和两三句理由，语气像博客评测不像产品稿。",
      "用 markdown 表格或清晰列表呈现打分，表格前后要有个人感受。",
      "结尾单独一节「## 常见问题」。"
    ]
  },
  {
    id: "faq",
    name: "问答型",
    length: "750-2200字",
    structure: [
      "开头 2-3 句说明这篇文章解决什么问题。",
      "正文写 5 个 FAQ，每个用 h3 做问句标题，答案要具体、能照着做。",
      "5 个问题里至少 2 个涉及操作步骤。",
      "最后加一节「## 常见问题」补充 1-2 个边角问题（可以和上文不重复）。"
    ]
  },
  {
    id: "brief",
    name: "快讯型",
    length: "350-900字",
    structure: [
      "短平快，像博客快讯，不要铺垫太长。",
      "必须写清楚一个具体版本号或日期（如 FinalShell 4.5.12 或 2026-06-20）。",
      "至少 3 步操作，步骤要短。",
      "文末一小节「## 常见问题」，1-2 条即可。"
    ]
  }
];

const firstPersonHints = [
  "我测试时发现",
  "上周升级后",
  "昨天重装系统",
  "我自己习惯",
  "我踩过一个坑",
  "我一般会先"
];

function getCount() {
  const arg = process.argv.find((item) => item.startsWith("--count="));
  const raw = arg ? arg.split("=")[1] : process.env.GENERATE_COUNT || "1";
  const count = Number.parseInt(raw, 10);
  if (!Number.isInteger(count) || count < 1 || count > 9) {
    throw new Error("Count must be between 1 and 9.");
  }
  return count;
}

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/finalshell/g, "finalshell")
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

function cleanText(input) {
  let text = String(input || "");
  for (const pattern of bannedPatterns) {
    text = text.replace(pattern, "");
  }
  return text.replace(/\n{3,}/g, "\n\n").trim();
}

function pickTags(seed) {
  const first = tagPool[seed % tagPool.length];
  const second = tagPool[(seed + 5) % tagPool.length];
  const third = tagPool[(seed + 9) % tagPool.length];
  return [...new Set([first, second, third])];
}

function pickStyle(seed) {
  return articleStyles[seed % articleStyles.length];
}

function hasVersionOrDate(text) {
  return (
    /\d+\.\d+(\.\d+)?/.test(text) ||
    /20\d{2}[-年/]\d{1,2}([-月/]\d{1,2}日?)?/.test(text) ||
    /FinalShell\s*\d/i.test(text) ||
    /Windows\s*(10|11)/i.test(text) ||
    /macOS\s*\d/i.test(text)
  );
}

function hasOperationSteps(text) {
  const stepMarkers =
    (text.match(/第[一二三四五六七八九十\d]+步/g) || []).length +
    (text.match(/^\s*\d+\.\s+/gm) || []).length +
    (text.match(/步骤\s*[一二三四五六七八九十\d]/g) || []).length;
  return stepMarkers >= 3;
}

function hasFaqSection(text) {
  return /##\s*常见问题/.test(text);
}

function hasFirstPerson(text) {
  return /我[^们]|上周|昨天|前几天|测试时|重装后|升级后/.test(text);
}

function isTitleAcceptable(title) {
  if (bannedTitlePatterns.some((pattern) => pattern.test(title))) return false;
  if (title.length > 42) return false;
  return true;
}

function validateArticle({ title, body, style }) {
  const issues = [];
  const charCount = countChineseChars(body);
  const { min: minChars, max: maxChars } = getCharLimits(style);

  if (!isTitleAcceptable(title)) {
    issues.push("标题太官腔或过长，应像博客标题");
  }
  if (charCount < minChars || charCount > maxChars) {
    issues.push(`正文字数 ${charCount}，应在 ${minChars}-${maxChars} 之间`);
  }
  if (!hasVersionOrDate(body)) {
    issues.push("正文缺少具体版本号或日期");
  }
  if (!hasOperationSteps(body)) {
    issues.push("正文缺少至少 3 个操作步骤");
  }
  if (!hasFaqSection(body)) {
    issues.push("缺少「## 常见问题」小节");
  }
  if (!hasFirstPerson(body)) {
    issues.push("缺少第一人称叙述（如「我测试时发现…」）");
  }
  for (const pattern of bannedPatterns) {
    if (pattern.test(body) || pattern.test(title)) {
      issues.push(`含有禁用词：${pattern}`);
    }
  }
  return issues;
}

function frontMatter(data) {
  const tags = JSON.stringify(data.tags);
  return `---\nlayout: article.njk\ntitle: ${data.title}\ndescription: ${data.description}\ndate: ${data.date}\ngenerated: true\ncategory: ${data.category}\ntags: ${tags}\nheroImage: "${data.heroImage}"\nheroAlt: "${data.heroAlt}"\n---\n\n${data.body}\n`;
}

function buildPrompt({ topic, style, firstPersonHint }) {
  const { min: minChars, max: maxChars } = getCharLimits(style);
  return [
    "你是技术博客的兼职作者，给普通用户写实操帖，不是写白皮书，也不是产品宣传稿。",
    "写一篇关于 FinalShell 的原创中文 markdown 文章。",
    "只返回严格 JSON，字段：title, description, slug, category, body。",
    "",
    "【slug】",
    "- 把主题翻译成纯小写英文短语，单词用连字符分隔，例如 finalshell-ssh-connection-tutorial。",
    "- 只用 a-z、0-9 和连字符，不超过 8 个单词，不要出现中文。",
    "",
    "【标题】",
    "- 必须以 FinalShell 开头。",
    "- 像博客标题，口语化一点，例如「FinalShell 连不上服务器？我试了这三种办法」「FinalShell 4.5 在 Win11 上装完第一件事」。",
    "- 禁止：白皮书、完整指南、全面指南、深度解析、技术详解、实用指南 这类官腔标题。",
    "",
    `【结构】本次用${style.name}（${style.length}，正文中文字数必须 ${minChars}-${maxChars} 字）`,
    ...style.structure.map((line) => `- ${line}`),
    "",
    "【硬性要求】",
    "- 正文只用 h2/h3，不要 h1。",
    "- 必须包含：①一个具体版本号或日期 ②至少 3 步操作步骤 ③「## 常见问题」小节。",
    `- 正文中文字数（仅计汉字）必须落在 ${minChars}-${maxChars}，超出会被退回重写。`,
    `- 至少写一段第一人称，可参考：「${firstPersonHint}…」`,
    "- 段落长短错落，不要每段都 3-4 句一样长。",
    "- 禁止用词：综上所述、毋庸置疑、在当今数字化时代、业界领先、全方位、深度融合、极致。",
    "- 禁止：seo、关键词、优化、排名、收录、曝光。",
    "- 不要外链，不要促销话术，不要「总结：」式结尾。",
    "- 正文内链 2～5 条，只允许链到这些真实存在的页面：/blog/finalshell-android-ssh-client/、/blog/finalshell-backup-session-config/、/blog/finalshell-command-history-tips/、/blog/finalshell-docker-container-access/、/blog/finalshell-encoding-charset-fix/。按主题相关选 2～3 条，锚文本自然。",
    `- 插入一张本地风格配图占位：![配图说明](/static/images/photo-1486406146926-c627a92ad1ab.jpg)（可换不同 /static/images/ 路径，禁止 bing 热链）。`,
  "",
    `【主题方向】${topic}`,
    "",
    "【description】",
    "- 80-120 字，像搜索摘要，直接说能帮读者解决什么，不要用「本文将深入探讨」。"
  ].join("\n");
}

// ===== 多模型支持：DeepSeek 正文 + OpenRouter 开头（简体站）=====
const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY || "";
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || "deepseek-chat";
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "z-ai/glm-4.6";

async function chatDeepSeek(prompt) {
  const resp = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${DEEPSEEK_KEY}` },
    body: JSON.stringify({ model: DEEPSEEK_MODEL, messages: [{ role: "user", content: prompt }], response_format: { type: "json_object" } })
  });
  if (!resp.ok) throw new Error(`DeepSeek API ${resp.status}: ${(await resp.text()).slice(0, 200)}`);
  const data = await resp.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("DeepSeek 返回内容为空");
  return text;
}

function buildOpeningPrompt(title, body) {
  const paras = String(body || "").split(/\n\s*\n/);
  const opening = paras.slice(0, 2).join("\n\n");
  return [
    "你是资深技术编辑。为文章《" + title + "》重写开头两段（合计 150-220 字），要求：",
    "1. 第一句必须含具体对象＋具体数字/日期/版本（只能使用原文已有的信息，严禁编造新数据）。",
    "2. 第二句直接说明「这篇文章解决什么问题、看完能做到什么」。",
    "3. 禁止：综上所述、在当今数字化时代、随着AI的发展、任何感叹号、空话套话。",
    "4. 使用简体中文（zh-CN），语气像博客作者。",
    "只输出重写后的两段正文，不要标题、不要任何解释。",
    "",
    "原文开头：",
    opening
  ].join("\n");
}

function spliceOpening(body, newOpening) {
  const paras = String(body || "").split(/\n\s*\n/);
  const rest = paras.slice(2).join("\n\n");
  return newOpening + (rest ? "\n\n" + rest : "");
}

async function rewriteOpeningOpenRouter(title, body) {
  const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENROUTER_KEY}` },
    body: JSON.stringify({ model: OPENROUTER_MODEL, max_tokens: 3000, messages: [{ role: "user", content: buildOpeningPrompt(title, body) }] })
  });
  if (!resp.ok) throw new Error(`OpenRouter API ${resp.status}: ${(await resp.text()).slice(0, 200)}`);
  const data = await resp.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text || text.length < 60) throw new Error("开头重写结果过短");
  return spliceOpening(body, text.trim());
}

async function createArticle(ai, index, topic) {
  const today = new Date();
  const date = today.toISOString().slice(0, 10);
  const seed = Math.floor(Date.now() / 1000) + index;
  const tags = pickTags(seed);
  const style = pickStyle(seed);
  const firstPersonHint = firstPersonHints[seed % firstPersonHints.length];
  const prompt = buildPrompt({ topic, style, firstPersonHint });
  const { max: maxChars } = getCharLimits(style);

  let parsed = null;
  let lastIssues = [];
  let title = "";
  let body = "";

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const retryNote =
      attempt > 0
        ? `\n\n上次生成不合格，请修正：${lastIssues.join("；")}。重新生成完整 JSON。`
        : "";
    let rawText;
    if (DEEPSEEK_KEY) {
      rawText = await chatDeepSeek(prompt + retryNote);
    } else {
      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt + retryNote
      });
      rawText = result.text;
    }
    const raw = String(rawText).replace(/^```json\s*|```$/g, "").trim();
    parsed = JSON.parse(raw);

    title = cleanText(parsed.title).startsWith("FinalShell")
      ? cleanText(parsed.title)
      : `FinalShell ${cleanText(parsed.title)}`;
    body = cleanText(parsed.body);
    lastIssues = validateArticle({ title, body, style });

    if (lastIssues.length === 0) break;

    const onlyTooLong =
      lastIssues.length === 1 && lastIssues[0].includes("正文字数") && countChineseChars(body) > maxChars;
    if (onlyTooLong && attempt >= MAX_ATTEMPTS - 2) {
      try {
        body = cleanText(await shortenBodyIfNeeded(ai, body, maxChars));
        lastIssues = validateArticle({ title, body, style });
        if (lastIssues.length === 0) break;
      } catch (error) {
        console.warn("正文压缩失败，继续重试:", error.message);
      }
    }
  }

  if (lastIssues.length > 0) {
    throw new Error(`Article validation failed after ${MAX_ATTEMPTS} attempts: ${lastIssues.join("；")}`);
  }

  // 开头 200 字由 OpenRouter 模型重写（质量分层），重写后须重新过校验
  if (OPENROUTER_KEY) {
    try {
      console.log("使用 OpenRouter 重写开头 200 字...");
      const newBody = await rewriteOpeningOpenRouter(title, body);
      const recheck = validateArticle({ title, body: newBody, style });
      if (recheck.length === 0) {
        body = newBody;
        console.log("开头重写完成并通过校验");
      } else {
        console.warn("开头重写后校验未通过，保留原文:", recheck.join("；"));
      }
    } catch (error) {
      console.warn("开头重写失败，保留原文:", error.message);
    }
  }

  const description = cleanText(parsed.description).slice(0, 120);
  const category = cleanText(parsed.category || tags[0]);
  const slugEn = slugify(parsed.slug || "").replace(/-{2,}/g, "-");
  const hasAscii = /[a-z]/.test(slugEn) && !/[\u4e00-\u9fa5]/.test(slugEn);
  const slug = hasAscii ? slugEn : `finalshell-${Date.now()}-${index}`;

  return {
    slug,
    url: `/blog/${slug}/`,
    content: frontMatter({
      title,
      description,
      date,
      category,
      tags,
      heroImage: `/static/images/photo-1486406146926-c627a92ad1ab.jpg`,
      heroAlt: `${title} 配图`,
      body
    })
  };
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey && !DEEPSEEK_KEY) throw new Error("Set DEEPSEEK_API_KEY or GEMINI_API_KEY before generating articles.");

  const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
  const count = getCount();
  await fs.mkdir(blogDir, { recursive: true });

  // 选题改走词库（此前用随机 tag 拼接，导致「手机端 FinalShell」这类幻觉选题）
  let keywords = [];
  try {
    keywords = JSON.parse(await fs.readFile(path.join(root, "src", "keywords.json"), "utf-8"));
  } catch (error) {
    console.warn("读取 keywords.json 失败，回退随机 tag 选题:", error.message);
  }
  if (!Array.isArray(keywords) || keywords.length === 0) {
    console.warn("⚠️ 词库为空，本次仍用随机 tag 选题，请尽快补充 keywords.json");
    keywords = [];
  }

  const urls = [];
  for (let i = 0; i < count; i += 1) {
    const topic = keywords.length > 0 ? String(keywords.shift()) : pickTags(Math.floor(Date.now() / 1000) + i).join("、");
    console.log(`本篇选题: ${topic}`);
    const article = await createArticle(ai, i, topic);
    await fs.writeFile(path.join(blogDir, `${article.slug}.md`), article.content, "utf8");
    urls.push(article.url);
  }

  if (keywords.length > 0) {
    await fs.writeFile(path.join(root, "src", "keywords.json"), JSON.stringify(keywords, null, 2), "utf8");
    console.log(`词库剩余: ${keywords.length}`);
  }

  await fs.writeFile(outputFile, JSON.stringify({ urls }, null, 2), "utf8");
  console.log(`Generated ${urls.length} article(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
