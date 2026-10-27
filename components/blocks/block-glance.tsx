import { FactList, factLinkClassName, type Fact } from "@/components/site/fact-list"
import Link from "@/components/site/link"
import { getBlockStats } from "@/lib/block-facts"
import { getRequestLocale } from "@/lib/i18n/request"
import { t } from "@/lib/i18n/rich"
import { categoryTitle, proBlocks, type ProBlock } from "@/lib/pro/catalog"
import { getStudy, getStudyHref } from "@/lib/research"
import { findingAnchor } from "@/lib/research/study"

const usageStudy = "ui-component-usage"

function getBlockGlanceFacts(block: ProBlock): Fact[] {
  const stats = getBlockStats(block)
  const { locale } = getRequestLocale()
  const study = getStudy(usageStudy)
  const counted = study?.tables
    .find((table) => table.id === "all-blocks")
    ?.rows.some((row) => row[0] === block.title)

  return [
    { label: t("Category"), value: t(categoryTitle(block.category)) },
    { label: t("Components used"), value: stats.components },
    { label: t("Files"), value: stats.files },
    { label: t("Usage examples"), value: stats.usage },
    {
      label: t("Access"),
      value: block.free
        ? t("Free")
        : t("HextaUI Pro ({count} blocks)", { count: proBlocks.length }),
    },
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
    ...(study && counted
      ? [
          {
            label: t("Counted in"),
            value: (
              <Link
                href={`${getStudyHref(study.slug)}#${findingAnchor("components-per-block")}`}
                className={factLinkClassName}
              >
                {t("UI component usage study")}
              </Link>
            ),
          },
        ]
      : []),
  ]
}

function BlockGlance({ block }: { block: ProBlock }) {
  return (
    <FactList
      label={t("At a glance")}
      facts={getBlockGlanceFacts(block)}
      className="mt-4 border-y py-4 sm:grid-cols-4"
    />
  )
}

export { BlockGlance }
