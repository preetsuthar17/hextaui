import type { Metadata } from "next"

import {
  docsComponents,
  docsHooks,
  getDocsComponent,
  getDocsTitle,
} from "@/lib/docs"
import { getEntryStats } from "@/lib/entry-stats"
import { getRequestLocale } from "@/lib/i18n/request"
import { t } from "@/lib/i18n/rich"
import { markTranslated } from "@/lib/i18n/translated"
import { pageMetadata } from "@/lib/metadata"

function count(value: number, one: string, many: string) {
  return value === 1 ? t(one, { count: value }) : t(many, { count: value })
}

function getDocsKind(slug: string) {
  if (docsComponents.some((entry) => entry.slug === slug)) return "component"
  if (docsHooks.some((entry) => entry.slug === slug)) return "hook"
  return "utility"
}

function getDocsFactSentences(slug: string) {
  const entry = getDocsComponent(slug)
  const stats = getEntryStats(slug)
  const kind = getDocsKind(slug)
  const name = t(entry.name)
  const lines = count(stats.lines, "{count} line", "{count} lines")
  const examples = count(stats.examples, "{count} example", "{count} examples")
  const values = { name, lines, examples }
  const facts =
    kind === "component" && stats.parts
      ? t(
          "{name} is a free React component for shadcn/ui with {parts}, {examples} and {lines} of source.",
          {
            ...values,
            parts: count(stats.parts, "{count} part", "{count} parts"),
          }
        )
      : kind === "hook"
        ? t(
            "{name} is a free React hook for shadcn/ui projects with {examples} and {lines} of source.",
            values
          )
        : t(
            "{name} is a free utility for shadcn/ui projects with {examples} and {lines} of source.",
            values
          )
  const blocks =
    stats.blocks > 0
      ? t("It is used in {count} of {total} HextaUI Pro blocks.", {
          count: stats.blocks,
          total: stats.totalBlocks,
        })
      : ""
  return [facts, blocks]
    .filter(Boolean)
    .join(getRequestLocale().locale === "ja" ? "" : " ")
}

function getDocsMetaDescription(slug: string) {
  const entry = getDocsComponent(slug)
  return markTranslated(
    [getDocsFactSentences(slug), t(entry.description)].join(
      getRequestLocale().locale === "ja" ? "" : " "
    )
  )
}

function getDocsComponentMetadata(slug: string): Metadata {
  const component = getDocsComponent(slug)

  return pageMetadata({
    title: getDocsTitle(slug),
    description: getDocsMetaDescription(slug),
    path: `/docs/${component.slug}`,
    markdown: `/docs/${component.slug}.md`,
    type: "article",
  })
}

export {
  getDocsComponentMetadata,
  getDocsFactSentences,
  getDocsKind,
  getDocsMetaDescription,
}
