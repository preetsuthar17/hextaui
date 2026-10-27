type Share = { count: number; total: number; percent: number }

type Band = { label: string; min: number; max?: number }

type Comparison = "higher" | "lower" | "same"

const minimumSample = 20
const sameShareGap = 5
const sameRatioGap = 0.1

function share(count: number, total: number): Share {
  if (total <= 0) return { count, total, percent: 0 }
  return { count, total, percent: Math.round((count / total) * 100) }
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(
    value
  )
}

function formatPercent({ count, percent }: Share) {
  if (count > 0 && percent === 0) return "under 1%"
  return `${percent}%`
}

function formatShare(value: Share) {
  return `${formatNumber(value.count)} of ${formatNumber(value.total)} (${formatPercent(value)})`
}

function median(values: number[]) {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2
}

function compareShares(a: Share, b: Share): Comparison {
  const gap = a.percent - b.percent
  if (Math.abs(gap) < sameShareGap) return "same"
  return gap > 0 ? "higher" : "lower"
}

function compareValues(a: number, b: number): Comparison {
  const base = Math.max(Math.abs(a), Math.abs(b))
  if (base === 0 || Math.abs(a - b) / base < sameRatioGap) return "same"
  return a > b ? "higher" : "lower"
}

function hasSample(...counts: number[]) {
  return counts.every((count) => count >= minimumSample)
}

function inBand(value: number, band: Band) {
  return value >= band.min && (band.max === undefined || value < band.max)
}

function countBands(values: number[], bands: Band[]) {
  return bands.map((band) => ({
    band,
    ...share(values.filter((value) => inBand(value, band)).length, values.length),
  }))
}

function joinList(items: string[]) {
  return new Intl.ListFormat("en-GB", { type: "conjunction" }).format(items)
}

function plural(count: number, one: string, many = `${one}s`) {
  return `${formatNumber(count)} ${count === 1 ? one : many}`
}

function tally(lists: string[][]) {
  const counts = new Map<string, number>()
  for (const list of lists) {
    for (const item of new Set(list)) {
      counts.set(item, (counts.get(item) ?? 0) + 1)
    }
  }
  return [...counts]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

export {
  compareShares,
  compareValues,
  countBands,
  formatNumber,
  formatPercent,
  formatShare,
  hasSample,
  inBand,
  joinList,
  median,
  minimumSample,
  plural,
  share,
  tally,
  type Band,
  type Comparison,
  type Share,
}
