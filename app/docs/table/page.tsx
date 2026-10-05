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
  DocsKeyboardTable,
  DocsPropsTable,
} from "@/components/docs/docs-props-table"
import { TableDemo } from "@/components/examples/table/demo"
import { TablePinned } from "@/components/examples/table/pinned"
import { TablePlain } from "@/components/examples/table/plain"
import { TableRtl } from "@/components/examples/table/rtl"
import { TableScroll } from "@/components/examples/table/scroll"
import { TableSizes } from "@/components/examples/table/sizes"
import { TableSticky } from "@/components/examples/table/sticky"
import { TableWrap } from "@/components/examples/table/wrap"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("table")

const importCode = `import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"`

const usageCode = `<Table variant="surface">
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead align="end">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableHead scope="row">INV-0418</TableHead>
      <TableCell align="end">$2,400.00</TableCell>
    </TableRow>
  </TableBody>
</Table>`

const cellProps = [
  {
    name: "align",
    type: '"start" | "center" | "end"',
    default: '"start"',
    description: "end also switches to tabular numbers so digits line up.",
  },
  {
    name: "pinned",
    type: '"start" | "end"',
    description:
      "Keep the column in view while the table scrolls sideways. Set the same value on its header and every cell.",
  },
  {
    name: "pinnedEdge",
    type: "boolean",
    default: "false",
    description:
      "Draw a soft shadow on the inner edge of the last pinned column while content is hidden behind it.",
  },
]

const compositionCode = `Table
├── TableCaption
├── TableHeader
│   └── TableRow
│       └── TableHead
├── TableBody
│   └── TableRow
│       └── TableCell
└── TableFooter
    └── TableRow
        └── TableCell`

