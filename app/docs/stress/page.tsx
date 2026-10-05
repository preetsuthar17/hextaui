import type { Metadata } from "next"

import { DocsCodeBlock } from "@/components/docs/docs-code-block"
import { DocsSection } from "@/components/docs/docs-content"
import { DocsPage } from "@/components/docs/docs-page"

import { StressDemos } from "./stress-demos"

const columnsCode = `"use client"

import { createColumnHelper } from "@tanstack/react-table"

import { type DataTableFeatures } from "./data-table-features"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

// Use \`accessor\` for data columns and \`display\` for columns without data, like row actions and selection checkboxes.
const columnHelper = createColumnHelper<DataTableFeatures, Payment>()

export const columns = columnHelper.columns([
  columnHelper.accessor("status", {
    header: "Status",
  }),
  columnHelper.accessor("email", {
    header: "Email",
  }),
  columnHelper.accessor("amount", {
    header: "Amount",
  }),
])`

export const metadata: Metadata = {
  title: "Stress",
  robots: { index: false, follow: false },
}

export default function Page() {
  return (
    <DocsPage
      href="/docs/stress"
      title="Stress"
      description="Every component with worst-case data: unbroken strings, long emails and URLs, emoji, RTL, CJK, empty labels and huge lists."
    >
      <StressDemos />
      <DocsSection title="Code block">
        <DocsCodeBlock
          code={columnsCode}
          title="app/payments/columns.tsx"
          highlightLines="3,5,16-17,19-29"
          lineNumbers
          collapsible={false}
        />
        <DocsCodeBlock
          code={columnsCode}
          highlightLines={[3, 5, 16, 17]}
          collapsible={false}
        />
      </DocsSection>
    </DocsPage>
  )
}
