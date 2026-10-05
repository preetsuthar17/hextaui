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
import { DataTableDemo } from "@/components/examples/data-table/demo"
import { DataTableEmpty } from "@/components/examples/data-table/empty"
import { DataTableLoading } from "@/components/examples/data-table/loading"
import { DataTablePinnedColumns } from "@/components/examples/data-table/pinned-columns"
import { DataTableRtl } from "@/components/examples/data-table/rtl"
import { DataTableStickyHeader } from "@/components/examples/data-table/sticky-header"
import { TableDemo } from "@/components/examples/data-table/table"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("data-table")

const importCode = `import {
  createDataTableColumns,
  DataTable,
  DataTableColumnHeader,
  DataTableContent,
  DataTablePagination,
  DataTableSearch,
  DataTableSelectAll,
  DataTableSelectRow,
  DataTableToolbar,
  DataTableViewOptions,
  useDataTable,
} from "@/components/ui/data-table"`

const columnsCode = `type Payment = { id: string; email: string; amount: number }

const helper = createDataTableColumns<Payment>()

const columns = helper.columns([
  helper.display({
    id: "select",
    header: ({ table }) => <DataTableSelectAll table={table} />,
    cell: ({ row }) => <DataTableSelectRow row={row} />,
    enableSorting: false,
    enableHiding: false,
  }),
  helper.accessor("email", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  }),
  helper.accessor("amount", {
    header: "Amount",
    meta: { align: "end" },
  }),
])`

const usageCode = `export function Payments({ data }: { data: Payment[] }) {
  const table = useDataTable({
    data,
    columns,
    getRowId: (row) => row.id,
  })

  return (
    <DataTable table={table}>
      <DataTableToolbar>
        <DataTableSearch placeholder="Search payments…" />
        <DataTableViewOptions />
      </DataTableToolbar>
      <DataTableContent />
      <DataTablePagination />
    </DataTable>
  )
}`

const controlledCode = `const [sorting, setSorting] = React.useState([{ id: "date", desc: true }])

const table = useDataTable({
  data,
  columns,
  state: { sorting },
  onSortingChange: setSorting,
})`

const tablePartProps = [
  {
    name: "align",
    type: '"start" | "center" | "end"',
    default: '"start"',
    description: "End-aligned cells also use tabular numbers.",
  },
  {
    name: "pinned",
    type: '"start" | "end"',
    description:
      "Keeps the cell in place while the table scrolls sideways. Offset with --pin-offset.",
  },
  {
    name: "pinnedEdge",
    type: "boolean",
    default: "false",
    description:
      "Draws a soft shadow on the last pinned column while scrolled.",
  },
]

const compositionCode = `DataTable
├── DataTableToolbar
│   ├── DataTableSearch
│   └── DataTableViewOptions
├── DataTableContent
└── DataTablePagination`