export default function Page() {
  return (
    <DocsComponentPage slug="table">
      <DocsExample file="table/demo">
        <TableDemo />
      </DocsExample>

      <DocsInstall
        dependencies={["class-variance-authority", "cn"]}
        files={["components/ui/table.tsx"]}
      />

      <DocsSection title="Usage">
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          Use <DocsCode>{'<TableHead scope="row">'}</DocsCode> for the cell that
          names each row. It reads as the row&apos;s header to screen readers
          and gets a stronger text color. For sorting, filtering and selection,
          build on <DocsCode>{"<DataTable />"}</DocsCode>.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="table/plain"
          title="Default"
          description={
            <>
              The default variant has no surface, just hairlines between rows,
              for tables that sit inside a card or a page section.{" "}
              <DocsCode>{"<TableCaption />"}</DocsCode> describes the table
              below it.
            </>
          }
        >
          <TablePlain />
        </DocsExample>
        <DocsExample
          file="table/sizes"
          title="Compact"
          description={
            <>
              <DocsCode>{'size="sm"'}</DocsCode> tightens row height and padding
              for dense data.
            </>
          }
        >
          <TableSizes />
        </DocsExample>
        <DocsExample
          file="table/wrap"
          title="Wrapping text"
          description={
            <>
              Cells stay on one line by default, which suits data.{" "}
              <DocsCode>wrap</DocsCode> lets them wrap and aligns rows to the
              top, for prose like glossaries or API references. Pair it with{" "}
              <DocsCode>table-fixed</DocsCode> and column widths.
            </>
          }
        >
          <TableWrap />
        </DocsExample>
        <DocsExample
          file="table/scroll"
          title="Wide tables"
          description={
            <>
              Tables wider than their container scroll sideways. Soft fades show
              there&apos;s more on either side, and the scroll area becomes
              focusable so keyboard users can scroll it with the arrow keys.
              Turn the fades off with{" "}
              <DocsCode>{"scrollFade={false}"}</DocsCode>.
            </>
          }
        >
          <TableScroll />
        </DocsExample>
        <DocsExample
          file="table/pinned"
          title="Pinned column"
          description={
            <>
              <DocsCode>{'pinned="start"'}</DocsCode> keeps the first column in
              view while the rest scrolls, and <DocsCode>pinnedEdge</DocsCode>{" "}
              shows a shadow once content slides under it.
            </>
          }
        >
          <TablePinned />
        </DocsExample>
        <DocsExample
          file="table/sticky"
          title="Sticky header"
          description={
            <>
              <DocsCode>stickyHeader</DocsCode> keeps the header in view in a
              height-limited table, and adds a hairline under it once rows
              scroll beneath.
            </>
          }
        >
          <TableSticky />
        </DocsExample>
        <DocsExample
          file="table/rtl"
          title="Right to left"
          description="Alignment, pinned columns and scroll fades follow the reading direction."
        >
          <TableRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Tab"],
              description:
                "Focuses the scroll area when the table overflows, then the links and buttons inside it.",
            },
            {
              keys: ["←", "→"],
              description: "Scrolls a focused, overflowing table sideways.",
            },
            {
              keys: ["↑", "↓"],
              description:
                "Scrolls a focused table with a sticky header up and down.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            The parts render native table elements, so screen readers announce
            rows, columns and headers without extra roles.
          </li>
          <li>
            Mark the cell that names a row with{" "}
            <DocsCode>{'<TableHead scope="row">'}</DocsCode> so each value is
            read with its row and column.
          </li>
          <li>
            The scroll area only joins the tab order while it overflows, so
            tables that fit don&apos;t add an extra stop.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Every part renders its native element and accepts its attributes.
        </DocsParagraph>
        <DocsSection title="Table" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "variant",
                type: '"default" | "surface"',
                default: '"default"',
                description:
                  "surface adds a rounded hairline frame and a muted header band.",
              },
              {
                name: "size",
                type: '"sm" | "default"',
                default: '"default"',
              },
              {
                name: "wrap",
                type: "boolean",
                default: "false",
                description: "Let cell text wrap and align rows to the top.",
              },
              {
                name: "scrollFade",
                type: "boolean",
                default: "true",
                description:
                  "Fade the edges that have more content to scroll to. Skipped when columns are pinned.",
              },
              {
                name: "stickyHeader",
                type: "boolean",
                default: "false",
                description:
                  "Keep the header in view. Give the container a max height through containerClassName.",
              },
              {
                name: "containerClassName",
                type: "string",
                description: "Classes for the scroll container.",
              },
              {
                name: "containerRef",
                type: "Ref<HTMLDivElement>",
                description: "Ref to the scroll container.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="table-frame"',
                description:
                  "The outer frame, with data-variant, data-size and data-wrap.",
              },
              {
                name: 'data-slot="table-container"',
                description: "The scroll container.",
              },
              {
                name: "data-overflowing",
                description:
                  "Present on the container while its content overflows. It's focusable then.",
              },
              {
                name: "data-scrolled-start / data-scrolled-end",
                description:
                  "Present while there's content hidden before or after the visible area.",
              },
              {
                name: "data-scrolled-top",
                description: "Present once a sticky-header table has scrolled.",
              },
              {
                name: "--table-bg",
                description:
                  "Row background. Follows a surrounding card or popover.",
              },
              {
                name: "--table-head-bg",
                description: "Header band background in the surface variant.",
              },
              {
                name: "--table-cell-px / --table-cell-py",
                description: "Cell padding. Set by size.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="TableHead" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "scope",
                type: '"col" | "row"',
                description:
                  "Use row for the cell that names a row. Inside the body it gets cell padding and foreground text.",
              },
              ...cellProps,
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="table-head"',
                description: "Target header cells in CSS.",
              },
              { name: "data-align", description: "The alignment." },
              { name: "data-pinned", description: "The pinned side." },
            ]}
          />
        </DocsSection>
        <DocsSection title="TableCell" level={3}>
          <DocsPropsTable props={cellProps} />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="table-cell"',
                description: "Target cells in CSS.",
              },
              { name: "data-align", description: "The alignment." },
              { name: "data-pinned", description: "The pinned side." },
            ]}
          />
        </DocsSection>
        <DocsSection title="TableRow" level={3}>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="table-row"',
                description: "Target rows in CSS.",
              },
              {
                name: 'data-state="selected"',
                description: "Set it to highlight a selected row.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection
          title="TableHeader, TableBody, TableFooter and TableCaption"
          level={3}
        >
          <DocsAttributesTable
            attributes={[
              { name: 'data-slot="table-header"', description: "The thead." },
              { name: 'data-slot="table-body"', description: "The tbody." },
              {
                name: 'data-slot="table-footer"',
                description: "The tfoot, on the header band color.",
              },
              {
                name: 'data-slot="table-caption"',
                description:
                  "Below the table. In the surface variant it sits inside the frame.",
              },
            ]}
          />
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
