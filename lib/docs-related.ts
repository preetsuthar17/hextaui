import registry from "@/registry.json"
import { docsComponents, docsEntries, getDocsComponent } from "@/lib/docs"
import { proBlocks } from "@/lib/pro/catalog"

type RelatedLink = {
  href: string
  title: string
  description: string
}

const maxRelatedPages = 6
const maxRelatedBlocks = 4

const entrySlugs = new Set(docsEntries.map((entry) => entry.slug))

const dependencyMap = new Map(
  registry.items.map((item) => [
    item.name,
    (("registryDependencies" in item && item.registryDependencies) || [])
      .map((dependency) => /\/r\/([a-z0-9-]+)\.json$/.exec(dependency)?.[1])
      .filter(
        (name): name is string =>
          Boolean(name) && name !== item.name && entrySlugs.has(name ?? "")
      ),
  ])
)

function getDocsDependencies(slug: string) {
  return dependencyMap.get(slug) ?? []
}

function getDocsDependents(slug: string) {
  return docsEntries
    .filter((entry) => getDocsDependencies(entry.slug).includes(slug))
    .map((entry) => entry.slug)
}

function getRelatedDocs(slug: string): RelatedLink[] {
  const { category } = getDocsComponent(slug)
  const siblings = category
    ? docsComponents
        .filter((component) => component.category === category)
        .map((component) => component.slug)
    : []
  const slugs = [
    ...getDocsDependencies(slug),
    ...siblings,
    ...getDocsDependents(slug),
  ].filter(
    (other, index, all) => other !== slug && all.indexOf(other) === index
  )

  return slugs.slice(0, maxRelatedPages).map((other) => {
    const entry = getDocsComponent(other)
    return {
      href: `/docs/${entry.slug}`,
      title: entry.name,
      description: entry.description,
    }
  })
}

function getRelatedBlocks(slug: string): RelatedLink[] {
  return proBlocks
    .filter((block) => block.components?.includes(slug))
    .sort((a, b) => Number(Boolean(b.free)) - Number(Boolean(a.free)))
    .slice(0, maxRelatedBlocks)
    .map((block) => ({
      href: `/blocks/${block.name}`,
      title: block.title,
      description: block.description,
    }))
}

function getBlockComponents(name: string): RelatedLink[] {
  const block = proBlocks.find((item) => item.name === name)
  return (block?.components ?? [])
    .filter((slug) => entrySlugs.has(slug))
    .map((slug) => {
      const entry = getDocsComponent(slug)
      return {
        href: `/docs/${entry.slug}`,
        title: entry.name,
        description: entry.description,
      }
    })
}

export {
  getBlockComponents,
  getDocsDependencies,
  getDocsDependents,
  getRelatedBlocks,
  getRelatedDocs,
  type RelatedLink,
}
