import { describe, expect, it } from "vitest"

import { getStudies } from "@/lib/research"
import {
  computeBlockStudy,
  perBlockBands,
  type BlockRow,
  type LibraryComponent,
} from "@/lib/research/block-components"
import {
  computeShadcnStudy,
  partBands,
  sizeBands,
  type ShadcnRow,
} from "@/lib/research/shadcn-components"
import {
  compareShares,
  compareValues,
  countBands,
  inBand,
  median,
  minimumSample,
  share,
  type Band,
} from "@/lib/research/stats"
import { studyAnchors } from "@/lib/research/study"

const shadcnMeta = {
  fetched: "2026-10-26",
  style: "base-vega",
  source: "https://ui.shadcn.com/r/styles/base-vega",
}

function shadcnRow(index: number, overrides: Partial<ShadcnRow> = {}): ShadcnRow {
  return {
    name: `item-${index}`,
    title: `Item ${index}`,
    parts: ["Root"],
    variantGroups: 0,
    registryDependencies: [],
    lines: 100,
    ...overrides,
  }
}

function shadcnRows(dependent: number, standalone: number, sizes: [number, number]) {
  return [
    ...Array.from({ length: dependent }, (_, index) =>
      shadcnRow(index, { registryDependencies: ["button"], lines: sizes[0] })
    ),
    ...Array.from({ length: standalone }, (_, index) =>
      shadcnRow(dependent + index, { lines: sizes[1] })
    ),
  ]
}

const library: LibraryComponent[] = Array.from({ length: 30 }, (_, index) => ({
  slug: `c${index}`,
  name: `C${index}`,
  kind: index < 10 ? "forms" : index < 20 ? "overlays" : "layout",
  kindLabel: index < 10 ? "form controls" : index < 20 ? "overlays" : "layout components",
}))

function blockRows(store: number, other: number, sizes: [number, number]): BlockRow[] {
  const take = (count: number) => library.slice(0, count).map((item) => item.slug)
  return [
    ...Array.from({ length: store }, (_, index) => ({
      name: `store-${index}`,
      title: `Store ${index}`,
      category: "ecommerce",
      categoryTitle: "E-commerce",
      components: take(sizes[0]),
    })),
    ...Array.from({ length: other }, (_, index) => ({
      name: `ai-${index}`,
      title: `AI ${index}`,
      category: "ai",
      categoryTitle: "AI",
      components: take(sizes[1]),
    })),
  ]
}

function finding(text: string | undefined) {
  return text ?? ""
}

describe("stats helpers", () => {
  it("rounds shares and handles an empty denominator", () => {
    expect(share(566, 864)).toEqual({ count: 566, total: 864, percent: 66 })
    expect(share(3, 0).percent).toBe(0)
  })

  it("takes the middle value, or the mean of the middle two", () => {
    expect(median([3, 1, 2])).toBe(2)
    expect(median([1, 2, 3, 4])).toBe(2.5)
    expect(median([])).toBe(0)
  })

  it("treats small gaps as about the same", () => {
    expect(compareShares(share(50, 100), share(47, 100))).toBe("same")
    expect(compareShares(share(60, 100), share(40, 100))).toBe("higher")
    expect(compareShares(share(40, 100), share(60, 100))).toBe("lower")
    expect(compareValues(100, 95)).toBe("same")
    expect(compareValues(100, 50)).toBe("higher")
    expect(compareValues(50, 100)).toBe("lower")
  })
})

describe.each([
  ["size", sizeBands, 0],
  ["parts", partBands, 1],
  ["components per block", perBlockBands, 1],
] as [string, Band[], number][])("%s bands", (_, bands, start) => {
  it("never overlap and leave no gaps", () => {
    for (let value = start; value <= 2000; value += 1) {
      expect(
        bands.filter((band) => inBand(value, band)),
        String(value)
      ).toHaveLength(1)
    }
  })

  it("count every row exactly once", () => {
    const values = Array.from({ length: 500 }, (_, index) => start + index * 3)
    const counted = countBands(values, bands)
    expect(counted.reduce((sum, row) => sum + row.count, 0)).toBe(values.length)
  })
})

describe("computeShadcnStudy", () => {
  it("flips the size comparison with the data", () => {
    const larger = computeShadcnStudy(shadcnRows(20, 20, [300, 80]), shadcnMeta)
    const smaller = computeShadcnStudy(shadcnRows(20, 20, [80, 300]), shadcnMeta)
    const same = computeShadcnStudy(shadcnRows(20, 20, [100, 98]), shadcnMeta)
    const text = (study: typeof larger) =>
      finding(study.findings.find((item) => item.id === "dependencies-and-size")?.text)

    expect(text(larger)).toContain("are larger")
    expect(text(smaller)).toContain("are smaller")
    expect(text(same)).toContain("about the same size")
  })

  it("skips a comparison when one group is under the minimum", () => {
    const study = computeShadcnStudy(shadcnRows(5, 40, [300, 80]), shadcnMeta)
    expect(study.findings.map((item) => item.id)).not.toContain(
      "dependencies-and-size"
    )
    expect(study.skipped.join(" ")).toContain("registry dependencies")
  })

  it("reports nothing on thin data", () => {
    const study = computeShadcnStudy(
      shadcnRows(5, minimumSample - 6, [100, 100]),
      shadcnMeta
    )
    expect(study.findings).toEqual([])
    expect(study.questions).toEqual([])
  })

  it("drops duplicates, empty sources and unreadable components before counting", () => {
    const rows = [
      ...shadcnRows(10, 20, [100, 100]),
      shadcnRow(0),
      shadcnRow(98, { lines: 1, parts: [] }),
      shadcnRow(99, { parts: [] }),
    ]
    const study = computeShadcnStudy(rows, shadcnMeta)
    expect(study.sample).toBe(30)
    expect(study.methodology.join(" ")).toContain("Item 98")
    expect(study.methodology.join(" ")).toContain("Item 99")
  })
})

