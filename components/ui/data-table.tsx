"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import {
  IconAdjustmentsHorizontal,
  IconArrowDown,
  IconArrowUp,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconSearch,
  IconSelector,
  IconX,
} from "@tabler/icons-react"
import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTableHook,
  createTableHookContexts,
  filterFn_includesString,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  Subscribe,
  tableFeatures,
  type Column,
  type Row,
  type RowData,
  type RowSelectionState,
  type Table as CoreTable,
} from "@tanstack/react-table"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
    datetime: sortFn_datetime,
    basic: sortFn_basic,
  },
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: { includesString: filterFn_includesString },
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowSelectionFeature,
  columnVisibilityFeature,
})

type DataTableFeatures = typeof dataTableFeatures

const dataTableContexts = createTableHookContexts<DataTableFeatures>()

const dataTableHook = createTableHook({
  features: dataTableFeatures,
  ...dataTableContexts,
  globalFilterFn: "includesString",
  getColumnCanGlobalFilter: (column) => column.id !== "select",
})

type UseDataTableOptions<TData extends RowData> = Parameters<
  typeof dataTableHook.useAppTable<TData>
>[0]

type DataTableInstance<TData extends RowData = RowData> = ReturnType<
  typeof dataTableHook.useAppTable<TData>
>

type AnyColumn = Column<DataTableFeatures, RowData, unknown>
type AnyRow = Row<DataTableFeatures, RowData>
type AnyCoreTable = CoreTable<DataTableFeatures, RowData>

function useDataTable<TData extends RowData>(
  options: UseDataTableOptions<TData>
) {
  return dataTableHook.useAppTable<TData>({
    ...options,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      ...options.initialState,
    },
  })
}

const createDataTableColumns = dataTableHook.createAppColumnHelper

function useDataTableContext() {
  return dataTableHook.useTableContext()
}

function columnLabel(column: AnyColumn) {
  const header = column.columnDef.header
  if (typeof header === "string") {
    return header
  }
  return column.id.charAt(0).toUpperCase() + column.id.slice(1)
}

function DataTableAnnouncer() {
  const table = useDataTableContext()
  const sorting = table.state.sorting
  const search = table.state.globalFilter as string | undefined
  const count = table.getFilteredRowModel().rows.length
  const sortKey = JSON.stringify(sorting)
  const [message, setMessage] = React.useState("")
  const [previousSort, setPreviousSort] = React.useState(sortKey)

  const first = sorting[0]
  const sortedColumn = first ? table.getColumn(first.id) : undefined
  const sortMessage = first
    ? `Sorted by ${sortedColumn ? columnLabel(sortedColumn as AnyColumn) : first.id}, ${first.desc ? "descending" : "ascending"}`
    : "Sorting removed"

  if (sortKey !== previousSort) {
    setPreviousSort(sortKey)
    setMessage(sortMessage)
  }

  React.useEffect(() => {
    if (!search) {
      return
    }
    const timer = setTimeout(
      () => setMessage(count === 1 ? "1 result" : `${count} results`),
      500
    )
    return () => clearTimeout(timer)
  }, [count, search])

  return (
    <span
      data-slot="data-table-announcer"
      role="status"
      aria-live="polite"
      aria-atomic
      className="sr-only"
    >
      {message}
    </span>
  )
}

type DataTableProps<TData extends RowData> = React.ComponentProps<"div"> & {
  table: DataTableInstance<TData>
}

function DataTable<TData extends RowData>({
  table,
  className,
  children,
  ...props
}: DataTableProps<TData>) {
  return (
    <table.AppTable>
      <div
        data-slot="data-table"
        className={cn("flex w-full min-w-0 flex-col gap-3", className)}
        {...props}
      >
        {children}
        <DataTableAnnouncer />
      </div>
    </table.AppTable>
  )
}

function DataTableToolbar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="data-table-toolbar"
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    />
  )
}

const fieldClassName =
  "h-8 w-full min-w-0 rounded-md bg-background text-sm inset-ring-(length:--hairline) forced-colors:border inset-ring-input transition-[box-shadow] duration-150 ease-out-quint outline-none focus-visible:outline-hidden placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:inset-ring-ring pointer-coarse:h-11 pointer-coarse:text-[max(16px,1rem)] dark:bg-input/30"

