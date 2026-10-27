import {
  compareValues,
  countBands,
  formatNumber,
  formatPercent,
  hasSample,
  joinList,
  median,
  minimumSample,
  share,
  type Band,
  type Share,
} from "@/lib/research/stats"
import {
  formatDate,
  type Finding,
  type Study,
  type StudyTable,
} from "@/lib/research/study"

type BlockRow = {
  name: string
  title: string
  category: string
  categoryTitle: string
  components: string[]
}

type LibraryComponent = {
  slug: string
  name: string
  kind?: string
  kindLabel?: string
}

type BlockMeta = { updated: string }

const slug = "ui-component-usage"
const minimumKindSize = 3

const perBlockBands: Band[] = [
  { label: "1–4 components", min: 1, max: 5 },
  { label: "5–9 components", min: 5, max: 10 },
  { label: "10–14 components", min: 10, max: 15 },
  { label: "15 components or more", min: 15 },
]

function ofThe(value: Share, noun: string) {
  return `${formatNumber(value.count)} of the ${formatNumber(value.total)} ${noun} (${formatPercent(value)})`
}

function inSentence(title: string) {
  return /^[A-Z]{2,}\b/.test(title) ? title : title.toLowerCase()
}

function cleanRows(rows: BlockRow[], library: LibraryComponent[]) {
  const known = new Set(library.map((component) => component.slug))
  const seen = new Set<string>()
  const kept: BlockRow[] = []
  const excluded: { row: BlockRow; reason: string }[] = []
  for (const row of rows) {
    if (seen.has(row.name)) {
      excluded.push({ row, reason: "a duplicate block name" })
      continue
    }
    seen.add(row.name)
    const components = [...new Set(row.components)].filter((name) =>
      known.has(name)
    )
    if (components.length === 0) {
      excluded.push({
        row,
        reason: "none of its own source files import a HextaUI component",
      })
      continue
    }
    kept.push({ ...row, components })
  }
  return { kept, excluded }
}

