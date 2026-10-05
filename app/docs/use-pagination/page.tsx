import { DocsCodeBlock } from "@/components/docs/docs-code-block"
import { DocsComponentPage } from "@/components/docs/docs-component-page"
import {
  DocsCode,
  DocsList,
  DocsParagraph,
  DocsSection,
} from "@/components/docs/docs-content"
import { DocsExample } from "@/components/docs/docs-example"
import { DocsInstall } from "@/components/docs/docs-install"
import {
  DocsAttributesTable,
  DocsPropsTable,
} from "@/components/docs/docs-props-table"
import { UsePaginationDemo } from "@/components/examples/use-pagination/demo"
import { UsePaginationDots } from "@/components/examples/use-pagination/dots"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("use-pagination")

const importCode = `import { usePagination } from "@/hooks/use-pagination"`

const usageCode = `const { items, page, hasPrevious, hasNext } = usePagination({
  page: currentPage,
  count: totalPages,
})

items.map((item) =>
  item.type === "ellipsis" ? (
    <span key={item.position}>…</span>
  ) : (
    <a key={item.page} href={\`?page=\${item.page}\`}>{item.page}</a>
  )
)`

const shapeCode = `type PaginationItemData =
  | { type: "page"; page: number }
  | { type: "ellipsis"; position: "start" | "end" }`

const layoutCode = `count: 20, siblings: 1, boundaries: 1

page 1    1  2  3  4  5  …  20
page 6    1  …  5  6  7  …  20
page 20   1  …  16 17 18 19 20`

export default function Page() {
  return (
    <DocsComponentPage slug="use-pagination">
      <DocsExample file="use-pagination/demo">
        <UsePaginationDemo />
      </DocsExample>

      <DocsInstall dependencies={[]} files={["hooks/use-pagination.ts"]} />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          The hook only does the math. It returns the list of pages and ellipses
          to render and leaves the markup to you, which is how{" "}
          <DocsCode>Pagination</DocsCode> builds its links. Use it to build your
          own pager, like dots for a carousel or a page picker in a table
          footer.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="How it works">
        <DocsParagraph>
          The list always shows the first and last{" "}
          <DocsCode>boundaries</DocsCode> pages, and{" "}
          <DocsCode>siblings</DocsCode> pages on each side of the current one.
          An ellipsis fills any gap of two pages or more. A gap of exactly one
          page shows that page instead, because an ellipsis there would hide no
          more than it takes up.
        </DocsParagraph>
        <DocsCodeBlock code={layoutCode} lang="bash" />
        <DocsParagraph>
          Once there are enough pages, the list always has{" "}
          <DocsCode>2 × boundaries + 2 × siblings + 3</DocsCode> items. Near the
          ends, the window widens instead of shrinking. Because the length never
          changes, the pager keeps its width, and the next and previous buttons
          stay under the pointer as you click through.
        </DocsParagraph>
        <DocsList>
          <li>
            <DocsCode>count</DocsCode> and <DocsCode>page</DocsCode> are
            clamped: a page past the end becomes the last page, and anything
            that isn&apos;t a finite number falls back to the default.
          </li>
          <li>
            A <DocsCode>count</DocsCode> of 0 returns no items and a{" "}
            <DocsCode>page</DocsCode> of 0, so an empty table can render nothing
            without a special case.
          </li>
          <li>
            <DocsCode>siblings</DocsCode> and <DocsCode>boundaries</DocsCode> go
            from 0 to 10.
          </li>
          <li>
            Ellipses have a stable <DocsCode>position</DocsCode> of{" "}
            <DocsCode>start</DocsCode> or <DocsCode>end</DocsCode>. Use it as
            the React key.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="use-pagination/dots"
          title="Dots"
          description={
            <>
              With <DocsCode>boundaries: 0</DocsCode> the list is just a window
              around the current page. Ellipses become small dots, so a long set
              of slides never needs more than five targets.
            </>
          }
        >
          <UsePaginationDots />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Good to know">
        <DocsList>
          <li>
            Mark the current page with{" "}
            <DocsCode>aria-current=&quot;page&quot;</DocsCode> and wrap the list
            in a <DocsCode>{"<nav>"}</DocsCode> with a label.
          </li>
          <li>
            Hide ellipses from screen readers with{" "}
            <DocsCode>aria-hidden</DocsCode>. They carry no information that the
            page numbers don&apos;t.
          </li>
          <li>
            Show page numbers with <DocsCode>tabular-nums</DocsCode> so the
            buttons don&apos;t change width as the digits change.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsSection title="usePagination(options)" id="options" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "count",
                type: "number",
                description: "Total number of pages.",
              },
              {
                name: "page",
                type: "number",
                default: "1",
                description: "The current page, starting at 1.",
              },
              {
                name: "siblings",
                type: "number",
                default: "1",
                description: "Pages to show on each side of the current page.",
              },
              {
                name: "boundaries",
                type: "number",
                default: "1",
                description: "Pages to always show at the start and the end.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="Returns" level={3}>
          <DocsAttributesTable
            label="Property"
            attributes={[
              {
                name: "items",
                description: "PaginationItemData[] to render, in order.",
              },
              { name: "page", description: "The clamped current page." },
              { name: "count", description: "The clamped page count." },
              {
                name: "hasPrevious",
                description: "Whether there's a page before this one.",
              },
              {
                name: "hasNext",
                description: "Whether there's a page after this one.",
              },
            ]}
          />
          <DocsCodeBlock code={shapeCode} />
        </DocsSection>
        <DocsSection title="Used by" level={3}>
          <DocsParagraph>
            <DocsCode>Pagination</DocsCode>.
          </DocsParagraph>
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
