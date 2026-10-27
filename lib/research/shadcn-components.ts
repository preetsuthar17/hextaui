import {
  compareValues,
  countBands,
  formatNumber,
  formatPercent,
  hasSample,
  joinList,
  median,
  minimumSample,
  plural,
  share,
  tally,
  type Band,
  type Share,
} from "@/lib/research/stats"
import {
  formatDate,
  type Finding,
  type Study,
  type StudyTable,
} from "@/lib/research/study"

type ShadcnRow = {
  name: string
  title: string
  parts: string[]
  variantGroups: number
  registryDependencies: string[]
  lines: number
}

type ShadcnMeta = {
  fetched: string
  style: string
  source: string
  hrefFor?: (name: string) => string | undefined
}

const slug = "shadcn-ui-components"

const sizeBands: Band[] = [
  { label: "Under 50 lines", min: 0, max: 50 },
  { label: "50–99 lines", min: 50, max: 100 },
  { label: "100–199 lines", min: 100, max: 200 },
  { label: "200–399 lines", min: 200, max: 400 },
  { label: "400 lines or more", min: 400 },
]

const partBands: Band[] = [
  { label: "1 part", min: 1, max: 2 },
  { label: "2–4 parts", min: 2, max: 5 },
  { label: "5–9 parts", min: 5, max: 10 },
  { label: "10 parts or more", min: 10 },
]

function ofThe(value: Share, noun: string) {
  return `${formatNumber(value.count)} of the ${formatNumber(value.total)} ${noun} (${formatPercent(value)})`
}

function cleanRows(rows: ShadcnRow[]) {
  const seen = new Set<string>()
  const kept: ShadcnRow[] = []
  const excluded: { row: ShadcnRow; reason: string }[] = []
  for (const row of rows) {
    if (seen.has(row.name)) {
      excluded.push({ row, reason: "a duplicate of another registry item" })
      continue
    }
    seen.add(row.name)
    if (row.lines <= 1) {
      excluded.push({ row, reason: "it ships no source code in this style" })
    } else if (row.parts.length === 0) {
      excluded.push({
        row,
        reason:
          "its source exports no function components the parser can read (a re-export or an arrow-function wrapper)",
      })
    } else {
      kept.push(row)
    }
  }
  return { kept, excluded }
}

