import type { Metadata } from "next"

import {
  languageAlternates,
  localizeHref,
  openGraphLocales,
} from "@/lib/i18n/config"
import { getRequestLocale } from "@/lib/i18n/request"
import { t } from "@/lib/i18n/rich"
import {
  clampDescription,
  documentTitle,
  metadataTitle,
  titleSuffix,
} from "@/lib/metadata"

function localizeMetadata(source: Metadata, path: string): Metadata {
  const { locale } = getRequestLocale()
  const url = localizeHref(path, locale)
  const sourceTitle = metadataTitle(source)
  const title = sourceTitle ? t(sourceTitle) : undefined
  const description = source.description
    ? clampDescription(t(source.description))
    : undefined
  const socialTitle = title ? `${title}${titleSuffix}` : undefined
  const social = {
    ...(socialTitle ? { title: socialTitle } : {}),
    ...(description ? { description } : {}),
  }

  return {
    ...source,
    ...(title ? { title: { absolute: documentTitle(title) } } : {}),
    ...(description ? { description } : {}),
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      ...source.openGraph,
      ...social,
      url,
      locale: openGraphLocales[locale],
    },
    twitter: { ...source.twitter, ...social },
  }
}

export { localizeMetadata }