describe("computeBlockStudy", () => {
  it("flips the category comparison with the data", () => {
    const text = (rows: BlockRow[]) =>
      finding(
        computeBlockStudy(rows, library, { updated: "2026-10-22" }).findings.find(
          (item) => item.id === "category-comparison"
        )?.text
      )

    expect(text(blockRows(25, 20, [14, 6]))).toContain("import more components")
    expect(text(blockRows(25, 20, [6, 14]))).toContain("import fewer components")
    expect(text(blockRows(25, 20, [10, 10]))).toContain("about as many")
  })

  it("keeps small categories out of the findings", () => {
    const study = computeBlockStudy(blockRows(25, 12, [10, 6]), library, {
      updated: "2026-10-22",
    })
    expect(study.findings.map((item) => item.id)).not.toContain(
      "category-comparison"
    )
    expect(study.skipped.join(" ")).toContain("AI (12)")
  })

  it("reports nothing on thin data", () => {
    const study = computeBlockStudy(blockRows(10, 9, [5, 5]), library, {
      updated: "2026-10-22",
    })
    expect(study.findings).toEqual([])
  })
})

describe.each(getStudies().map((study) => [study.slug, study] as const))(
  "%s",
  (_, study) => {
    it("states 4 to 8 findings on a sample of at least the minimum", () => {
      expect(study.findings.length).toBeGreaterThanOrEqual(4)
      expect(study.findings.length).toBeLessThanOrEqual(8)
      expect(study.sample).toBeGreaterThanOrEqual(minimumSample)
      for (const item of study.findings) {
        expect(item.text, item.id).toMatch(/\d/)
        expect(item.basis, item.id).not.toBe("")
      }
    })

    it("gives every finding, table and answer a unique anchor", () => {
      const anchors = studyAnchors(study)
      expect(new Set(anchors).size).toBe(anchors.length)
      for (const anchor of anchors) expect(anchor).toMatch(/^[a-z0-9-]+$/)
    })

    it("has band tables whose shares add up to the sample", () => {
      for (const table of study.tables) {
        if (!["by-size", "by-parts", "components-per-block"].includes(table.id)) {
          continue
        }
        const total = table.rows.reduce((sum, row) => sum + Number(row[1]), 0)
        expect(total, table.id).toBe(study.sample)
        const percent = table.rows.reduce(
          (sum, row) => sum + Number.parseInt(row[2], 10),
          0
        )
        expect(Math.abs(percent - 100), table.id).toBeLessThanOrEqual(
          table.rows.length
        )
      }
    })

    it("keeps the title and description within search limits", () => {
      expect(study.title.length).toBeLessThanOrEqual(60)
      expect(study.title).toContain(study.updated.slice(0, 4))
      expect(study.title).toContain(String(study.sample))
      expect(study.description.length).toBeLessThanOrEqual(160)
    })
  }
)

describe("answers and findings share one calculation", () => {
  const [shadcn, blocks] = ["shadcn-ui-components", "ui-component-usage"].map(
    (slug) => getStudies().find((study) => study.slug === slug)
  )

  it("states the same largest component in the finding, the answer and the table", () => {
    const largest = shadcn?.tables.find((table) => table.id === "all-components")
      ?.rows[0]
    expect(largest).toBeDefined()
    const [name, lines] = largest ?? []
    const answer = shadcn?.questions.find((item) => item.id === "largest-component")
    const text = shadcn?.findings.find((item) => item.id === "largest-components")
    expect(answer?.answer).toContain(`${name} is the largest`)
    expect(answer?.answer).toContain(`${lines} lines`)
    expect(text?.text).toContain(`${name} is the largest`)
  })

  it("states the same top component count in the finding, the answer and the ranking", () => {
    const [, name, count] =
      blocks?.tables.find((table) => table.id === "component-ranking")?.rows[0] ??
      []
    const answer = blocks?.questions.find(
      (item) => item.id === "most-used-component"
    )
    const text = blocks?.findings.find((item) => item.id === "most-used")
    expect(answer?.answer).toContain(`${name}. ${count} of the`)
    expect(text?.text).toContain(`${name} is the most used`)
    expect(text?.text).toContain(`${count} of the`)
  })
})
