import {
  getCategoryComponents,
  getComponentCategory,
  minimumComponents,
} from "@/lib/component-categories"
import { titleCase } from "@/lib/docs"
import { getProBlocksUsing } from "@/lib/docs-related"
import { isoDate, sourcesDate } from "@/lib/git-dates"
import { getRequestLocale } from "@/lib/i18n/request"
import { t } from "@/lib/i18n/rich"
import { markTranslated } from "@/lib/i18n/translated"
import { maxTitleWidth, textWidth } from "@/lib/metadata"
import { proBlocks } from "@/lib/pro/catalog"

const topCount = 3

function categorySources(slug: string) {
  return [
    "lib/component-categories.ts",
    "lib/docs.ts",
    ...getCategoryComponents(slug).map(
      (component) => `components/ui/${component.slug}.tsx`
    ),
  ]
}

function getCategoryList(slug: string) {
  const category = getComponentCategory(slug)
  if (!category) return undefined
  const components = getCategoryComponents(slug)
  const usage = components
    .map((component) => ({
      ...component,
      blocks: getProBlocksUsing(component.slug).length,
    }))
    .filter((component) => component.blocks > 0)
    .sort((a, b) => b.blocks - a.blocks || a.name.localeCompare(b.name))

  return {
    category,
    components,
    count: components.length,
    used: usage.length,
    top: usage.slice(0, topCount),
    totalBlocks: proBlocks.length,
    updated: isoDate(sourcesDate(categorySources(slug))),
    minimum: minimumComponents,
  }
}

type CategoryList = NonNullable<ReturnType<typeof getCategoryList>>

function inSentence(name: string, locale: string) {
  if (locale === "de" || locale === "ja") return name
  return /^\p{Lu}\p{Ll}/u.test(name)
    ? `${name.charAt(0).toLowerCase()}${name.slice(1)}`
    : name
}

const smallWords = /\s(And|Or|For|Of|The|A|An)(?=\s)/g

function listName(name: string) {
  return titleCase(name).replace(smallWords, (word) => word.toLowerCase())
}

function getCategoryListTitle(list: CategoryList) {
  const { locale } = getRequestLocale()
  const values = {
    count: list.count,
    name: locale === "en" ? listName(list.category.name) : t(list.category.name),
    ...(list.updated ? { year: list.updated.slice(0, 4) } : {}),
  }
  const candidates = [
    ...(list.updated
      ? [
          t("{count} Free {name} for React & shadcn/ui ({year})", values),
          t("{count} Free {name} for shadcn/ui ({year})", values),
        ]
      : []),
    t("{count} Free {name} for React & shadcn/ui", values),
    t("{count} Free {name} for shadcn/ui", values),
  ]
  return markTranslated(
    candidates.find((title) => textWidth(title) <= maxTitleWidth) ??
      candidates[candidates.length - 1]
  )
}

function getCategoryListSummary(list: CategoryList) {
  const { locale } = getRequestLocale()
  const name = inSentence(t(list.category.name), locale)
  const sentences = [
    t("HextaUI has {count} free {name} for React and shadcn/ui, listed A to Z.", {
      count: list.count,
      name,
    }),
  ]
  if (list.top.length) {
    const items = list.top.map((component, index) =>
      index === 0
        ? t("{name} ({count} of {total} blocks)", {
            name: t(component.name),
            count: component.blocks,
            total: list.totalBlocks,
          })
        : `${t(component.name)} (${component.blocks})`
    )
    sentences.push(
      t("HextaUI Pro blocks use {used} of them. Most used: {list}.", {
        used: list.used,
        list: new Intl.ListFormat(locale === "en" ? "en-GB" : locale, {
          type: "conjunction",
        }).format(
          items
        ),
      })
    )
  } else {
    sentences.push(t("None of them are used in a HextaUI Pro block yet."))
  }
  if (list.updated) {
    sentences.push(
      t("Last reviewed {date}.", {
        date: new Intl.DateTimeFormat(locale, {
          dateStyle: "long",
          timeZone: "UTC",
        }).format(new Date(`${list.updated}T00:00:00Z`)),
      })
    )
  }
  return markTranslated(sentences.join(locale === "ja" ? "" : " "))
}

export {
  categorySources,
  getCategoryList,
  getCategoryListSummary,
  getCategoryListTitle,
  type CategoryList,
}
