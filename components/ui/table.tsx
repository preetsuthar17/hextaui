"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

function mergeRefs<T>(
  ...refs: (React.Ref<T> | ((node: T | null) => void) | undefined)[]
) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    }
  }
}

function useScrollEdges(container: HTMLDivElement | null) {
  React.useLayoutEffect(() => {
    if (!container) {
      return
    }
    const update = () => {
      const offset = Math.abs(container.scrollLeft)
      const max = container.scrollWidth - container.clientWidth
      const overflowing =
        max > 0.5 || container.scrollHeight - container.clientHeight > 0.5
      container.toggleAttribute("data-scrolled-start", offset > 0.5)
      container.toggleAttribute("data-scrolled-end", offset < max - 0.5)
      container.toggleAttribute("data-scrolled-top", container.scrollTop > 0.5)
      container.toggleAttribute("data-overflowing", overflowing)
      if (overflowing) {
        container.tabIndex = 0
      } else {
        container.removeAttribute("tabindex")
      }
    }
    update()
    container.addEventListener("scroll", update, { passive: true })
    const observer =
      typeof ResizeObserver === "function" ? new ResizeObserver(update) : null
    observer?.observe(container)
    const table = container.firstElementChild
    if (table) {
      observer?.observe(table)
    }
    return () => {
      container.removeEventListener("scroll", update)
      observer?.disconnect()
    }
  }, [container])
}

const tableVariants = cva(
  "group/table relative w-full min-w-0 [--table-bg:var(--background)] [--table-hover:color-mix(in_oklab,var(--muted)_60%,var(--table-bg))] in-data-[slot=card]:[--table-bg:var(--card)] in-data-[slot=popover-content]:[--table-bg:var(--popover)]",
  {
    variants: {
      variant: {
        default: "",
        surface:
          "isolate overflow-clip rounded-xl bg-(--table-bg) ring-(length:--hairline) ring-border [--table-bg:var(--card)] [--table-head-bg:color-mix(in_oklab,var(--muted)_85%,var(--table-bg))] in-data-[slot=card]:[--table-bg:var(--card)] forced-colors:border",
      },
      size: {
        sm: "[--table-cell-px:--spacing(2.5)] [--table-cell-py:--spacing(1.5)] [--table-head-h:--spacing(8)]",
        default:
          "[--table-cell-px:--spacing(3)] [--table-cell-py:--spacing(2.5)] [--table-head-h:--spacing(10)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type TableVariant = NonNullable<VariantProps<typeof tableVariants>["variant"]>
type TableSize = NonNullable<VariantProps<typeof tableVariants>["size"]>

type TableProps = React.ComponentProps<"table"> & {
  variant?: TableVariant
  size?: TableSize
  wrap?: boolean
  scrollFade?: boolean
  stickyHeader?: boolean
  containerClassName?: string
  containerRef?: React.Ref<HTMLDivElement>
}

function Table({
  className,
  variant = "default",
  size = "default",
  wrap = false,
  scrollFade = true,
  stickyHeader = false,
  containerClassName,
  containerRef,
  ...props
}: TableProps) {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null)
  useScrollEdges(container)

  const setRef = React.useMemo(
    () => mergeRefs(setContainer, containerRef),
    [containerRef]
  )

  return (
    <div
      data-slot="table-frame"
      data-variant={variant}
      data-size={size}
      data-wrap={wrap ? "" : undefined}
      className={tableVariants({ variant, size })}
    >
      <div
        ref={setRef}
        data-slot="table-container"
        data-sticky-header={stickyHeader ? "" : undefined}
        className={cn(
          "relative w-full overflow-x-auto overscroll-x-none rounded-[inherit] outline-none [--fade-end:0px] [--fade-start:0px] focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden focus-visible:ring-inset data-sticky-header:overflow-y-auto",
          scrollFade &&
            "not-has-[[data-pinned]]:mask-[linear-gradient(to_right,transparent,#000_var(--fade-start),#000_calc(100%-var(--fade-end)),transparent)] data-scrolled-end:[--fade-end:--spacing(8)] data-scrolled-start:[--fade-start:--spacing(8)] rtl:not-has-[[data-pinned]]:mask-[linear-gradient(to_left,transparent,#000_var(--fade-start),#000_calc(100%-var(--fade-end)),transparent)]",
          containerClassName
        )}
      >
        <table
          data-slot="table"
          className={cn(
            "w-full caption-bottom border-separate border-spacing-0 text-sm",
            className
          )}
          {...props}
        />
      </div>
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "[&_tr]:bg-transparent [&_tr]:hover:bg-transparent",
        className
      )}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(
        "[&>tr:last-child>*]:border-b-0 [&>tr:last-child>*]:border-b-transparent",
        className
      )}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "font-medium [&>tr>*]:border-t [&>tr>*]:border-b-0 [&>tr>*]:bg-(--table-head-bg,var(--table-bg))",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "group/table-row bg-(--table-bg) hover:bg-(--table-hover) data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    />
  )
}

