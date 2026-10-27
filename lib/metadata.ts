import type { Metadata } from "next"

import { languageAlternates } from "@/lib/i18n/config"
import { markdownPathFor, matchMarkdownRoute } from "@/lib/md/routes"
import {
  isNoindexPath,
  siteMetaDescription,
  siteName,
  siteTitle,
  siteTwitter,
} from "@/lib/site"

type PageMetadataOptions = {
  path: string
  title?: string
  description?: string
  markdown?: string
  aiSummary?: string
  image?: string
  imageAlt?: string
  type?: "website" | "article"
}

const maxDescriptionLength = 160
const minSentenceSummaryLength = 110

function clampDescription(text: string, max = maxDescriptionLength) {
  if (text.length <= max) return text

  let summary = ""
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    if (!/[.!?]$/.test(sentence)) break
    const next = `${summary} ${sentence}`.trim()
    if (next.length > max) break
    summary = next
  }
  if (summary.length >= minSentenceSummaryLength) return summary

  const cut = text.slice(0, max - 1)
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:]+$/, "")}…`
}

function pageMetadata({
  path,
  title,
  description: fullDescription = siteMetaDescription,
  markdown: markdownOverride,
  aiSummary,
  image: imageUrl = ogImagePath(path),
  imageAlt,
  type = "website",
}: PageMetadataOptions): Metadata {
  const description = clampDescription(fullDescription)
  const markdown =
    markdownOverride ??
    (matchMarkdownRoute(path) && !isNoindexPath(path)
      ? markdownPathFor(path)
      : undefined)
  const socialTitle = title ? `${title} — ${siteName}` : siteTitle
  const image = {
    url: imageUrl,
    width: 1200,
    height: 630,
    alt: imageAlt ?? (title ? socialTitle : siteTitle),
  }

  return {
    ...(title ? { title } : {}),
    description,
    alternates: {
      canonical: path,
      languages: languageAlternates(path),
      ...(markdown ? { types: { "text/markdown": markdown } } : {}),
    },
    openGraph: {
      title: socialTitle,
      description,
      url: path,
      siteName,
      type,
      locale: "en_US",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      creator: siteTwitter,
      images: [image],
    },
    other: { "ai-summary": aiSummary ?? description },
  }
}

function ogImagePath(path: string) {
  return `/og${path === "/" ? "/index" : path}.png`
}

export { clampDescription, ogImagePath, pageMetadata }
