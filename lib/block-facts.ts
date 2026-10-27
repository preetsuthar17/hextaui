import { getRequestLocale } from "@/lib/i18n/request"
import { t } from "@/lib/i18n/rich"
import { markTranslated } from "@/lib/i18n/translated"
import { isoDate, proDate } from "@/lib/git-dates"
import { categoryTitle, type ProBlock } from "@/lib/pro/catalog"

function getBlockStats(block: ProBlock) {
  return {
    components: block.components?.length ?? 0,
    files: block.files.length,
    usage: block.usage.length,
    updated: isoDate(proDate([`blocks/${block.name}`])),
  }
}

function getBlockMetaDescription(block: ProBlock) {
  const stats = getBlockStats(block)
  const category = t(categoryTitle(block.category))
  const facts = [
    stats.components > 0
      ? t(
          "{title} is a React block for shadcn/ui in the {category} category, built from {count} HextaUI components.",
          { title: block.title, category, count: stats.components }
        )
      : t("{title} is a React block for shadcn/ui in the {category} category.", {
          title: block.title,
          category,
        }),
    block.free ? t("It is free to install.") : t("It is part of HextaUI Pro."),
    t(block.description),
  ]
  return markTranslated(
    facts.join(getRequestLocale().locale === "ja" ? "" : " ")
  )
}

export { getBlockMetaDescription, getBlockStats }
