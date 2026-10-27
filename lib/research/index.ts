import snapshot from "@/lib/shadcn-snapshot.json"
import type { ComponentFacts } from "@/lib/component-facts"
import { changelog } from "@/lib/changelog"
import { docsComponents, type DocsCategory } from "@/lib/docs"
import { isoDate, proDate } from "@/lib/git-dates"
import { categoryTitle, proBlocks } from "@/lib/pro/catalog"
import { computeBlockStudy } from "@/lib/research/block-components"
import { computeShadcnStudy } from "@/lib/research/shadcn-components"
import type { Study } from "@/lib/research/study"

const kindLabels: Record<DocsCategory, string> = {
  actions: "buttons and actions",
  forms: "form controls",
  overlays: "overlays",
  navigation: "navigation components",
  feedback: "feedback components",
  "data-display": "data display components",
  layout: "layout components",
  chat: "chat components",
  media: "media components",
}

const titleWords: Record<string, string> = { otp: "OTP", ui: "UI" }

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((word, index) =>
      titleWords[word] ??
      (index === 0 ? `${word.charAt(0).toUpperCase()}${word.slice(1)}` : word)
    )
    .join(" ")
}

function componentName(slug: string) {
  return (
    docsComponents.find((component) => component.slug === slug)?.name ??
    titleFromSlug(slug)
  )
}

function getShadcnStudy() {
  const components = snapshot.components as Record<string, ComponentFacts>
  return computeShadcnStudy(
    Object.entries(components).map(([name, facts]) => ({
      name,
      title: componentName(name),
      parts: facts.parts,
      variantGroups: Object.values(facts.variants).reduce(
        (sum, groups) => sum + Object.keys(groups).length,
        0
      ),
      registryDependencies: facts.registryDependencies,
      lines: facts.lines,
    })),
    { fetched: snapshot.fetched, style: snapshot.style, source: snapshot.source }
  )
}

function blocksUpdated() {
  return (
    isoDate(proDate(["blocks"])) ??
    [...changelog].map((entry) => entry.date).sort().at(-1) ??
    "2026-01-01"
  )
}

function getBlockStudy() {
  return computeBlockStudy(
    proBlocks.map((block) => ({
      name: block.name,
      title: block.title,
      category: block.category,
      categoryTitle: categoryTitle(block.category),
      components: block.components ?? [],
    })),
    docsComponents.map((component) => ({
      slug: component.slug,
      name: component.name,
      kind: component.category,
      kindLabel: component.category ? kindLabels[component.category] : undefined,
    })),
    { updated: blocksUpdated() }
  )
}

let cached: Study[] | undefined

function getStudies() {
  cached ??= [getShadcnStudy(), getBlockStudy()].filter(
    (study) => study.findings.length > 0
  )
  return cached
}

function getStudy(slug: string) {
  return getStudies().find((study) => study.slug === slug)
}

function getStudyHref(slug: string) {
  return `/research/${slug}`
}

export {
  componentName,
  getStudies,
  getStudy,
  getStudyHref,
}
