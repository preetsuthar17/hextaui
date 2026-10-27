import { FactList, factLinkClassName, type Fact } from "@/components/site/fact-list"
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
import { getStudy, getStudyHref } from "@/lib/research"
import { tableAnchor } from "@/lib/research/study"
import snapshot from "@/lib/shadcn-snapshot.json"
import {
  getShadcnComparisonHref,
  getShadcnComparisons,
} from "@/lib/shadcn-compare"

const usageStudy = "ui-component-usage"

function getDocsGlanceFacts(slug: string): Fact[] {
  const entry = getDocsComponent(slug)
  const stats = getEntryStats(slug)
  const kind = getDocsKind(slug)
  const { locale } = getRequestLocale()
  const category = componentCategories.find(
    (item) => item.slug === entry.category
  )
  const compared = getShadcnComparisons().some((item) => item.slug === slug)
  const inShadcn = slug in snapshot.components
  const study = kind === "component" ? getStudy(usageStudy) : undefined
  const blocks = `${stats.blocks} of ${stats.totalBlocks}`

  return [
    category
      ? {
          label: t("Category"),
          value: (
            <Link
              href={getComponentCategoryHref(category.slug)}
              className={factLinkClassName}
            >
              {t(category.name)}
            </Link>
          ),
        }
      : {
          label: t("Kind"),
          value: t(
            kind === "component" ? "Component" : kind === "hook" ? "Hook" : "Utility"
          ),
        },
    ...(stats.parts ? [{ label: t("Parts"), value: stats.parts }] : []),
    { label: t("Examples"), value: stats.examples },
    {
      label: t("Source"),
      value: t("{count} lines", { count: stats.lines }),
    },
    ...(kind === "component"
      ? [
          {
            label: t("Used in Pro blocks"),
            value: study ? (
              <Link
                href={`${getStudyHref(study.slug)}#${tableAnchor("component-ranking")}`}
                className={factLinkClassName}
              >
                {blocks}
              </Link>
            ) : (
              blocks
            ),
          },
          {
            label: t("shadcn/ui version"),
            value: compared ? (
              <Link
                href={getShadcnComparisonHref(slug)}
                className={factLinkClassName}
              >
                {t("Compared")}
              </Link>
            ) : (
              t(inShadcn ? "Yes" : "None")
            ),
          },
        ]
      : []),
    ...(stats.dependencies.length
      ? [
          {
            label: t("Dependencies"),
            value: stats.dependencies.join(", "),
          },
        ]
      : []),
    ...(stats.updated
      ? [
          {
            label: t("Source updated"),
            value: (
              <time dateTime={stats.updated}>
                {new Intl.DateTimeFormat(locale, {
                  dateStyle: "medium",
                  timeZone: "UTC",
                }).format(new Date(`${stats.updated}T00:00:00Z`))}
              </time>
            ),
          },
        ]
      : []),
  ]
}

function DocsGlance({ slug }: { slug: string }) {
  return (
    <FactList
      label={t("At a glance")}
      facts={getDocsGlanceFacts(slug)}
      className="mt-4 border-y py-4 sm:grid-cols-4"
    />
  )
}

export { DocsGlance }