type DataTableSearchProps = Omit<
  React.ComponentProps<"input">,
  "value" | "defaultValue" | "onChange"
> & {
  clearLabel?: string
}

function DataTableSearch({
  className,
  placeholder = "Search…",
  clearLabel = "Clear search",
  onKeyDown,
  "aria-label": ariaLabel = "Search table",
  ...props
}: DataTableSearchProps) {
  const table = useDataTableContext()
  const value = (table.state.globalFilter as string | undefined) ?? ""
  const inputRef = React.useRef<HTMLInputElement>(null)

  const setSearch = (next: string) => {
    table.setGlobalFilter(next)
    table.setPageIndex(0)
  }

  return (
    <div
      data-slot="data-table-search"
      className={cn(
        "relative flex min-w-0 flex-1 items-center sm:max-w-xs",
        className
      )}
    >
      <IconSearch
        aria-hidden
        className="pointer-events-none absolute start-2.5 size-4 text-muted-foreground"
      />
      <input
        ref={inputRef}
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onChange={(event) => setSearch(event.target.value)}
        onKeyDown={(event) => {
          onKeyDown?.(event)
          if (
            !event.defaultPrevented &&
            event.key === "Escape" &&
            value !== ""
          ) {
            event.preventDefault()
            setSearch("")
          }
        }}
        className={cn(
          fieldClassName,
          "ps-8 pe-8 [&::-webkit-search-cancel-button]:hidden"
        )}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        tabIndex={-1}
        aria-label={clearLabel}
        aria-hidden={value === "" || undefined}
        onClick={() => {
          setSearch("")
          inputRef.current?.focus()
        }}
        className={cn(
          "absolute end-1 rounded-full text-muted-foreground transition-[opacity,scale,color,background-color] duration-150 hover:text-foreground",
          value === ""
            ? "pointer-events-none opacity-0 motion-safe:scale-75"
            : "opacity-100"
        )}
      >
        <IconX />
      </Button>
    </div>
  )
}

type DataTableColumnHeaderProps<
  TData extends RowData,
  TValue,
> = React.ComponentProps<"div"> & {
  column: Column<DataTableFeatures, TData, TValue>
  title: string
}

