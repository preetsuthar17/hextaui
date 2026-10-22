import { describe, expect, it } from "vitest"

import {
  docsComponents,
  docsHooks,
  docsKeywords,
  docsUtilities,
} from "@/lib/docs"
import { blockKeywords } from "@/lib/pro/keywords"
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

const blocks: DocsSearchDocument[] = [
  [
    "cart",
    "Cart",
    "E-commerce",
    "Add to bag button, bag icon and cart drawer.",
  ],
  ["checkout", "Checkout", "E-commerce", "In progress."],
  ["payment", "Payment", "E-commerce", "The payment step of a checkout."],
  [
    "orders-table",
    "Orders Table",
    "E-commerce",
    "The merchant’s orders index.",
  ],
  [
    "order-detail",
    "Order Detail",
    "E-commerce",
    "The merchant’s page for one order.",
  ],
  ["refund", "Refund", "E-commerce", "A refund sheet for an order."],
  [
    "variant-picker",
    "Variant Picker",
    "E-commerce",
    "Color swatches and sizes.",
  ],
  ["product-card", "Product Card", "E-commerce", "The product tile for grids."],
  ["discount-builder", "Discount Builder", "E-commerce", "Create discounts."],
  ["save-bar", "Save Bar", "Settings", "A floating save bar."],
  [
    "agent-todos",
    "Agent Todos",
    "AI",
    "The plan an agent keeps while it works.",
  ],
  ["billing", "Billing", "Settings", "The plan and usage page."],
].map(([name, title, category, text]) => ({
  id: `blocks/${name}`,
  title,
  kind: "block" as const,
  keywords: [category, ...(blockKeywords[name] ?? [])],
  text,
}))

const blockRecords: DocsSearchDocument[] = [
  {
    id: "blocks/cart#cartdrawer:freeShippingThreshold",
    title: "freeShippingThreshold",
    kind: "prop",
    page: "Cart",
    trail: ["CartDrawer"],
    detail: "number",
    text: "Subtotal that unlocks free shipping.",
  },
  {
    id: "blocks/cart#cartdrawer",
    title: "CartDrawer",
    kind: "api",
    page: "Cart",
  },
]

const search = createDocsSearch([
  ...pages,
  ...records,
  ...blocks,
  ...blockRecords,
])

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

  it("ranks blocks by name", () => {
    expect(top("cart")).toBe("blocks/cart")
    expect(top("checkout")).toBe("blocks/checkout")
    expect(top("orders")).toBe("blocks/orders-table")
    expect(top("refund")).toBe("blocks/refund")
    expect(top("agent todos")).toBe("blocks/agent-todos")
    expect(top("billing")).toBe("blocks/billing")
    expect(top("discount")).toBe("blocks/discount-builder")
  })

  it("finds blocks by synonym", () => {
    expect(top("unsaved changes")).toBe("blocks/save-bar")
    expect(top("dynamic island")).toBe("blocks/save-bar")
    expect(top("coupon")).toBe("blocks/discount-builder")
    expect(top("basket")).toBe("blocks/cart")
    expect(top("order list")).toBe("blocks/orders-table")
    const purchase = search("purchase").map((result) => result.document.id)
    expect(purchase[0]).toBe("blocks/checkout")
  })

  it("finds block props by name and block", () => {
    expect(top("freeShipping")).toBe(
      "blocks/cart#cartdrawer:freeShippingThreshold"
    )
    expect(top("cart free shipping")).toBe(
      "blocks/cart#cartdrawer:freeShippingThreshold"
    )
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
        {
          href: "/blocks/cart#cartdrawer",
          page: "blocks/cart",
          title: "freeShippingThreshold",
          kind: "prop",
          trail: ["CartDrawer"],
          type: "number",
          text: "Subtotal that unlocks free shipping.",
        },
        {
          href: "/blocks/cart#with-a-page",
          page: "blocks/cart",
          title: "With a page",
          kind: "example",
          trail: ["Usage"],
        },
      ],
      blocks: [
        {
          name: "cart",
          title: "Cart",
          description: "Add to bag button and cart drawer.",
          category: "E-commerce",
          keywords: ["E-commerce", "bag"],
          text: "Cart is the add-to-bag flow of a store.",
        },
        {
          name: "prompt-input",
          title: "Prompt Input",
          description: "A chat composer.",
          category: "AI",
          keywords: [],
          free: true,
        },
      ],
    }
    expect(
      unpackDocsSearchIndex(
        JSON.parse(JSON.stringify(packDocsSearchIndex(index)))
      )
    ).toEqual(index)
  })

  it("stores block anchors relative to the block page", () => {
    const packed = packDocsSearchIndex({
      installable: [],
      records: [
        {
          href: "/blocks/refund#refundsheet",
          page: "blocks/refund",
          title: "RefundSheet",
          kind: "api",
          trail: [],
        },
      ],
    })
    expect(packed.pages).toEqual(["blocks/refund"])
    expect(packed.records[0]?.[3]).toBe("refundsheet")
    expect(packed.blocks).toBeUndefined()
  })
})
