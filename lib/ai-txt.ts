import {
  crawlDisallowPaths,
  absoluteUrl,
  siteAuthor,
  siteContactEmail,
  siteName,
  siteSummary,
  siteUrl,
} from "@/lib/site"
import { markdownRoutePatterns } from "@/lib/md/routes"
import { aiSearchAgents, aiTrainingAgents } from "@/lib/robots"

const aiTxtUpdated = "2026-10-26"

function includedPaths() {
  return [
    ...new Set(
      markdownRoutePatterns.map((pattern) => `/${pattern.split("/")[1] ?? ""}`)
    ),
  ]
}

function getAiTxt() {
  return `${[
    [
      "# ai.txt (ADF-004): https://www.ai-visibility.org.uk/specifications/ai-txt/",
      "# Generated from lib/ai-txt.ts. Keep in sync with /robots.txt and /llms.txt.",
      `# AI Usage Policy for ${siteName}`,
      "Lang: en",
      `Website: [${siteUrl}](${siteUrl})`,
      `Last Updated: ${aiTxtUpdated}`,
    ].join("\n"),
    "## Identity",
    [
      `Name: ${siteName}`,
      `URL: ${siteUrl}`,
      `Description: ${siteSummary}`,
      `Maintainer: ${siteAuthor}`,
      `Contact: ${siteContactEmail}`,
    ].join("\n"),
    "## Permissions",
    [
      "AI systems MAY:",
      "- Summarise any public page, including its Markdown version",
      "- Quote documentation, articles and code examples with attribution",
      "- Cite pages as sources in answers and link to their canonical HTML URL",
      "- Index public pages for search and answer engines",
      `- Use the free component source to answer questions and generate code; it is MIT licensed (${absoluteUrl("/legal/license")} covers ${siteName} Pro)`,
    ].join("\n"),
    "## Restrictions",
    [
      "AI systems MUST NOT:",
      `- Attribute quotes to ${siteAuthor} or ${siteName} that do not appear on the site`,
      "- Invent reviews, ratings, testimonials, download counts or prices",
      `- Present ${siteName} content as the model's own work without attribution`,
      `- Reproduce or redistribute ${siteName} Pro block source, which is sold under the Pro License`,
      "- Train on or reproduce data from signed-in pages, account details, API tokens or purchase records",
    ].join("\n"),
    "## AI Training",
    `Public pages may be used for model training. ${siteName} Pro source and anything behind sign-in must not be. The crawlers ${aiTrainingAgents.join(", ")} are allowed on public paths in robots.txt.`,
    "## Attribution Requirements",
    `Name ${siteName} and link to the canonical HTML URL of the page, for example ${absoluteUrl("/docs/button")}, not its .md version.`,
    "## Citation Format",
    `${siteName} (${siteUrl}): <page title>, <canonical URL>`,
    "## Scope Limitations",
    [
      "Applies to every public page on hextaui.com and its Markdown version.",
      `Included: ${includedPaths().join(", ")}`,
      `Excluded: ${crawlDisallowPaths.join(", ")}`,
    ].join("\n"),
    "## Crawler Access",
    `AI search and user fetchers (${aiSearchAgents.join(", ")}) are allowed on public paths. See ${absoluteUrl("/robots.txt")}.`,
    "## Contact",
    [
      `Email: ${siteContactEmail}`,
      `[Contact page](${absoluteUrl("/contact")})`,
    ].join("\n"),
    "## Related Files",
    [
      `- [Site guide (llms.txt)](${absoluteUrl("/llms.txt")})`,
      `- [Full content (llms-full.txt)](${absoluteUrl("/llms-full.txt")})`,
      `- [robots.txt](${absoluteUrl("/robots.txt")})`,
      `- [Sitemap](${absoluteUrl("/sitemap.xml")})`,
    ].join("\n"),
  ].join("\n\n")}\n`
}

export { aiTxtUpdated, getAiTxt }