export default function Page() {
  return (
    <DocsComponentPage slug="data-table">
      <DocsExample file="data-table/demo">
        <DataTableDemo />
      </DocsExample>

      <DocsInstall
        dependencies={[
          "@base-ui/react",
          "@tabler/icons-react",
          "@tanstack/react-table",
          "class-variance-authority",
          "cn",
        ]}
        files={[
          "components/ui/data-table.tsx",
          "components/ui/table.tsx",
          "components/ui/button.tsx",
          "components/ui/checkbox.tsx",
          "components/ui/skeleton.tsx",
        ]}
      />

      <DocsSection title="Usage">
        <DocsParagraph>
          The data table is TanStack Table v9 with the sorting, filtering,
          pagination, selection and column visibility features already wired up.
          Define columns once with <DocsCode>createDataTableColumns</DocsCode>,
          create the table with <DocsCode>useDataTable</DocsCode>, then compose
          the parts you need.
        </DocsParagraph>
        <DocsCodeBlock code={importCode} />
        <DocsCodeBlock code={columnsCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          Pass any TanStack state you want to own, such as sorting or row
          selection, with its change handler.
        </DocsParagraph>
        <DocsCodeBlock code={controlledCode} />
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
        <DocsParagraph>
          <DocsCode>DataTableColumnHeader</DocsCode>,{" "}
          <DocsCode>DataTableSelectAll</DocsCode> and{" "}
          <DocsCode>DataTableSelectRow</DocsCode> go in your column definitions,
          as a column’s header or cell.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="data-table/table"
          title="Plain table"
          description={
            <>
              The plain <DocsCode>{"<Table />"}</DocsCode> parts the data table
              is built from. Use them on their own for static data, with a
              caption and a footer total.
            </>
          }
        >
          <TableDemo />
        </DocsExample>
        <DocsExample
          file="data-table/loading"
          title="Loading"
          description={
            <>
              With <DocsCode>loading</DocsCode>, skeleton rows fill the same
              space as real rows, so nothing jumps when the data arrives. The
              table is marked <DocsCode>aria-busy</DocsCode> meanwhile.
            </>
          }
        >
          <DataTableLoading />
        </DocsExample>
        <DocsExample
          file="data-table/empty"
          title="Empty"
          description={
            <>
              <DocsCode>emptyMessage</DocsCode> fills the body when there is no
              data or nothing matches the search.
            </>
          }
        >
          <DataTableEmpty />
        </DocsExample>
        <DocsExample
          file="data-table/sticky-header"
          title="Sticky header"
          description={
            <>
              Give the container a max height with{" "}
              <DocsCode>containerClassName</DocsCode> and set{" "}
              <DocsCode>stickyHeader</DocsCode>. The header stays put and gains
              a hairline once the rows scroll under it. Shift-drag over the
              checkboxes scrolls the box as you near its edge.
            </>
          }
        >
          <DataTableStickyHeader />
        </DocsExample>
        <DocsExample
          file="data-table/pinned-columns"
          title="Pinned columns"
          description={
            <>
              The selection column and the first data column are pinned by
              default. Choose your own with <DocsCode>pinStart</DocsCode>. A
              soft shadow marks the edge once the table scrolls sideways.
            </>
          }
        >
          <DataTablePinnedColumns />
        </DocsExample>
        <DocsExample
          file="data-table/rtl"
          title="Right to left"
          description={
            <>
              Every label and count can be replaced with{" "}
              <DocsCode>labels</DocsCode> and the format functions. Pagination
              arrows and pinned columns flip with the direction.
            </>
          }
        >
          <DataTableRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Interactions">
        <DocsList>
          <li>
            Click a sortable header to sort ascending, again for descending, and
            a third time to clear. Shift-click another header to add a secondary
            sort.
          </li>
          <li>
            Shift-click a row checkbox to select every row between it and the
            last one you clicked. Hold Shift and drag across checkboxes to
            select or clear a range in one motion.
          </li>
          <li>
            Searching matches every column except the selection column and jumps
            back to the first page.
          </li>
          <li>
            Hiding columns from the View menu keeps the menu open, so you can
            toggle several at once.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Tab"],
              description:
                "Moves through the search, View menu, sortable headers, row checkboxes and pagination.",
            },
            {
              keys: ["Enter", "Space"],
              description: "Sorts by the focused header.",
            },
            {
              keys: ["Space"],
              description: "Toggles the focused checkbox.",
            },
            {
              keys: ["Esc"],
              description: "Clears the search when it has text.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            Sortable headers carry <DocsCode>aria-sort</DocsCode>, and a polite
            live region announces the new sort and, shortly after typing, the
            number of results.
          </li>
          <li>
            The page indicator is a live region, so screen readers hear the new
            page after pressing next or previous.
          </li>
          <li>
            Checkboxes have labels by default. Override them with{" "}
            <DocsCode>aria-label</DocsCode> on{" "}
            <DocsCode>{"<DataTableSelectAll />"}</DocsCode> and{" "}
            <DocsCode>{"<DataTableSelectRow />"}</DocsCode>.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          Every part below has to be rendered inside{" "}
          <DocsCode>{"<DataTable />"}</DocsCode>, which shares the table with
          them.
        </DocsParagraph>
        <DocsSection title="useDataTable" level={3}>
          <DocsParagraph>
            Takes the TanStack Table options and returns the table. Pages hold
            10 rows unless <DocsCode>initialState.pagination</DocsCode> says
            otherwise.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              { name: "data", type: "TData[]" },
              {
                name: "columns",
                type: "ColumnDef[]",
                description: "Build them with createDataTableColumns.",
              },
              {
                name: "getRowId",
                type: "(row: TData) => string",
                description:
                  "Keeps selection stable when rows move. Defaults to the row index.",
              },
              {
                name: "initialState",
                type: "Partial<TableState>",
                default: "{ pagination: { pageIndex: 0, pageSize: 10 } }",
              },
              {
                name: "state",
                type: "Partial<TableState>",
                description:
                  "Control sorting, rowSelection, globalFilter, pagination or columnVisibility.",
              },
              {
                name: "onSortingChange",
                type: "OnChangeFn<SortingState>",
                description:
                  "Each controllable state has a matching handler, like onRowSelectionChange.",
              },
              {
                name: "enableRowSelection",
                type: "boolean | (row) => boolean",
                default: "true",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="createDataTableColumns" level={3}>
          <DocsParagraph>
            Returns a typed column helper with <DocsCode>accessor</DocsCode>,{" "}
            <DocsCode>display</DocsCode> and <DocsCode>columns</DocsCode>. Set{" "}
            <DocsCode>{'meta: { align: "end" }'}</DocsCode> on numeric columns
            to align the header and cells.
          </DocsParagraph>
        </DocsSection>
        <DocsSection title="DataTable" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "table",
                type: "DataTableInstance<TData>",
                description: "The table returned by useDataTable.",
              },
              { name: "className", type: "string" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="data-table"',
                description: "The wrapper around every part.",
              },
              {
                name: 'data-slot="data-table-announcer"',
                description: "The visually hidden live region.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="DataTableContent" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "emptyMessage",
                type: "ReactNode",
                default: '"No results."',
              },
              { name: "loading", type: "boolean", default: "false" },
              {
                name: "loadingRows",
                type: "number",
                default: "5",
                description: "Number of skeleton rows while loading.",
              },
              {
                name: "pinStart",
                type: "string[]",
                default: '["select", firstColumnId]',
                description: "Column ids to pin to the start edge.",
              },
              {
                name: "stickyHeader",
                type: "boolean",
                default: "false",
                description: "Needs a max height on the container.",
              },
              {
                name: "containerClassName",
                type: "string",
                description: "Applied to the scroll container.",
              },
              {
                name: "swipeSelect",
                type: "boolean",
                default: "true",
                description: "Shift-drag across checkboxes to select a range.",
              },
              {
                name: "className",
                type: "string",
                description: "Applied to the table element.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="table-container"',
                description: "The scroll container.",
              },
              {
                name: "data-scrolled-start",
                description:
                  "Present on the container when it has scrolled away from the start edge.",
              },
              {
                name: "data-scrolled-end",
                description:
                  "Present while there is more to scroll toward the end edge.",
              },
              {
                name: "data-scrolled-top",
                description: "Present once the rows scroll vertically.",
              },
              {
                name: "data-swipe-selecting",
                description: "Present on the container during a shift-drag.",
              },
              {
                name: 'data-state="selected"',
                description: "Present on selected rows.",
              },
              {
                name: "data-row-id",
                description: "The row id from getRowId.",
              },
              {
                name: 'data-slot="data-table-loading-row"',
                description: "Each skeleton row.",
              },
              {
                name: 'data-slot="data-table-empty"',
                description: "The empty row.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="DataTableToolbar" level={3}>
          <DocsParagraph>
            A wrapping row for the search, the View menu and your own filters.
            Accepts every <DocsCode>div</DocsCode> prop and carries{" "}
            <DocsCode>data-table-toolbar</DocsCode> as its{" "}
            <DocsCode>data-slot</DocsCode>.
          </DocsParagraph>
        </DocsSection>
        <DocsSection title="DataTableSearch" level={3}>
          <DocsPropsTable
            props={[
              { name: "placeholder", type: "string", default: '"Search…"' },
              {
                name: "aria-label",
                type: "string",
                default: '"Search table"',
              },
              {
                name: "clearLabel",
                type: "string",
                default: '"Clear search"',
                description: "Accessible name of the clear button.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="data-table-search"',
                description: "The search field wrapper.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="DataTableViewOptions" level={3}>
          <DocsPropsTable
            props={[
              { name: "label", type: "string", default: '"View"' },
              {
                name: "groupLabel",
                type: "string",
                default: '"Toggle columns"',
              },
              {
                name: "getLabel",
                type: "(column) => string",
                description:
                  "Defaults to the column’s string header, or its id capitalized.",
              },
            ]}
          />
          <DocsParagraph>
            Lists every column that can hide. Set{" "}
            <DocsCode>enableHiding: false</DocsCode> on a column to leave it
            out.
          </DocsParagraph>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="data-table-view-options"',
                description: "The menu popup.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="DataTableColumnHeader" level={3}>
          <DocsPropsTable
            props={[
              { name: "column", type: "Column" },
              { name: "title", type: "string" },
            ]}
          />
          <DocsParagraph>
            Renders a sort button for sortable columns and plain text for the
            rest.
          </DocsParagraph>
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="data-table-column-header"',
                description: "The header wrapper.",
              },
              {
                name: "data-sorted",
                description:
                  "Present on the sort button while the column is sorted.",
              },
              {
                name: "aria-sort",
                description:
                  "On the header cell: ascending, descending or none.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="DataTableSelectAll" level={3}>
          <DocsPropsTable
            props={[
              { name: "table", type: "Table" },
              {
                name: "aria-label",
                type: "string",
                default: '"Select all rows on this page"',
              },
            ]}
          />
          <DocsParagraph>
            Selects the rows on the current page and shows an indeterminate
            state when only some are selected.
          </DocsParagraph>
        </DocsSection>
        <DocsSection title="DataTableSelectRow" level={3}>
          <DocsPropsTable
            props={[
              { name: "row", type: "Row" },
              { name: "aria-label", type: "string", default: '"Select row"' },
            ]}
          />
        </DocsSection>
        <DocsSection title="DataTablePagination" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "pageSizes",
                type: "number[]",
                default: "[10, 20, 50, 100]",
              },
              {
                name: "showSelection",
                type: "boolean",
                default: "true",
                description:
                  "Show the selected count instead of the row count.",
              },
              {
                name: "labels",
                type: "Partial<DataTablePaginationLabels>",
                description:
                  "rowsPerPage, firstPage, previousPage, nextPage and lastPage.",
              },
              {
                name: "formatSelection",
                type: "(selected: number, total: number) => ReactNode",
                default: '"2 of 42 rows selected"',
              },
              {
                name: "formatRows",
                type: "(total: number) => ReactNode",
                default: '"42 rows"',
              },
              {
                name: "formatPage",
                type: "(page: number, pageCount: number) => ReactNode",
                default: '"Page 1 of 5"',
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              {
                name: 'data-slot="data-table-pagination"',
                description: "The pagination bar.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="useDataTableContext" level={3}>
          <DocsParagraph>
            Returns the table from the nearest{" "}
            <DocsCode>{"<DataTable />"}</DocsCode>. Use it to build your own
            toolbar controls, such as a status filter.
          </DocsParagraph>
        </DocsSection>
        <DocsSection title="Table" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "stickyHeader",
                type: "boolean",
                default: "false",
                description:
                  "Pins the header row inside a scrolling container.",
              },
              {
                name: "containerClassName",
                type: "string",
                description: "Applied to the scroll container.",
              },
              {
                name: "containerRef",
                type: "Ref<HTMLDivElement>",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              { name: 'data-slot="table"', description: "The table element." },
              {
                name: "data-sticky-header",
                description:
                  "Present on the container when stickyHeader is on.",
              },
              {
                name: "--table-bg",
                description:
                  "Row and pinned-cell background. Follows the card or popover it sits in.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="TableHead and TableCell" level={3}>
          <DocsPropsTable props={tablePartProps} />
          <DocsAttributesTable
            attributes={[
              {
                name: "data-align",
                description: "The current alignment.",
              },
              {
                name: "data-pinned",
                description: "start or end when pinned.",
              },
              {
                name: "data-pinned-edge",
                description: "Present on the last pinned cell of a side.",
              },
              {
                name: "--pin-offset",
                description: "Distance from the pinned edge, set for you.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="Other table parts" level={3}>
          <DocsParagraph>
            <DocsCode>TableHeader</DocsCode>, <DocsCode>TableBody</DocsCode>,{" "}
            <DocsCode>TableFooter</DocsCode>, <DocsCode>TableRow</DocsCode> and{" "}
            <DocsCode>TableCaption</DocsCode> render the matching table elements
            and accept all of their props.
          </DocsParagraph>
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
