import type { ChangelogEntry } from "@/lib/changelog"
import { renderEmail, type EmailContent } from "@/lib/email/layout"
import { siteName, siteUrl } from "@/lib/site"

type ReleaseLinks = { page: string; oneClick: string }

const dateFormat = new Intl.DateTimeFormat("en", {
  dateStyle: "long",
  timeZone: "UTC",
})

function releaseContent(
  entry: ChangelogEntry,
  links: ReleaseLinks
): EmailContent {
  return {
    title: entry.title,
    eyebrow: dateFormat.format(new Date(entry.date)),
    paragraphs: entry.body,
    links: [
      { label: "See what’s new", href: `${siteUrl}/changelog#${entry.date}` },
      { label: "Browse blocks", href: `${siteUrl}/blocks` },
    ],
    footer: [
      `You’re getting this because you have a ${siteName} account. `,
      { label: "Unsubscribe", href: links.page },
      " or change it any time in ",
      { label: "your account", href: `${siteUrl}/account` },
      ".",
    ],
  }
}

function releaseHtml(entry: ChangelogEntry, links: ReleaseLinks) {
  return renderEmail(releaseContent(entry, links)).html
}

function releaseEmail(entry: ChangelogEntry, to: string, links: ReleaseLinks) {
  return {
    to,
    subject: `${entry.title} — ${siteName}`,
    ...renderEmail(releaseContent(entry, links)),
    headers: {
      "List-Unsubscribe": `<${links.oneClick}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  }
}

export { releaseEmail, releaseHtml, type ReleaseLinks }
