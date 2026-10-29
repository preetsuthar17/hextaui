import * as React from "react"

import { factLinkClassName } from "@/components/site/fact-list"
import Link from "@/components/site/link"
import {
  componentCategories,
  getComponentCategoryHref,
} from "@/lib/component-categories"
import { getDocsComponent } from "@/lib/docs"
import { getDocsKind } from "@/lib/docs-metadata"
import { getEntryStats } from "@/lib/entry-stats"
import { getRequestLocale } from "@/lib/i18n/request"
import { t } from "@/lib/i18n/rich"
import {
  getShadcnComparisonHref,
  getShadcnComparisons,
} from "@/lib/shadcn-compare"

const internalDependencies = new Set(["cn"])

function getDocsGlanceItems(slug: string): React.ReactNode[] {
  const entry = getDocsComponent(slug)
  const stats = getEntryStats(slug)
  const kind = getDocsKind(slug)
  const { locale } = getRequestLocale()
  const category = componentCategories.find(
    (item) => item.slug === entry.category
  )
  const compared =
    kind === "component" &&
    getShadcnComparisons().some((item) => item.slug === slug)

  return [
    category ? (
      <Link
        href={getComponentCategoryHref(category.slug)}
        className={factLinkClassName}
      >
        {t(category.name)}
      </Link>
    ) : (
      t(kind === "component" ? "Component" : kind === "hook" ? "Hook" : "Utility")
    ),
    ...(stats.parts ? [t("{count} parts", { count: stats.parts })] : []),
    t("{count} examples", { count: stats.examples }),
    ...(stats.updated
      ? [
          <time key="updated" dateTime={stats.updated}>
            {t("Updated {date}", {
              date: new Intl.DateTimeFormat(locale, {
                dateStyle: "medium",
                timeZone: "UTC",
              }).format(new Date(`${stats.updated}T00:00:00Z`)),
            })}
          </time>,
        ]
      : []),
    ...(compared
      ? [
          <Link
            key="compare"
            href={getShadcnComparisonHref(slug)}
            className={factLinkClassName}
          >
            {t("vs shadcn/ui")}
          </Link>,
        ]
      : []),
  ]
}

function DocsGlance({ slug }: { slug: string }) {
  const dependencies = getEntryStats(slug).dependencies.filter(
    (name) => !internalDependencies.has(name)
  )

  return (
    <div className="mt-2 flex flex-col gap-2.5 text-sm text-muted-foreground">
      <ul
        aria-label={t("At a glance")}
        className="flex flex-wrap items-center gap-y-1"
      >
        {getDocsGlanceItems(slug).map((item, index) => (
          <li
            key={index}
            className="flex items-center tabular-nums not-first:before:mx-2.5 not-first:before:text-border not-first:before:content-['·']"
          >
            {item}
          </li>
        ))}
      </ul>
      {dependencies.length ? (
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span>{t("Depends on")}</span>
          <ul
            aria-label={t("Dependencies")}
            className="flex flex-wrap items-center gap-1.5"
          >
            {dependencies.map((name) => (
              <li key={name}>
                <code className="rounded-xs bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                  {name}
                </code>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

export { DocsGlance }