const cellBase =
  "border-b align-middle whitespace-nowrap group-data-wrap/table:align-top group-data-wrap/table:whitespace-normal group-data-wrap/table:text-pretty group-data-wrap/table:wrap-break-word data-[align=center]:text-center data-[align=end]:text-end data-[align=end]:tabular-nums data-pinned:sticky data-pinned:z-1 data-pinned:has-[:focus-visible]:z-4 data-pinned:has-[[data-slot=checkbox]]:z-2 data-pinned:bg-(--table-bg) group-hover/table-row:data-pinned:bg-(--table-hover) group-data-[state=selected]/table-row:data-pinned:bg-muted data-[pinned=start]:start-(--pin-offset) data-[pinned=end]:end-(--pin-offset) data-pinned:[--pin-offset:0px] data-pinned-edge:after:pointer-events-none data-pinned-edge:after:absolute data-pinned-edge:after:inset-y-0 data-pinned-edge:after:hidden data-pinned-edge:after:w-4 data-[pinned=start]:data-pinned-edge:after:-end-4 data-[pinned=start]:data-pinned-edge:after:bg-linear-to-r data-[pinned=start]:data-pinned-edge:after:from-foreground/6 data-[pinned=start]:data-pinned-edge:after:to-transparent rtl:data-[pinned=start]:data-pinned-edge:after:bg-linear-to-l data-[pinned=end]:data-pinned-edge:after:-start-4 data-[pinned=end]:data-pinned-edge:after:bg-linear-to-l data-[pinned=end]:data-pinned-edge:after:from-foreground/6 data-[pinned=end]:data-pinned-edge:after:to-transparent rtl:data-[pinned=end]:data-pinned-edge:after:bg-linear-to-r in-data-scrolled-start:data-[pinned=start]:data-pinned-edge:after:block in-data-scrolled-end:data-[pinned=end]:data-pinned-edge:after:block [&:has([role=checkbox])]:w-px [&>[role=checkbox]]:flex group-data-[variant=surface]/table:first:ps-4 group-data-[variant=surface]/table:last:pe-4"

type TableCellExtraProps = {
  align?: "start" | "center" | "end"
  pinned?: "start" | "end"
  pinnedEdge?: boolean
}

function TableHead({
  className,
  align,
  pinned,
  pinnedEdge,
  ...props
}: Omit<React.ComponentProps<"th">, "align"> & TableCellExtraProps) {
  return (
    <th
      data-slot="table-head"
      data-align={align}
      data-pinned={pinned}
      data-pinned-edge={pinnedEdge ? "" : undefined}
      className={cn(
        cellBase,
        "h-(--table-head-h) bg-(--table-head-bg,var(--table-bg)) px-(--table-cell-px) text-start font-medium text-muted-foreground group-data-wrap/table:align-middle in-data-scrolled-top:shadow-[inset_0_calc(var(--hairline)*-1)_0_var(--border)] in-data-sticky-header:sticky in-data-sticky-header:top-0 in-data-sticky-header:z-2 in-[tbody]:h-auto in-[tbody]:bg-transparent in-[tbody]:py-(--table-cell-py) in-[tbody]:text-foreground in-[tbody]:shadow-none in-[tbody]:group-data-wrap/table:align-top data-pinned:bg-(--table-head-bg,var(--table-bg)) in-data-sticky-header:data-pinned:z-3 in-[tbody]:data-pinned:bg-(--table-bg) in-[tbody]:group-hover/table-row:data-pinned:bg-(--table-hover) in-[tbody]:group-data-[state=selected]/table-row:data-pinned:bg-muted [&:has([role=checkbox])]:pe-0",
        className
      )}
      {...props}
    />
  )
}

function TableCell({
  className,
  align,
  pinned,
  pinnedEdge,
  ...props
}: Omit<React.ComponentProps<"td">, "align"> & TableCellExtraProps) {
  return (
    <td
      data-slot="table-cell"
      data-align={align}
      data-pinned={pinned}
      data-pinned-edge={pinnedEdge ? "" : undefined}
      className={cn(
        cellBase,
        "px-(--table-cell-px) py-(--table-cell-py) [&:has([role=checkbox])]:pe-0",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn(
        "mt-4 text-sm text-muted-foreground group-data-[variant=surface]/table:mt-0 group-data-[variant=surface]/table:border-t group-data-[variant=surface]/table:px-4 group-data-[variant=surface]/table:py-2.5 group-data-[variant=surface]/table:text-start",
        className
      )}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  tableVariants,
}
export type { TableProps, TableSize, TableVariant }
