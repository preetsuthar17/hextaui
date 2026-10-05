import * as React from "react"

type PaginationItemData =
  | { type: "page"; page: number }
  | { type: "ellipsis"; position: "start" | "end" }

type UsePaginationOptions = {
  page?: number
  count: number
  siblings?: number
  boundaries?: number
}

function clampInt(value: unknown, fallback: number, min: number, max: number) {
  const number = Math.floor(Number(value))
  if (!Number.isFinite(number)) {
    return fallback
  }
  return Math.min(max, Math.max(min, number))
}

function range(start: number, end: number) {
  const pages: number[] = []
  for (let page = start; page <= end; page++) {
    pages.push(page)
  }
  return pages
}

function usePagination({
  page,
  count,
  siblings = 1,
  boundaries = 1,
}: UsePaginationOptions) {
  const total = clampInt(count, 0, 0, Number.MAX_SAFE_INTEGER)
  const current = total === 0 ? 0 : clampInt(page, 1, 1, total)
  const siblingCount = clampInt(siblings, 1, 0, 10)
  const boundaryCount = clampInt(boundaries, 1, 0, 10)

  const items = React.useMemo<PaginationItemData[]>(() => {
    if (total === 0) {
      return []
    }
    const start = range(1, Math.min(boundaryCount, total))
    const end = range(
      Math.max(total - boundaryCount + 1, boundaryCount + 1),
      total
    )
    const siblingsStart = Math.max(
      Math.min(
        current - siblingCount,
        total - boundaryCount - siblingCount * 2 - 1
      ),
      boundaryCount + 2
    )
    const siblingsEnd = Math.min(
      Math.max(current + siblingCount, boundaryCount + siblingCount * 2 + 2),
      end.length > 0 ? end[0] - 2 : total - 1
    )
    const pages: (number | "start" | "end")[] = [
      ...start,
      ...(siblingsStart > boundaryCount + 2
        ? (["start"] as const)
        : boundaryCount + 1 < total - boundaryCount
          ? [boundaryCount + 1]
          : []),
      ...range(siblingsStart, siblingsEnd),
      ...(siblingsEnd < total - boundaryCount - 1
        ? (["end"] as const)
        : total - boundaryCount > boundaryCount
          ? [total - boundaryCount]
          : []),
      ...end,
    ]
    const seen = new Set<number | string>()
    return pages
      .filter((item) => {
        if (seen.has(item)) {
          return false
        }
        seen.add(item)
        return typeof item === "string" || (item >= 1 && item <= total)
      })
      .map((item) =>
        typeof item === "string"
          ? { type: "ellipsis", position: item }
          : { type: "page", page: item }
      )
  }, [total, current, siblingCount, boundaryCount])

  return {
    page: current,
    count: total,
    items,
    hasPrevious: current > 1,
    hasNext: current < total,
  }
}

export { usePagination }
export type { PaginationItemData, UsePaginationOptions }
