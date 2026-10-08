import { siteName, siteUrl } from "@/lib/site"

type EmailLink = { label: string; href: string }

type EmailInline = string | EmailLink

type EmailContent = {
  title: string
  eyebrow?: string
  preheader?: string
  paragraphs: string[]
  lists?: { heading: string; items: string[] }[]
  links?: EmailLink[]
  footer: EmailInline[]
}

const fontStack =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

const colors = {
  page: "#ffffff",
  heading: "#09090b",
  text: "#27272a",
  muted: "#71717a",
  rule: "#e4e4e7",
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

function anchor({ label, href }: EmailLink, color: string) {
  return `<a href="${escapeHtml(href)}" style="color:${color};text-decoration:underline;text-underline-offset:3px;">${escapeHtml(label)}</a>`
}

function inlineHtml(parts: EmailInline[], color: string) {
  return parts
    .map((part) =>
      typeof part === "string" ? escapeHtml(part) : anchor(part, color)
    )
    .join("")
}

function inlineText(parts: EmailInline[]) {
  return parts
    .map((part) =>
      typeof part === "string" ? part : `${part.label} (${part.href})`
    )
    .join("")
}

function emailHtml(content: EmailContent) {
  const preheader = content.preheader ?? content.paragraphs[0] ?? content.title
  const paragraphs = content.paragraphs
    .map(
      (text) =>
        `<p class="text" style="margin:0 0 16px;font-size:15px;line-height:24px;color:${colors.text};">${escapeHtml(text)}</p>`
    )
    .join("")
  const lists = (content.lists ?? [])
    .map(
      ({ heading, items }) =>
        `<p class="heading" style="margin:0 0 8px;font-size:14px;line-height:20px;font-weight:600;color:${colors.heading};">${escapeHtml(heading)}</p><ul class="text" style="margin:0 0 16px;padding-left:20px;font-size:15px;line-height:24px;color:${colors.text};">${items.map((item) => `<li style="margin:0 0 6px;">${escapeHtml(item)}</li>`).join("")}</ul>`
    )
    .join("")
  const links = content.links?.length
    ? `<p class="text" style="margin:0 0 32px;font-size:15px;line-height:24px;color:${colors.text};">${content.links.map((link) => anchor(link, colors.heading)).join(" &nbsp;·&nbsp; ")}</p>`
    : `<div style="height:16px;line-height:16px;">&nbsp;</div>`
  const eyebrow = content.eyebrow
    ? `<p class="muted" style="margin:0 0 4px;font-size:13px;line-height:20px;color:${colors.muted};">${escapeHtml(content.eyebrow)}</p>`
    : ""

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${escapeHtml(content.title)}</title>
<style>
@media (prefers-color-scheme: dark) {
  .page { background:#09090b !important; }
  .text, .text a { color:#e4e4e7 !important; }
  .heading { color:#fafafa !important; }
  .muted, .muted a { color:#a1a1aa !important; }
  .rule { border-color:#27272a !important; }
}
</style>
</head>
<body class="page" style="margin:0;padding:0;background:${colors.page};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="page" style="background:${colors.page};">
<tr><td align="center" style="padding:40px 24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;font-family:${fontStack};">
<tr><td>
<p style="margin:0 0 28px;"><a href="${siteUrl}" style="text-decoration:none;"><img src="${siteUrl}/apple-icon.png" width="24" height="24" alt="" style="display:inline-block;vertical-align:middle;border:0;border-radius:6px;"><span class="heading" style="display:inline-block;vertical-align:middle;margin-left:8px;font-size:14px;line-height:20px;font-weight:600;color:${colors.heading};">${siteName}</span></a></p>
${eyebrow}
<h1 class="heading" style="margin:0 0 16px;font-size:20px;line-height:28px;font-weight:600;color:${colors.heading};">${escapeHtml(content.title)}</h1>
${paragraphs}
${lists}
${links}
<p class="muted rule" style="margin:0;padding-top:16px;border-top:1px solid ${colors.rule};font-size:12px;line-height:18px;color:${colors.muted};">${inlineHtml(content.footer, colors.muted)}</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`
}

function emailText(content: EmailContent) {
  return [
    content.title,
    ...(content.eyebrow ? [content.eyebrow] : []),
    "",
    ...content.paragraphs.flatMap((text) => [text, ""]),
    ...(content.lists ?? []).flatMap(({ heading, items }) => [
      heading,
      ...items.map((item) => `- ${item}`),
      "",
    ]),
    ...(content.links ?? []).map((link) => `${link.label}: ${link.href}`),
    "",
    "—",
    inlineText(content.footer),
  ].join("\n")
}

function renderEmail(content: EmailContent) {
  return { html: emailHtml(content), text: emailText(content) }
}

export { renderEmail, type EmailContent, type EmailInline, type EmailLink }