function computeBlockStudy(
  rows: BlockRow[],
  library: LibraryComponent[],
  meta: BlockMeta
): Study {
  const { kept, excluded } = cleanRows(rows, library)
  const n = kept.length
  const date = formatDate(meta.updated)
  const year = meta.updated.slice(0, 4)
  const nameOf = new Map(library.map((item) => [item.slug, item.name]))
  const usage = library
    .map((component) => ({
      ...component,
      count: kept.filter((row) => row.components.includes(component.slug))
        .length,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
  const used = usage.filter((item) => item.count > 0)
  const unused = usage.filter((item) => item.count === 0)
  const perBlock = kept.map((row) => row.components.length)
  const medianPerBlock = median(perBlock)
  const fewest = Math.min(...perBlock)
  const most = Math.max(...perBlock)
  const fewestBlocks = kept.filter((row) => row.components.length === fewest)
  const mostBlocks = kept.filter((row) => row.components.length === most)

  const findings: Finding[] = []
  const skipped: string[] = []
  const all = `Denominator: all ${n} blocks.`

  if (n < minimumSample) {
    return {
      ...emptyStudy(meta, n),
      skipped: [`Every finding: only ${n} blocks.`],
    }
  }

  const [first, second, third] = used
  findings.push({
    id: "most-used",
    text: `${first.name} is the most used UI component: ${ofThe(share(first.count, n), "HextaUI Pro blocks")} import it, followed by ${second.name} (${second.count}) and ${third.name} (${third.count}).`,
    basis: all,
  })

  findings.push({
    id: "components-per-block",
    text: `The median HextaUI Pro block imports ${formatNumber(medianPerBlock)} different UI components, from ${fewest} in ${joinList(fewestBlocks.map((row) => row.title))} to ${most} in ${joinList(mostBlocks.map((row) => row.title))}.`,
    basis: `${all} Each component counts once per block.`,
  })

  const coverage = share(used.length, library.length)
  findings.push({
    id: "library-coverage",
    text: unused.length
      ? `The ${n} blocks use ${ofThe(coverage, "HextaUI components")}; ${unused.length} are never imported directly by a block: ${joinList(unused.map((item) => item.name))}.`
      : `The ${n} blocks use all ${library.length} HextaUI components at least once.`,
    basis: `Denominator: all ${library.length} components in the HextaUI library.`,
  })

  const kinds = [
    ...new Map(
      library
        .filter(
          (item) =>
            item.kind &&
            item.kindLabel &&
            library.filter((other) => other.kind === item.kind).length >=
              minimumKindSize
        )
        .map((item) => [item.kind as string, item.kindLabel as string])
    ),
  ].map(([kind, label]) => {
    const members = new Set(
      library.filter((item) => item.kind === kind).map((item) => item.slug)
    )
    return {
      kind,
      label,
      members: members.size,
      ...share(
        kept.filter((row) => row.components.some((name) => members.has(name)))
          .length,
        n
      ),
    }
  })
  const byKind = [...kinds].sort(
    (a, b) => b.count - a.count || a.label.localeCompare(b.label)
  )
  const nonAction = byKind.filter((item) => item.kind !== "actions")
  if (nonAction.length >= 2) {
    const top = nonAction[0]
    const low = nonAction[nonAction.length - 1]
    findings.push({
      id: "component-kinds",
      text: `Apart from buttons, ${top.label} are the most common kind of component: ${ofThe(share(top.count, n), "blocks")} use at least one. ${low.label.charAt(0).toUpperCase()}${low.label.slice(1)} are the least common, in ${formatNumber(low.count)} (${formatPercent(low)}).`,
      basis: `${all} Kinds follow the categories in the HextaUI docs, leaving out kinds with fewer than ${minimumKindSize} components; a block counts once per kind.`,
    })
  }

  const categories = [...new Set(kept.map((row) => row.category))].map(
    (category) => {
      const members = kept.filter((row) => row.category === category)
      return {
        category,
        title: members[0].categoryTitle,
        count: members.length,
        median: median(members.map((row) => row.components.length)),
      }
    }
  )
  const largest = [...categories].sort((a, b) => b.count - a.count)[0]
  const rest = kept.filter((row) => row.category !== largest?.category)
  if (largest && hasSample(largest.count, rest.length)) {
    const b = median(rest.map((row) => row.components.length))
    const comparison = compareValues(largest.median, b)
    const tail = `a median of ${formatNumber(largest.median)} for the ${largest.count} ${inSentence(largest.title)} blocks, against ${formatNumber(b)} for the other ${rest.length}`
    findings.push({
      id: "category-comparison",
      text:
        comparison === "same"
          ? `${largest.title} blocks import about as many components as the rest: ${tail.replace("against", "and")}.`
          : `${largest.title} blocks import ${comparison === "higher" ? "more" : "fewer"} components than the rest: ${tail}.`,
      basis: `Two groups: ${largest.count} ${inSentence(largest.title)} blocks and ${rest.length} others. Differences under 10% are reported as about the same.`,
    })
  } else if (largest) {
    skipped.push(
      `${largest.title} blocks against the rest: one group has fewer than ${minimumSample} blocks.`
    )
  }
  const small = categories.filter((item) => item.count < minimumSample)
  if (small.length) {
    skipped.push(
      `Findings for single categories with fewer than ${minimumSample} blocks: ${joinList(small.map((item) => `${item.title} (${item.count})`))}. They appear in the tables only.`
    )
  }

  const tables: StudyTable[] = [
    {
      id: "component-ranking",
      title: "Every component, ranked by use",
      description: `How many of the ${n} blocks import each HextaUI component. Ties are listed A to Z.`,
      columns: ["Rank", "Component", "Blocks", "Share"],
      numeric: [0, 2, 3],
      rows: usage.map((item, index) => [
        String(index + 1),
        item.name,
        formatNumber(item.count),
        formatPercent(share(item.count, n)),
      ]),
    },
    {
      id: "by-kind",
      title: "Blocks by kind of component",
      description: `Share of all ${n} blocks that use at least one component of each kind.`,
      columns: ["Kind of component", "Components of this kind", "Blocks", "Share"],
      numeric: [1, 2, 3],
      rows: byKind.map((item) => [
        `${item.label.charAt(0).toUpperCase()}${item.label.slice(1)}`,
        formatNumber(item.members),
        formatNumber(item.count),
        formatPercent(item),
      ]),
    },
    {
      id: "by-category",
      title: "Blocks by category",
      description: `Categories with fewer than ${minimumSample} blocks are shown here but get no findings of their own.`,
      columns: ["Block category", "Blocks", "Median components per block"],
      numeric: [1, 2],
      rows: [...categories]
        .sort((a, b) => b.count - a.count || a.title.localeCompare(b.title))
        .map((item) => [
          item.title,
          formatNumber(item.count),
          formatNumber(item.median),
        ]),
    },
    {
      id: "components-per-block",
      title: "Blocks by number of components",
      description: `Share of all ${n} blocks.`,
      columns: ["Components imported", "Blocks", "Share"],
      numeric: [1, 2],
      rows: countBands(perBlock, perBlockBands).map((row) => [
        row.band.label,
        formatNumber(row.count),
        formatPercent(row),
      ]),
    },
    {
      id: "all-blocks",
      title: "Every block",
      description: "Ordered by the number of components imported, most first.",
      columns: ["Block", "Category", "Components", "Imports"],
      numeric: [2],
      rows: [...kept]
        .sort(
          (a, b) =>
            b.components.length - a.components.length ||
            a.title.localeCompare(b.title)
        )
        .map((row) => [
          row.title,
          row.categoryTitle,
          formatNumber(row.components.length),
          row.components.map((name) => nameOf.get(name) ?? name).join(", "),
        ]),
    },
  ]

  const methodology = [
    `Source: the ${rows.length} HextaUI Pro blocks in the block catalog on ${date}. The catalog is generated from each block's source code at build time.`,
    `Included: ${n} blocks. Excluded: ${
      excluded.length
        ? excluded.map(({ row, reason }) => `${row.title}, because ${reason}`).join("; ")
        : "none"
    }.`,
    `A block uses a component when one of its own source files imports it from components/ui. Demo files, usage examples and tests are not counted. A block whose other files import no component (an app assembled from other blocks, such as HextaAI) counts its entry file instead. A component reached only through another block counts for that other block.`,
    `The library is the ${library.length} components in the HextaUI docs. Hooks and utilities are not counted.`,
    "These are blocks written by one author for HextaUI Pro, not a sample of apps on the web. Read them as how one production block library is built.",
    "Every value is computed from code; none is entered by hand or by users.",
    "Refreshed on every site build. The date on this page is the last change to the Pro block sources.",
    "Percentages are rounded to the nearest whole number, so a table can add up to 99% or 101%. A median of an even count is the mean of the middle two values.",
    `A finding about a group of blocks needs at least ${minimumSample} blocks in each group.`,
  ]

  const questions = [
    {
      id: "most-used-component",
      question: "What is the most used UI component in HextaUI Pro blocks?",
      answer: `${first.name}. ${ofThe(share(first.count, n), "HextaUI Pro blocks")} import it, counted on ${date}. ${second.name} is second with ${second.count} blocks.`,
    },
    {
      id: "components-per-block",
      question: "How many UI components does a typical HextaUI Pro block use?",
      answer: `The median HextaUI Pro block imports ${formatNumber(medianPerBlock)} different UI components, counted across ${n} blocks on ${date}. The range is ${fewest} to ${most}.`,
    },
    {
      id: "unused-components",
      question: "Which HextaUI components are not used in any Pro block?",
      answer: unused.length
        ? `${joinList(unused.map((item) => item.name))}. These ${unused.length} of the ${library.length} HextaUI components are not imported directly by any of the ${n} Pro blocks, counted on ${date}.`
        : `None. All ${library.length} HextaUI components are imported by at least one of the ${n} Pro blocks, counted on ${date}.`,
    },
    {
      id: "how-usage-is-counted",
      question: "How is a component counted as used by a block?",
      answer:
        "A block uses a component when one of its own source files imports it from components/ui. Demo files, usage examples and tests are not counted, and a component reached only through another block counts for that other block. An app assembled from other blocks counts the components in its own entry file.",
    },
  ]

  return {
    slug,
    title: `UI Component Usage Statistics ${year}: ${n} Blocks Analyzed`,
    summary: `${n} HextaUI Pro blocks: ${first.name} is in ${formatPercent(share(first.count, n))}, the median block imports ${formatNumber(medianPerBlock)} components, ${used.length} of ${library.length} components are used.`,
    description: `Which UI components the ${n} HextaUI Pro React blocks import: ${first.name} in ${first.count} (${formatPercent(share(first.count, n))}), ${second.name} in ${second.count}, a median of ${formatNumber(medianPerBlock)} per block. Counted from source on ${date}.`,
    intro: `Which UI components product screens are built from, counted from the source of ${n} HextaUI Pro blocks (${joinList(categories.map((item) => `${item.count} ${inSentence(item.title)}`))}) on ${date}.`,
    updated: meta.updated,
    sample: n,
    unit: "blocks",
    dataset: {
      name: `HextaUI Pro block component usage (${formatDate(meta.updated, true)})`,
      description: `Which of the ${library.length} HextaUI components each of ${n} HextaUI Pro blocks imports, read from the blocks' source code on ${date}.`,
      variables: [
        "Components imported per block",
        "Blocks importing each component",
        "Block category",
      ],
      technique:
        "Static analysis of import statements from components/ui in each block's source files, excluding demo files, usage examples and tests.",
      source: { href: "/blocks", title: "HextaUI Pro blocks" },
    },
    findings,
    skipped,
    tables,
    methodology,
    questions,
    related: [
      { href: "/blocks", title: "HextaUI Pro blocks" },
      { href: "/components", title: "HextaUI components" },
    ],
  }
}

function emptyStudy(meta: BlockMeta, n: number): Study {
  return {
    slug,
    title: `UI Component Usage Statistics ${meta.updated.slice(0, 4)}: ${n} Blocks Analyzed`,
    summary: `Too few blocks to report (${n}).`,
    description: `Too few blocks to report component usage statistics (${n}).`,
    intro: `Fewer than ${minimumSample} blocks, so this page reports no findings.`,
    updated: meta.updated,
    sample: n,
    unit: "blocks",
    dataset: {
      name: "HextaUI Pro block component usage",
      description: "Not enough data.",
      variables: [],
      technique: "Static analysis of block imports.",
      source: { href: "/blocks", title: "HextaUI Pro blocks" },
    },
    findings: [],
    skipped: [],
    tables: [],
    methodology: [],
    questions: [],
    related: [],
  }
}

export {
  computeBlockStudy,
  perBlockBands,
  type BlockMeta,
  type BlockRow,
  type LibraryComponent,
}