function DataTableColumnHeader<TData extends RowData, TValue>({
  column,
  title,
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  const target = column as unknown as AnyColumn

  if (!target.getCanSort()) {
    return (
      <div
        data-slot="data-table-column-header"
        className={className}
        {...props}
      >
        {title}
      </div>
    )
  }

  return (
    <Subscribe
      source={target.table.store}
      selector={(state) =>
        state.sorting.find((entry) => entry.id === target.id)?.desc
      }
    >
      {(desc) => (
        <div
          data-slot="data-table-column-header"
          className={cn(
            "flex in-data-[align=center]:justify-center in-data-[align=end]:justify-end",
            className
          )}
          {...props}
        >
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={target.getToggleSortingHandler()}
            className="-mx-2.5 h-8 gap-1.5 px-2.5 font-medium text-muted-foreground hover:text-foreground in-data-[align=end]:flex-row-reverse data-sorted:text-foreground"
            data-sorted={desc === undefined ? undefined : ""}
          >
            {title}
            {desc === undefined ? (
              <IconSelector aria-hidden className="size-3.5 opacity-60" />
            ) : desc ? (
              <IconArrowDown aria-hidden className="size-3.5" />
            ) : (
              <IconArrowUp aria-hidden className="size-3.5" />
            )}
          </Button>
        </div>
      )}
    </Subscribe>
  )
}

function DataTableSelectAll<TData extends RowData>({
  table,
  "aria-label": ariaLabel = "Select all rows on this page",
}: {
  table: CoreTable<DataTableFeatures, TData>
  "aria-label"?: string
}) {
  const target = table as unknown as AnyCoreTable

  return (
    <Subscribe
      source={target.store}
      selector={(state) => [
        state.rowSelection,
        state.pagination,
        state.globalFilter,
      ]}
    >
      {() => {
        const all = target.getIsAllPageRowsSelected()
        const some = target.getIsSomePageRowsSelected()
        return (
          <Checkbox
            aria-label={ariaLabel}
            className="z-1"
            checked={all}
            indeterminate={!all && some}
            onCheckedChange={(checked) =>
              target.toggleAllPageRowsSelected(checked)
            }
          />
        )
      }}
    </Subscribe>
  )
}

function DataTableSelectRow<TData extends RowData>({
  row,
  "aria-label": ariaLabel = "Select row",
}: {
  row: Row<DataTableFeatures, TData>
  "aria-label"?: string
}) {
  const target = row as unknown as AnyRow

  return (
    <Subscribe
      source={target.table.store}
      selector={(state) => Boolean(state.rowSelection[target.id])}
    >
      {() => (
        <Checkbox
          aria-label={ariaLabel}
          className="z-1"
          checked={target.getIsSelected()}
          disabled={!target.getCanSelect()}
          onCheckedChange={(checked, details) => {
            const event = details.event as Event & { shiftKey?: boolean }
            target.getToggleSelectedHandler()({
              target: { checked },
              shiftKey: Boolean(event?.shiftKey),
              nativeEvent: event,
            })
          }}
        />
      )}
    </Subscribe>
  )
}

type DataTableContentProps = {
  className?: string
  emptyMessage?: React.ReactNode
  loading?: boolean
  loadingRows?: number
  pinStart?: string[]
  stickyHeader?: boolean
  containerClassName?: string
  swipeSelect?: boolean
}

function scrollParentOf(element: HTMLElement | null) {
  return element && element.scrollHeight > element.clientHeight + 1
    ? element
    : null
}

function useSwipeSelect(
  table: AnyCoreTable,
  containerRef: React.RefObject<HTMLDivElement | null>,
  enabled: boolean
) {
  return (event: React.PointerEvent<HTMLTableSectionElement>) => {
    if (
      !enabled ||
      !event.shiftKey ||
      event.button !== 0 ||
      event.pointerType === "touch"
    ) {
      return
    }
    const target = event.target as Element
    const box = target.closest("[data-slot=checkbox]")
    const startRow = box?.closest<HTMLElement>("tr[data-row-id]")
    if (!box || !startRow) {
      return
    }
    const ids = table.getRowModel().rows.map((row) => row.id)
    const anchor = ids.indexOf(startRow.dataset.rowId ?? "")
    const anchorRow = anchor === -1 ? undefined : table.getRow(ids[anchor])
    if (!anchorRow || !anchorRow.getCanSelect()) {
      return
    }
    event.preventDefault()

    const value = !anchorRow.getIsSelected()
    const snapshot: RowSelectionState = { ...table.store.state.rowSelection }
    const body = event.currentTarget
    const container = containerRef.current
    let current = anchor
    let dragged = false
    let pointer = { x: event.clientX, y: event.clientY }
    let frame = 0

    const apply = (index: number) => {
      const next: RowSelectionState = { ...snapshot }
      const from = Math.min(anchor, index)
      const to = Math.max(anchor, index)
      for (let position = from; position <= to; position++) {
        const row = table.getRow(ids[position])
        if (!row?.getCanSelect()) {
          continue
        }
        if (value) {
          next[ids[position]] = true
        } else {
          delete next[ids[position]]
        }
      }
      table.setRowSelection(next)
    }

    const visibleBounds = () => {
      const scroller = scrollParentOf(container)
      const bounds = scroller
        ? scroller.getBoundingClientRect()
        : { top: 0, bottom: window.innerHeight }
      const head = scroller?.querySelector("thead")
      const top = head
        ? Math.max(bounds.top, head.getBoundingClientRect().bottom)
        : bounds.top
      return { top, bottom: bounds.bottom }
    }

    const hitTest = () => {
      const { top, bottom } = visibleBounds()
      const rows = body.getBoundingClientRect()
      const y = Math.min(Math.max(pointer.y, top + 6), bottom - 6)
      const x = Math.min(Math.max(pointer.x, rows.left + 1), rows.right - 1)
      const hit = document
        .elementFromPoint(x, y)
        ?.closest<HTMLElement>("tr[data-row-id]")
      let index = hit ? ids.indexOf(hit.dataset.rowId ?? "") : -1
      if (index === -1) {
        if (pointer.y < rows.top) {
          index = 0
        } else if (pointer.y > rows.bottom) {
          index = ids.length - 1
        } else {
          return
        }
      }
      if (index === current) {
        return
      }
      current = index
      if (index !== anchor) {
        dragged = true
      }
      if (dragged) {
        apply(index)
      }
    }

    const autoScroll = () => {
      frame = 0
      const scroller = scrollParentOf(container)
      const { top, bottom } = visibleBounds()
      const edge = 40
      let delta = 0
      if (pointer.y < top + edge) {
        delta = -Math.ceil((top + edge - pointer.y) / 4)
      } else if (pointer.y > bottom - edge) {
        delta = Math.ceil((pointer.y - (bottom - edge)) / 4)
      }
      if (delta === 0) {
        return
      }
      if (scroller) {
        scroller.scrollTop += delta
      } else {
        window.scrollBy(0, delta)
      }
      hitTest()
      frame = requestAnimationFrame(autoScroll)
    }

    const onMove = (moveEvent: PointerEvent) => {
      pointer = { x: moveEvent.clientX, y: moveEvent.clientY }
      hitTest()
      if (!frame) {
        frame = requestAnimationFrame(autoScroll)
      }
    }

    const stopClick = (clickEvent: MouseEvent) => {
      clickEvent.preventDefault()
      clickEvent.stopPropagation()
    }

    const onUp = () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
      window.removeEventListener("pointercancel", onUp)
      cancelAnimationFrame(frame)
      container?.removeAttribute("data-swipe-selecting")
      if (dragged) {
        window.addEventListener("click", stopClick, {
          capture: true,
          once: true,
        })
        setTimeout(
          () =>
            window.removeEventListener("click", stopClick, { capture: true }),
          0
        )
      }
    }

    container?.setAttribute("data-swipe-selecting", "")
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    window.addEventListener("pointercancel", onUp)
  }
}

