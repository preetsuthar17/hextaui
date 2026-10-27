import fs from "node:fs"
import path from "node:path"

import registry from "@/registry.json"
import { getComponentFacts } from "@/lib/component-facts"
import { isoDate, sourcesDate } from "@/lib/git-dates"
import { getBlocksUsing, proBlocks } from "@/lib/pro/catalog"

type RegistryItem = {
  name: string
  type: string
  dependencies?: string[]
  registryDependencies?: string[]
  files?: { path: string }[]
}

const items = registry.items as RegistryItem[]

function packageName(dependency: string) {
  const at = dependency.lastIndexOf("@")
  return at > 0 ? dependency.slice(0, at) : dependency
}

function getEntryStats(slug: string) {
  const item = items.find(
    (entry) => entry.name === slug && entry.type !== "registry:example"
  )
  const file = item?.files?.[0]?.path
  const full = file ? path.join(process.cwd(), file) : undefined
  const source = full && fs.existsSync(full) ? fs.readFileSync(full, "utf8") : ""
  const facts = item?.type === "registry:ui" && source
    ? getComponentFacts(source, item)
    : undefined

  return {
    file,
    lines: source ? source.trimEnd().split("\n").length : 0,
    parts: facts?.parts.length,
    variantGroups: facts
      ? Object.values(facts.variants).flatMap((groups) => Object.keys(groups))
      : [],
    dependencies: [...new Set((item?.dependencies ?? []).map(packageName))].sort(),
    examples: items.filter(
      (entry) =>
        entry.type === "registry:example" &&
        entry.files?.[0]?.path.startsWith(`components/examples/${slug}/`)
    ).length,
    blocks: getBlocksUsing(slug).length,
    totalBlocks: proBlocks.length,
    updated: file ? isoDate(sourcesDate([file])) : undefined,
  }
}

type EntryStats = ReturnType<typeof getEntryStats>

export { getEntryStats, type EntryStats }
