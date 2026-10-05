import { describe, expect, it } from "vitest"

import {
  docsComponents,
  docsHooks,
  docsKeywords,
  docsUtilities,
} from "@/lib/docs"
import {
  createDocsSearch,
  packDocsSearchIndex,
  unpackDocsSearchIndex,
  type DocsSearchDocument,
  type DocsSearchIndex,
} from "@/lib/docs-search-query"

const pages: DocsSearchDocument[] = [
  ...docsComponents.map((entry) => ({ ...entry, kind: "component" as const })),
  ...docsHooks.map((entry) => ({ ...entry, kind: "hook" as const })),
  ...docsUtilities.map((entry) => ({ ...entry, kind: "utility" as const })),
].map((entry) => ({
  id: entry.slug,
  title: entry.name,
  kind: entry.kind,
  keywords: docsKeywords[entry.slug],
  text: entry.description,
}))

const records: DocsSearchDocument[] = [
  {
    id: "accordion#multiple",
    title: "Multiple",
    kind: "example",
    page: "Accordion",
    trail: ["Examples"],
    text: "Set multiple to let more than one item stay open.",
  },
  {
    id: "accordion#accordion-prop",
    title: "onValueChange",
    kind: "prop",
    page: "Accordion",
    trail: ["Accordion"],
    detail: "(value: string[]) => void",
  },
  {
    id: "tabs#keyboard",
    title: "Keyboard",
    kind: "section",
    page: "Tabs",
    text: "ArrowRight Moves focus to the next tab. Home Moves to the first tab.",
  },
]

const search = createDocsSearch([...pages, ...records])

function top(query: string) {
  return search(query)[0]?.document.id
}

describe("createDocsSearch", () => {
  it("returns nothing for an empty or symbol-only query", () => {
    expect(search("")).toEqual([])
    expect(search("  -- ")).toEqual([])
  })

  it("ranks an exact title first", () => {
    expect(top("dialog")).toBe("dialog")
    expect(top("Button")).toBe("button")
  })

  it("matches prefixes while typing", () => {
    expect(top("acc")).toBe("accordion")
    expect(top("tool")).toBe("tooltip")
  })

  it("finds components by synonym", () => {
    expect(top("modal")).toBe("dialog")
    expect(top("loader")).toBe("spinner")
    expect(top("snackbar")).toBe("toast")
  })

  it("tolerates typos", () => {
    expect(top("acordion")).toBe("accordion")
    expect(top("dailog")).toBe("dialog")
    expect(top("tooltp")).toBe("tooltip")
  })

  it("ignores separators and casing in names", () => {
    expect(top("datepicker")).toBe("date-picker")
    expect(top("date picker")).toBe("date-picker")
    expect(top("usepagination")).toBe("use-pagination")
    expect(top("use pagination")).toBe("use-pagination")
  })

  it("narrows to a section when the page name comes along", () => {
    expect(top("accordion multiple")).toBe("accordion#multiple")
    expect(top("tabs keyboard")).toBe("tabs#keyboard")
  })

  it("finds props by their camelCase name", () => {
    expect(top("onValueChange")).toBe("accordion#accordion-prop")
    expect(top("on value change")).toBe("accordion#accordion-prop")
  })

  it("requires every word to match", () => {
    expect(search("accordion zzzz")).toEqual([])
  })

  it("searches section text", () => {
    expect(search("arrowright").map((result) => result.document.id)).toContain(
      "tabs#keyboard"
    )
  })
})

describe("packDocsSearchIndex", () => {
  it("round-trips records", () => {
    const index: DocsSearchIndex = {
      installable: ["accordion"],
      records: [
        {
          href: "/docs#principles",
          page: "",
          title: "Principles",
          kind: "section",
          trail: [],
          text: "Neutral surfaces.",
        },
        {
          href: "/docs/accordion#accordion",
          page: "accordion",
          title: "multiple",
          kind: "prop",
          trail: ["Accordion"],
          type: "boolean",
          default: "false",
        },
        {
          href: "/docs/accordion#accordionitem",
          page: "accordion",
          title: "data-open",
          kind: "attribute",
          trail: ["AccordionItem"],
        },
      ],
    }
    expect(
      unpackDocsSearchIndex(
        JSON.parse(JSON.stringify(packDocsSearchIndex(index)))
      )
    ).toEqual(index)
  })
})
