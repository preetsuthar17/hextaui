"use client"

import * as React from "react"
import {
  IconCheck,
  IconChevronRight,
  IconLoader2,
  IconMinus,
  IconRefresh,
} from "@tabler/icons-react"
import * as TreePrimitive from "@ui-sdk/react/tree"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

type ClassName<State> =
  string | ((state: State) => string | undefined) | undefined

function mergeClassName<State>(base: string, className: ClassName<State>) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

const treeVariants = cva(
  "group/tree relative flex w-full min-w-0 flex-col text-sm text-foreground [--tree-chevron:--spacing(4)] [--tree-indent:calc(var(--tree-chevron)+var(--tree-gap))] [--tree-leaf:0px] has-data-[slot=tree-indicator]:[--tree-leaf:var(--tree-indent)]",
  {
    variants: {
      variant: {
        default: "",
        lines: "",
      },
      size: {
        default:
          "[--tree-gap:--spacing(1.5)] [--tree-row-height:--spacing(8)] [--tree-row-px:--spacing(2)] pointer-coarse:[--tree-row-height:--spacing(10)]",
        sm: "[--tree-gap:--spacing(1)] [--tree-row-height:--spacing(7)] [--tree-row-px:--spacing(1.5)] pointer-coarse:[--tree-row-height:--spacing(9)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type TreeProps<Mode extends TreePrimitive.TreeMode = "single"> =
  TreePrimitive.TreeProps<Mode> & VariantProps<typeof treeVariants>

function Tree<Mode extends TreePrimitive.TreeMode = "single">({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: TreeProps<Mode>) {
  const { items, paths } = props
  const data = React.useMemo(
    () => items ?? (paths ? TreePrimitive.treeFromPaths(paths) : undefined),
    [items, paths]
  )

  return (
    <TreePrimitive.Tree<Mode>
      data-variant={variant}
      data-size={size}
      className={mergeClassName(treeVariants({ variant, size }), className)}
      {...props}
    >
      {children ?? (data ? <TreeItems items={data} /> : null)}
    </TreePrimitive.Tree>
  )
}

function TreeItem({
  className,
  ...props
}: React.ComponentProps<typeof TreePrimitive.TreeItem>) {
  return (
    <TreePrimitive.TreeItem
      className={mergeClassName(
        "relative flex min-w-0 flex-col outline-none [&:focus-visible>[data-slot=tree-label]]:z-10 [&:focus-visible>[data-slot=tree-label]]:ring-3 [&:focus-visible>[data-slot=tree-label]]:ring-focus-ring [&:focus-visible>[data-slot=tree-label]]:outline-1 [&:focus-visible>[data-slot=tree-label]]:-outline-offset-1 [&:focus-visible>[data-slot=tree-label]]:outline-ring [&:focus-visible>[data-slot=tree-label]]:outline-solid [&:focus-visible>[data-slot=tree-label]]:ring-inset",
        className
      )}
      {...props}
    />
  )
}

function TreeItemLabel({
  className,
  ...props
}: React.ComponentProps<typeof TreePrimitive.TreeItemLabel>) {
  return (
    <TreePrimitive.TreeItemLabel
      className={mergeClassName(
        "group/tree-label relative flex h-(--tree-row-height) min-w-0 shrink-0 cursor-default items-center gap-(--tree-gap) rounded-md px-(--tree-row-px) text-start text-foreground no-underline transition-[background-color,color] duration-150 select-none [-webkit-tap-highlight-color:transparent] not-data-branch:ps-[calc(var(--tree-row-px)+var(--tree-leaf))] hover:bg-muted/60 data-current:bg-muted data-current:font-medium data-pending:text-muted-foreground data-[selected]:bg-muted data-[selected]:hover:bg-muted forced-colors:data-current:outline-2 forced-colors:data-current:-outline-offset-2 forced-colors:data-current:outline-solid forced-colors:data-[selected]:outline-2 forced-colors:data-[selected]:-outline-offset-2 forced-colors:data-[selected]:outline-solid data-disabled:cursor-not-allowed data-disabled:opacity-50 data-disabled:hover:bg-transparent [&_svg]:pointer-events-none [&_svg]:shrink-0 [&>span:not([data-slot])]:truncate [&>svg]:text-muted-foreground [&>svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function TreeItemIndicator({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TreePrimitive.TreeItemIndicator>) {
  return (
    <TreePrimitive.TreeItemIndicator
      className={mergeClassName(
        "relative grid size-(--tree-chevron) shrink-0 place-items-center text-muted-foreground transition-colors duration-150 group-hover/tree-label:text-foreground after:absolute after:-inset-x-1 after:-inset-y-2 rtl:-scale-x-100 [&>svg]:size-4 [&>svg]:transition-[rotate] [&>svg]:duration-200 [&>svg]:ease-out-quint data-expanded:[&>svg]:rotate-90 motion-reduce:[&>svg]:transition-none",
        className
      )}
      {...props}
    >
      {children ??
        ((state) =>
          state.loading ? (
            <IconLoader2
              aria-hidden="true"
              className="motion-safe:animate-spin"
            />
          ) : state.failed ? (
            <IconRefresh aria-hidden="true" className="text-destructive" />
          ) : (
            <IconChevronRight aria-hidden="true" />
          ))}
    </TreePrimitive.TreeItemIndicator>
  )
}

function TreeItemCheckbox({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TreePrimitive.TreeItemCheckbox>) {
  return (
    <TreePrimitive.TreeItemCheckbox
      className={mergeClassName(
        "relative inline-flex size-4 shrink-0 items-center justify-center rounded-[calc(var(--radius-sm)*0.5)] bg-background text-primary-foreground inset-ring-(length:--hairline) inset-ring-muted-foreground/80 transition-[background-color,box-shadow] duration-150 ease-out-quint group-hover/tree-label:inset-ring-foreground/70 data-indeterminate:bg-primary data-indeterminate:inset-ring-primary dark:bg-input/30 dark:data-indeterminate:bg-primary forced-colors:border data-checked:bg-primary data-checked:inset-ring-primary dark:data-checked:bg-primary [&>svg]:size-3.5",
        className
      )}
      {...props}
    >
      {children ??
        ((state) =>
          state.checked === "indeterminate" ? (
            <IconMinus aria-hidden="true" stroke={2.75} />
          ) : state.checked ? (
            <IconCheck aria-hidden="true" stroke={2.75} />
          ) : null)}
    </TreePrimitive.TreeItemCheckbox>
  )
}

function TreeGroup({
  className,
  ...props
}: React.ComponentProps<typeof TreePrimitive.TreeGroup>) {
  return (
    <TreePrimitive.TreeGroup
      className={mergeClassName(
        "relative flex h-(--tree-group-height) min-w-0 flex-col overflow-hidden ps-(--tree-indent) transition-[height] duration-200 ease-out-quint group-data-[variant=lines]/tree:before:pointer-events-none group-data-[variant=lines]/tree:before:absolute group-data-[variant=lines]/tree:before:inset-y-0 group-data-[variant=lines]/tree:before:start-[calc(var(--tree-row-px)+var(--tree-chevron)/2)] group-data-[variant=lines]/tree:before:border-s group-data-[variant=lines]/tree:before:border-border data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

function TreeItems({ items }: { items: TreePrimitive.TreeItemData[] }) {
  return items.map((item) => (
    <TreeItem
      key={item.value}
      value={item.value}
      disabled={item.disabled}
      branch={item.children ? true : undefined}
    >
      <TreeItemLabel render={item.href ? <a href={item.href} /> : undefined}>
        {item.children && <TreeItemIndicator />}
        <span>{item.label}</span>
      </TreeItemLabel>
      {item.children && item.children.length > 0 && (
        <TreeGroup>
          <TreeItems items={item.children} />
        </TreeGroup>
      )}
    </TreeItem>
  ))
}

const createTreeController = TreePrimitive.createTreeController
const treeFromPaths = TreePrimitive.treeFromPaths
const visibleTreeRows = TreePrimitive.visibleTreeRows

export {
  Tree,
  TreeItem,
  TreeItemLabel,
  TreeItemIndicator,
  TreeItemCheckbox,
  TreeGroup,
  TreeItems,
  createTreeController,
  treeFromPaths,
  treeVariants,
  visibleTreeRows,
}
export type { TreeProps }
export type {
  TreeItemData,
  TreeMode,
  TreeValue,
  TreeCheckStrategy,
  TreeController,
} from "@ui-sdk/react/tree"
