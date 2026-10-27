import {
  absoluteUrl,
  crawlAllowPaths,
  crawlDisallowPaths,
  siteName,
  siteUrl,
} from "@/lib/site"

const aiSearchAgents = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
]

const aiTrainingAgents = [
  "GPTBot",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Bytespider",
]

type RobotsRule = { userAgents: string[]; allow: string[]; disallow: string[] }

const robotsRules: RobotsRule[] = [
  {
    userAgents: aiSearchAgents,
    allow: crawlAllowPaths,
    disallow: crawlDisallowPaths,
  },
  {
    userAgents: aiTrainingAgents,
    allow: crawlAllowPaths,
    disallow: crawlDisallowPaths,
  },
  { userAgents: ["*"], allow: crawlAllowPaths, disallow: crawlDisallowPaths },
]

function getRobotsTxt() {
  return `${[
    [
      `# robots.txt for ${siteName}. Generated from lib/robots.ts.`,
      "# Keep in sync with /llms.txt and /ai.txt (lib/md/llms.ts, lib/ai-txt.ts).",
      `# Site guide for language models: ${absoluteUrl("/llms.txt")}`,
      `# AI usage policy: ${absoluteUrl("/ai.txt")}`,
    ].join("\n"),
    [
      "# AI search and user-initiated fetchers: these let answer engines cite us.",
      ruleBlock(robotsRules[0]),
    ].join("\n"),
    [
      "# AI training crawlers: allowed on public paths.",
      ruleBlock(robotsRules[1]),
    ].join("\n"),
    ["# Everyone else.", ruleBlock(robotsRules[2])].join("\n"),
    `Host: ${siteUrl}\nSitemap: ${absoluteUrl("/sitemap.xml")}`,
  ].join("\n\n")}\n`
}

function ruleBlock(rule: RobotsRule) {
  return [
    ...rule.userAgents.map((agent) => `User-agent: ${agent}`),
    ...rule.allow.map((path) => `Allow: ${path}`),
    ...rule.disallow.map((path) => `Disallow: ${path}`),
  ].join("\n")
}

export { aiSearchAgents, aiTrainingAgents, getRobotsTxt, robotsRules }