function DataTableContent({
  className,
  emptyMessage = "No results.",
  loading = false,
  loadingRows = 5,
  pinStart,
  stickyHeader = false,
  containerClassName,
  swipeSelect = true,
}: DataTableContentProps) {
  const table = useDataTableContext()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const onSwipeStart = useSwipeSelect(
    table as unknown as AnyCoreTable,
    containerRef,
    swipeSelect
  )
  const leafColumns = table.getVisibleLeafColumns()
  const firstData = leafColumns.find((column) => column.id !== "select")
  const pinned = (
    pinStart ?? ["select", ...(firstData ? [firstData.id] : [])]
  ).filter((id) => leafColumns.some((column) => column.id === id))
  const rows = table.getRowModel().rows
  const pageCount = table.getPageCount()
  const pageIndex = table.state.pagination.pageIndex

  React.useEffect(() => {
    if (pageCount > 0 && pageIndex > pageCount - 1) {
      table.setPageIndex(pageCount - 1)
    }
  }, [pageCount, pageIndex, table])

  const alignOf = (column: { columnDef: { meta?: unknown } }) =>
    (
      column.columnDef.meta as
        { align?: "start" | "center" | "end" } | undefined
    )?.align

  const pinProps = (columnId: string) => {
    const index = pinned.indexOf(columnId)
    if (index === -1) {
      return { "data-pin-column": undefined }
    }
    return {
      pinned: "start" as const,
      pinnedEdge: index === pinned.length - 1,
      "data-pin-column": columnId,
    }
  }

  React.useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }
    const apply = () => {
      let offset = 0
      for (const id of pinned) {
        const cells = container.querySelectorAll<HTMLElement>(
          `[data-pin-column="${CSS.escape(id)}"]`
        )
        cells.forEach((cell) =>
          cell.style.setProperty("--pin-offset", `${offset}px`)
        )
        const head = container.querySelector<HTMLElement>(
          `th[data-pin-column="${CSS.escape(id)}"]`
        )
        offset += head?.getBoundingClientRect().width ?? 0
      }
    }
    apply()
    const observer =
      typeof ResizeObserver === "function" ? new ResizeObserver(apply) : null
    const head = container.querySelector("thead")
    if (head) {
      observer?.observe(head)
    }
    return () => observer?.disconnect()
  })

  return (
    <Table
      containerRef={containerRef}
      stickyHeader={stickyHeader}
      scrollFade={false}
      containerClassName={cn(
        "rounded-lg border data-swipe-selecting:cursor-default data-swipe-selecting:select-none",
        containerClassName
      )}
      className={className}
      aria-busy={loading || undefined}
    >
      <TableHeader>
        {table.getHeaderGroups().map((group) => (
          <TableRow key={group.id}>
            {group.headers.map((header) => {
              const sorted = header.column.getIsSorted()
              return (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  align={alignOf(header.column)}
                  aria-sort={
                    sorted === "asc"
                      ? "ascending"
                      : sorted === "desc"
                        ? "descending"
                        : header.column.getCanSort()
                          ? "none"
                          : undefined
                  }
                  {...pinProps(header.column.id)}
                >
                  {header.isPlaceholder ? null : (
                    <table.FlexRender header={header} />
                  )}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody onPointerDown={onSwipeStart}>
        {loading ? (
          Array.from({ length: loadingRows }, (_, index) => (
            <TableRow
              key={`loading-${index}`}
              data-slot="data-table-loading-row"
            >
              {leafColumns.map((column) => (
                <TableCell key={column.id} {...pinProps(column.id)}>
                  <Skeleton
                    className={
                      column.id === "select"
                        ? "size-4 rounded-[calc(var(--radius-sm)*0.5)]"
                        : "h-4 w-full max-w-32"
                    }
                  />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : rows.length === 0 ? (
          <TableRow data-slot="data-table-empty">
            <TableCell
              colSpan={Math.max(1, leafColumns.length)}
              className="h-24 text-center whitespace-normal text-muted-foreground"
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row) => (
            <TableRow
              key={row.id}
              data-row-id={row.id}
              data-state={row.getIsSelected() ? "selected" : undefined}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  align={alignOf(cell.column)}
                  {...pinProps(cell.column.id)}
                >
                  <table.FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

const menuPopupClassName =
  "relative max-h-(--available-height) max-w-[min(var(--available-width),20rem)] min-w-44 origin-(--transform-origin) overflow-x-hidden overflow-y-auto overscroll-none rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-(length:--hairline) forced-colors:border ring-foreground/10 transition-[opacity,scale] duration-150 ease-out-quint outline-none focus-visible:outline-hidden data-ending-style:opacity-0 data-starting-style:opacity-0 data-instant:transition-none motion-safe:data-starting-style:scale-96 motion-reduce:transition-opacity"

const menuItemClassName =
  "relative flex min-h-8 w-full min-w-0 cursor-default items-center gap-2 rounded-[max(calc(var(--radius-sm)*0.5),calc(var(--radius-lg)-0.25rem))] py-1.5 ps-8 pe-2 text-start text-sm outline-none focus-visible:outline-hidden select-none data-highlighted:bg-accent forced-colors:data-highlighted:outline-2 forced-colors:data-highlighted:-outline-offset-2 forced-colors:data-highlighted:outline-solid data-highlighted:text-accent-foreground pointer-coarse:min-h-11"

type DataTableViewOptionsProps = {
  label?: string
  groupLabel?: string
  getLabel?: (column: AnyColumn) => string
}

function DataTableViewOptions({
  label = "View",
  groupLabel = "Toggle columns",
  getLabel = columnLabel,
}: DataTableViewOptionsProps) {
  const table = useDataTableContext()
  const columns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanHide()) as AnyColumn[]

  return (
    <MenuPrimitive.Root>
      <MenuPrimitive.Trigger
        render={
          <Button variant="outline" size="sm" className="ms-auto shrink-0" />
        }
      >
        <IconAdjustmentsHorizontal />
        {label}
        <IconChevronDown className="text-muted-foreground" />
      </MenuPrimitive.Trigger>
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner
          align="end"
          sideOffset={6}
          className="isolate z-50 outline-none focus-visible:outline-hidden"
        >
          <MenuPrimitive.Popup
            data-slot="data-table-view-options"
            className={menuPopupClassName}
          >
            <MenuPrimitive.Group>
              <MenuPrimitive.GroupLabel className="px-2 pt-1.5 pb-1 text-xs font-medium text-muted-foreground">
                {groupLabel}
              </MenuPrimitive.GroupLabel>
              {columns.map((column) => (
                <MenuPrimitive.CheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(checked) =>
                    column.toggleVisibility(checked)
                  }
                  closeOnClick={false}
                  className={menuItemClassName}
                >
                  <span className="pointer-events-none absolute start-2 flex size-4 items-center justify-center">
                    <MenuPrimitive.CheckboxItemIndicator className="flex items-center justify-center">
                      <IconCheck className="size-4" />
                    </MenuPrimitive.CheckboxItemIndicator>
                  </span>
                  <span className="min-w-0 truncate">{getLabel(column)}</span>
                </MenuPrimitive.CheckboxItem>
              ))}
            </MenuPrimitive.Group>
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  )
}

type DataTablePaginationLabels = {
  rowsPerPage: string
  firstPage: string
  previousPage: string
  nextPage: string
  lastPage: string
}

type DataTablePaginationProps = React.ComponentProps<"div"> & {
  pageSizes?: number[]
  showSelection?: boolean
  labels?: Partial<DataTablePaginationLabels>
  formatSelection?: (selected: number, total: number) => React.ReactNode
  formatRows?: (total: number) => React.ReactNode
  formatPage?: (page: number, pageCount: number) => React.ReactNode
}

const numberFormat = new Intl.NumberFormat("en-US")

const defaultPaginationLabels: DataTablePaginationLabels = {
  rowsPerPage: "Rows per page",
  firstPage: "First page",
  previousPage: "Previous page",
  nextPage: "Next page",
  lastPage: "Last page",
}

function defaultFormatSelection(selected: number, total: number) {
  return `${numberFormat.format(selected)} of ${numberFormat.format(total)} row${total === 1 ? "" : "s"} selected`
}

function defaultFormatRows(total: number) {
  return `${numberFormat.format(total)} row${total === 1 ? "" : "s"}`
}

function defaultFormatPage(page: number, pageCount: number) {
  return `Page ${numberFormat.format(page)} of ${numberFormat.format(pageCount)}`
}

function DataTablePagination({
  className,
  pageSizes = [10, 20, 50, 100],
  showSelection = true,
  labels: labelOverrides,
  formatSelection = defaultFormatSelection,
  formatRows = defaultFormatRows,
  formatPage = defaultFormatPage,
  ...props
}: DataTablePaginationProps) {
  const labels = { ...defaultPaginationLabels, ...labelOverrides }
  const table = useDataTableContext()
  const { pageIndex, pageSize } = table.state.pagination
  const pageCount = Math.max(1, table.getPageCount())
  const selected = Object.keys(table.state.rowSelection).length
  const total = table.getFilteredRowModel().rows.length

  return (
    <div
      data-slot="data-table-pagination"
      className={cn(
        "flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm text-muted-foreground",
        className
      )}
      {...props}
    >
      <div className="min-w-0 tabular-nums [unicode-bidi:plaintext]">
        {showSelection ? formatSelection(selected, total) : formatRows(total)}
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <label className="flex items-center gap-2">
          <span className="max-sm:sr-only">{labels.rowsPerPage}</span>
          <span className="relative flex items-center">
            <select
              value={pageSize}
              onChange={(event) =>
                table.setPageSize(Number(event.target.value))
              }
              className={cn(
                fieldClassName,
                "w-auto cursor-pointer appearance-none ps-2.5 pe-7 text-foreground tabular-nums"
              )}
            >
              {pageSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <IconChevronDown
              aria-hidden
              className="pointer-events-none absolute end-2 size-3.5 text-muted-foreground"
            />
          </span>
        </label>
        <div
          className="text-foreground tabular-nums [unicode-bidi:plaintext]"
          aria-live="polite"
        >
          {formatPage(pageIndex + 1, pageCount)}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            className="max-sm:hidden"
            aria-label={labels.firstPage}
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.firstPage()}
          >
            <IconChevronsLeft className="rtl:-scale-x-100" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={labels.previousPage}
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <IconChevronLeft className="rtl:-scale-x-100" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={labels.nextPage}
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            <IconChevronRight className="rtl:-scale-x-100" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            className="max-sm:hidden"
            aria-label={labels.lastPage}
            disabled={!table.getCanNextPage()}
            onClick={() => table.lastPage()}
          >
            <IconChevronsRight className="rtl:-scale-x-100" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export {
  DataTable,
  DataTableToolbar,
  DataTableSearch,
  DataTableViewOptions,
  DataTableContent,
  DataTableColumnHeader,
  DataTableSelectAll,
  DataTableSelectRow,
  DataTablePagination,
  createDataTableColumns,
  dataTableFeatures,
  useDataTable,
  useDataTableContext,
}
export type {
  DataTableFeatures,
  DataTableInstance,
  DataTablePaginationLabels,
  UseDataTableOptions,
}