function computeShadcnStudy(rows: ShadcnRow[], meta: ShadcnMeta): Study {
  const { kept, excluded } = cleanRows(rows)
  const n = kept.length
  const listed = new Set(rows.map((row) => row.name)).size
  const date = formatDate(meta.fetched)
  const month = formatDate(meta.fetched, true)
  const lines = kept.map((row) => row.lines)
  const medianLines = median(lines)
  const totalLines = lines.reduce((sum, value) => sum + value, 0)
  const bySize = [...kept].sort(
    (a, b) => b.lines - a.lines || a.name.localeCompare(b.name)
  )
  const withVariants = kept.filter((row) => row.variantGroups > 0)
  const withDependencies = kept.filter(
    (row) => row.registryDependencies.length > 0
  )
  const standalone = kept.filter(
    (row) => row.registryDependencies.length === 0
  )
  const reused = tally(kept.map((row) => row.registryDependencies))
  const titles = new Map(rows.map((row) => [row.name, row.title]))
  const titleOf = (name: string) => titles.get(name) ?? name
  const partCounts = kept.map((row) => row.parts.length)
  const medianParts = median(partCounts)
  const single = share(partCounts.filter((count) => count === 1).length, n)
  const many = share(partCounts.filter((count) => count >= 10).length, n)
  const long = share(lines.filter((value) => value >= 200).length, n)
  const variantShare = share(withVariants.length, n)
  const dependencyShare = share(withDependencies.length, n)

  const findings: Finding[] = []
  const skipped: string[] = []
  const all = `Denominator: all ${n} analyzed components.`

  if (n < minimumSample) {
    return emptyStudy(meta, n, listed)
  }

  findings.push({
    id: "median-size",
    text: `The median shadcn/ui component is ${formatNumber(medianLines)} lines of source code, measured across ${n} components in the ${meta.style} style; together they come to ${formatNumber(totalLines)} lines.`,
    basis: all,
  })

  const [first, second, third] = bySize
  findings.push({
    id: "largest-components",
    text: `${first.title} is the largest shadcn/ui component at ${formatNumber(first.lines)} lines, followed by ${second.title} (${formatNumber(second.lines)}) and ${third.title} (${formatNumber(third.lines)}). ${ofThe(long, "components")} are 200 lines or longer.`,
    basis: all,
  })

  findings.push({
    id: "cva-variants",
    text: `${ofThe(variantShare, "shadcn/ui components")} define style variants with class-variance-authority (cva); the other ${n - withVariants.length} have no cva variants.`,
    basis: all,
  })

  findings.push({
    id: "registry-dependencies",
    text: `${ofThe(dependencyShare, "shadcn/ui components")} install at least one other shadcn/ui component as a registry dependency; the other ${standalone.length} stand alone.`,
    basis: all,
  })

  const top = reused[0]
  if (top && top.count >= 2) {
    const ties = reused.filter((item) => item.count === top.count)
    const next = reused.find((item) => item.count < top.count)
    const names = joinList(ties.map((item) => titleOf(item.name)))
    findings.push({
      id: "most-reused",
      text: `${names} ${ties.length === 1 ? "is the most reused building block" : "are the most reused building blocks"}: ${ofThe(share(top.count, n), "components")} depend on ${ties.length === 1 ? "it" : "each"}${next ? `, followed by ${titleOf(next.name)} (${next.count})` : ""}.`,
      basis: `${all} A component counts once per dependency it lists.`,
    })
  }

  findings.push({
    id: "parts-per-component",
    text: `The median shadcn/ui component exports ${plural(medianParts, "part")}; ${ofThe(single, "components")} export a single part and ${formatNumber(many.count)} (${formatPercent(many)}) export 10 or more.`,
    basis: `${all} A part is an exported function component.`,
  })

  if (hasSample(withDependencies.length, standalone.length)) {
    const a = median(withDependencies.map((row) => row.lines))
    const b = median(standalone.map((row) => row.lines))
    const tail = `a median of ${formatNumber(a)} lines for the ${withDependencies.length} that do, against ${formatNumber(b)} for the ${standalone.length} that stand alone`
    const comparison = compareValues(a, b)
    findings.push({
      id: "dependencies-and-size",
      text:
        comparison === "same"
          ? `Components that build on other shadcn/ui components are about the same size as those that don't: ${tail.replace("against", "and")}.`
          : `Components that build on other shadcn/ui components are ${comparison === "higher" ? "larger" : "smaller"}: ${tail}.`,
      basis: `Two groups: ${withDependencies.length} components with registry dependencies and ${standalone.length} without. Differences under 10% are reported as about the same.`,
    })
  } else {
    skipped.push(
      `Size of components with and without registry dependencies: one group has fewer than ${minimumSample} components (${withDependencies.length} with, ${standalone.length} without).`
    )
  }

  if (!hasSample(withVariants.length, n - withVariants.length)) {
    skipped.push(
      `Size of components with and without cva variants: only ${Math.min(withVariants.length, n - withVariants.length)} components are in the smaller group, below the ${minimumSample}-row minimum.`
    )
  }

  const tables: StudyTable[] = [
    {
      id: "by-size",
      title: "Components by size",
      description: `Lines of source code per component. Share of all ${n} analyzed components.`,
      columns: ["Lines of source", "Components", "Share"],
      numeric: [1, 2],
      rows: countBands(lines, sizeBands).map((row) => [
        row.band.label,
        formatNumber(row.count),
        formatPercent(row),
      ]),
    },
    {
      id: "by-parts",
      title: "Components by number of parts",
      description: `Exported function components per registry item. Share of all ${n} analyzed components.`,
      columns: ["Exported parts", "Components", "Share"],
      numeric: [1, 2],
      rows: countBands(partCounts, partBands).map((row) => [
        row.band.label,
        formatNumber(row.count),
        formatPercent(row),
      ]),
    },
    {
      id: "most-reused",
      title: "Most reused components",
      description: `How many of the ${n} analyzed components list each one as a registry dependency.`,
      columns: ["Component", "Components that depend on it", "Share"],
      numeric: [1, 2],
      rows: reused.map((item) => [
        titleOf(item.name),
        formatNumber(item.count),
        formatPercent(share(item.count, n)),
      ]),
    },
    {
      id: "all-components",
      title: "Every component",
      description: "Ordered by lines of source code, largest first.",
      columns: [
        "Component",
        "Lines",
        "Parts",
        "cva variant groups",
        "Registry dependencies",
      ],
      numeric: [1, 2, 3],
      rows: bySize.map((row) => [
        row.title,
        formatNumber(row.lines),
        formatNumber(row.parts.length),
        formatNumber(row.variantGroups),
        row.registryDependencies.length
          ? row.registryDependencies.map(titleOf).join(", ")
          : "None",
      ]),
    },
  ]

  const methodology = [
    `Source: the shadcn/ui registry index (https://ui.shadcn.com/r/index.json). Every item of type registry:ui, ${listed} in total, was fetched from ${meta.source}/<name>.json on ${date}.`,
    `Included: ${n} of the ${listed} items. Excluded: ${
      excluded.length
        ? excluded
            .map(({ row, reason }) => `${row.title}, because ${reason}`)
            .join("; ")
        : "none"
    }.`,
    "Lines: every line of the item's published files joined together, trailing blank lines removed. Comments and blank lines inside the file count.",
    "Parts: exported functions whose names start with a capital letter. Components written as arrow functions are not counted.",
    "cva variant groups: keys of the variants object in each cva() call. Registry dependencies: the item's registryDependencies list.",
    `Not reported: npm dependencies, because the ${meta.style} style declares shared packages such as @base-ui/react once for the whole style rather than on every item.`,
    `One style only: the ${meta.style} style, which is built on Base UI. Radix-based styles may differ in size.`,
    "Every value is computed from published code; none is entered by hand or by users.",
    "Refreshed when the snapshot is re-fetched with pnpm shadcn:snapshot. The date on this page is the fetch date.",
    "Percentages are rounded to the nearest whole number, so a table can add up to 99% or 101%. A median of an even count is the mean of the middle two values.",
    `A finding that compares two groups needs at least ${minimumSample} components in each group.`,
  ]

  const variantNames = joinList(
    withVariants
      .map((row) => row.title)
      .sort((a, b) => a.localeCompare(b))
      .slice(0, 5)
  )

  const questions = [
    {
      id: "how-many-components",
      question: "How many components does shadcn/ui have?",
      answer: `The shadcn/ui registry listed ${listed} UI components (items of type registry:ui) on ${date}. HextaUI fetched every one from the ${meta.style} style and measured the ${n} that ship readable component source.`,
    },
    {
      id: "largest-component",
      question: "What is the largest shadcn/ui component?",
      answer: `${first.title} is the largest shadcn/ui component at ${formatNumber(first.lines)} lines of source code in the ${meta.style} style, measured on ${date}. The median component is ${formatNumber(medianLines)} lines.`,
    },
    {
      id: "typical-size",
      question: "How many lines of code is a typical shadcn/ui component?",
      answer: `The median shadcn/ui component is ${formatNumber(medianLines)} lines of source code, across ${n} components in the ${meta.style} style measured on ${date}. ${ofThe(long, "components")} are 200 lines or longer.`,
    },
    {
      id: "cva-variants",
      question: "How many shadcn/ui components use cva variants?",
      answer: `${ofThe(variantShare, "shadcn/ui components")} define variants with class-variance-authority (cva), measured on ${date}. They include ${variantNames}.`,
    },
    ...(top && top.count >= 2
      ? [
          {
            id: "most-reused",
            question:
              "Which shadcn/ui component do other components depend on most?",
            answer: `${titleOf(top.name)}. ${ofThe(share(top.count, n), "shadcn/ui components")} list it as a registry dependency, measured on ${date}.`,
          },
        ]
      : []),
  ]

  const year = meta.fetched.slice(0, 4)

  return {
    slug,
    title: `shadcn/ui Component Statistics ${year}: ${n} Analyzed`,
    summary: `${n} shadcn/ui components measured from source: median ${formatNumber(medianLines)} lines, ${formatPercent(variantShare)} use cva variants, ${formatPercent(dependencyShare)} depend on another component${top ? `, ${titleOf(top.name)} is the most reused` : ""}.`,
    description: `${n} shadcn/ui components measured from their source on ${date}: median ${formatNumber(medianLines)} lines, ${variantShare.count} (${formatPercent(variantShare)}) use cva variants, ${first.title} is the largest at ${formatNumber(first.lines)} lines.`,
    intro: `How big shadcn/ui components are, how many use variants and which ones the others are built from, measured from the published source of ${n} components on ${date}.`,
    updated: meta.fetched,
    sample: n,
    unit: "components",
    dataset: {
      name: `shadcn/ui component source statistics (${meta.style}, ${month})`,
      description: `Lines of code, exported parts, cva variant groups and registry dependencies for ${n} shadcn/ui components in the ${meta.style} style, read from the public shadcn/ui registry on ${date}.`,
      variables: [
        "Lines of source code",
        "Exported parts",
        "cva variant groups",
        "Registry dependencies",
      ],
      technique:
        "Static analysis of each component's published registry source: line count, exported capitalized functions, keys of cva() variants and the registryDependencies field.",
      source: { href: "https://ui.shadcn.com/r/index.json", title: "shadcn/ui registry" },
    },
    findings,
    skipped,
    tables,
    methodology,
    questions,
    related: [
      { href: "/compare/shadcn-ui", title: "HextaUI vs shadcn/ui" },
      { href: "/components", title: "HextaUI components" },
    ],
  }
}

function emptyStudy(meta: ShadcnMeta, n: number, listed: number): Study {
  return {
    slug,
    title: `shadcn/ui Component Statistics ${meta.fetched.slice(0, 4)}: ${n} Analyzed`,
    summary: `Too few components to report (${n} of ${listed}).`,
    description: `Too few shadcn/ui components could be measured to report statistics (${n} of ${listed}).`,
    intro: `Fewer than ${minimumSample} components could be measured, so this page reports no findings.`,
    updated: meta.fetched,
    sample: n,
    unit: "components",
    dataset: {
      name: "shadcn/ui component source statistics",
      description: "Not enough data.",
      variables: [],
      technique: "Static analysis of published registry source.",
      source: { href: "https://ui.shadcn.com/r/index.json", title: "shadcn/ui registry" },
    },
    findings: [],
    skipped: [`Every finding: only ${n} components could be measured.`],
    tables: [],
    methodology: [],
    questions: [],
    related: [],
  }
}

export { computeShadcnStudy, sizeBands, partBands, type ShadcnMeta, type ShadcnRow }
