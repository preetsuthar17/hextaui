import type { DocsNavSection } from "@/lib/docs"

const newForDays = 7
const day = 24 * 60 * 60 * 1000

const blocksAdded: Record<string, string> = {
  "image-studio": "2026-10-29",
  integrations: "2026-10-29",
  memory: "2026-10-29",
  "model-compare": "2026-10-29",
  "prompt-library": "2026-10-29",
  workflow: "2026-10-29",
}

const entriesAdded: Record<string, string> = {}

function newUntil(added: string | undefined, now = Date.now()) {
  if (!added) return undefined
  const until = Date.parse(`${added}T00:00:00Z`) + newForDays * day
  return until > now ? new Date(until).toISOString() : undefined
}

function entryNewUntil(slug: string) {
  return newUntil(entriesAdded[slug])
}

function blockNewUntil(name: string) {
  return newUntil(blocksAdded[name])
}

function withNewItems(
  sections: DocsNavSection[],
  pattern: RegExp,
  until: (slug: string) => string | undefined
): DocsNavSection[] {
  return sections.map((section) => ({
    ...section,
    items: section.items.map((item) => {
      const slug = item.href.match(pattern)?.[1]
      const newUntil = slug ? until(slug) : undefined
      return newUntil ? { ...item, newUntil } : item
    }),
  }))
}

function withNewEntries(sections: DocsNavSection[]) {
  return withNewItems(sections, /^\/docs\/([^/]+)$/, entryNewUntil)
}

function withNewBlocks(sections: DocsNavSection[]) {
  return withNewItems(sections, /^\/blocks\/([^/]+)$/, blockNewUntil)
}

export {
  blockNewUntil,
  blocksAdded,
  entriesAdded,
  entryNewUntil,
  newForDays,
  newUntil,
  withNewBlocks,
  withNewEntries,
}
