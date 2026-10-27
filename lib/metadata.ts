import type { Metadata } from "next"

import { languageAlternates } from "@/lib/i18n/config"
import { markdownPathFor, matchMarkdownRoute } from "@/lib/md/routes"
import {
  isNoindexPath,
  siteDefaultImage,
  siteMetaDescription,
  siteName,
  siteTitle,
  siteTwitter,
} from "@/lib/site"

type PageMetadataOptions = {
  path?: string
  title?: string
  description?: string
  markdown?: string
  aiSummary?: string
  image?: string
  imageAlt?: string
  type?: "website" | "article"
  publishedTime?: string
  modifiedTime?: string
  noindex?: boolean
}

const maxTitleWidth = 60
const minDescriptionWidth = 70
const maxDescriptionLength = 160
const minSentenceSummaryLength = 110
const titleSeparator = " — "
const titleSuffix = `${titleSeparator}${siteName}`

const wideCharacter = /[ᄀ-ᅟ⺀-〾ぁ-㏿㐀-䶿一-鿿ꥠ-꥿가-힣豈-﫿︰-﹏＀-｠￠-￦]/u
const sentenceBreak = /(?<=[.!?])\s+|(?<=[。！？])/
const softBreak = /[\s、，。]/
const danglingWords =
  /\s+(?:a|an|and|as|at|by|for|from|in|of|on|or|the|to|with)$/i
const danglingPunctuation = /[\s,;:、，—–-]+$/

function textWidth(text: string) {
  let width = 0
  for (const character of text) width += wideCharacter.test(character) ? 2 : 1
  return width
}

function sliceToWidth(text: string, max: number) {
  let width = 0
  let result = ""
  for (const character of text) {
    width += wideCharacter.test(character) ? 2 : 1
    if (width > max) break
    result += character
  }
  return result
}

function documentTitle(title: string) {
  const full = `${title}${titleSuffix}`
  return textWidth(full) <= maxTitleWidth ? full : title
}

function metadataTitle(metadata: Metadata) {
  const { title } = metadata
  if (typeof title === "string") return title
  if (title && "absolute" in title && title.absolute) {
    return title.absolute.endsWith(titleSuffix)
      ? title.absolute.slice(0, -titleSuffix.length)
      : title.absolute
  }
  return ""
}

function trimDangling(text: string) {
  let result = text
  for (;;) {
    const next = result
      .replace(danglingPunctuation, "")
      .replace(danglingWords, "")
    if (next === result) return result
    result = next
  }
}

function clampDescription(text: string, max = maxDescriptionLength) {
  if (textWidth(text) <= max) return text

  let summary = ""
  for (const sentence of text.split(sentenceBreak)) {
    if (!/[.!?。！？]$/.test(sentence)) break
    const next = /[。！？]$/.test(summary)
      ? `${summary}${sentence}`
      : `${summary} ${sentence}`.trim()
    if (textWidth(next) > max) break
    summary = next
  }
  if (textWidth(summary) >= minSentenceSummaryLength) return summary

  const cut = sliceToWidth(text, max)
  let index = cut.length
  while (index > 0 && !softBreak.test(text[index])) index -= 1
  const atWord =
    index > 0 && textWidth(cut.slice(0, index)) >= minDescriptionWidth
      ? cut.slice(0, index)
      : cut
  return trimDangling(atWord)
}

function pageMetadata({
  path,
  title,
  description: fullDescription = siteMetaDescription,
  markdown: markdownOverride,
  aiSummary,
  image,
  imageAlt,
  type = "website",
  publishedTime,
  modifiedTime,
  noindex = false,
}: PageMetadataOptions): Metadata {
  const description = clampDescription(fullDescription)
  const markdown =
    markdownOverride ??
    (path && matchMarkdownRoute(path) && !isNoindexPath(path)
      ? markdownPathFor(path)
      : undefined)
  const socialTitle = title ? `${title}${titleSuffix}` : siteTitle
  const imageUrl =
    image ?? (path && !noindex ? ogImagePath(path) : siteDefaultImage)
  const socialImage = {
    url: imageUrl,
    width: 1200,
    height: 630,
    alt: imageAlt ?? socialTitle,
  }

  return {
    ...(title ? { title: { absolute: documentTitle(title) } } : {}),
    description,
    ...(path
      ? {
          alternates: {
            canonical: path,
            languages: noindex ? undefined : languageAlternates(path),
            ...(markdown ? { types: { "text/markdown": markdown } } : {}),
          },
        }
      : {}),
    openGraph: {
      title: socialTitle,
      description,
      ...(path ? { url: path } : {}),
      siteName,
      type,
      locale: "en_US",
      images: [socialImage],
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
      ...(type === "article" && (modifiedTime ?? publishedTime)
        ? { modifiedTime: modifiedTime ?? publishedTime }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      site: siteTwitter,
      creator: siteTwitter,
      images: [socialImage],
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    other: { "ai-summary": aiSummary ?? description },
  }
}

function ogImagePath(path: string) {
  return `/og${path === "/" ? "/index" : path}.png`
}

export {
  clampDescription,
  documentTitle,
  maxDescriptionLength,
  maxTitleWidth,
  metadataTitle,
  minDescriptionWidth,
  ogImagePath,
  pageMetadata,
  textWidth,
  titleSuffix,
}
