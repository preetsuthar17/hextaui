"use client"

import * as React from "react"
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { IconChevronRight } from "@tabler/icons-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { Checkbox } from "@/components/ui/checkbox"

const treeVariants = cva(
  "relative flex w-full min-w-0 flex-col text-sm text-foreground [--tree-chevron:--spacing(4)] [--tree-indent:calc(var(--tree-chevron)+var(--tree-gap))]",
  {
    variants: {
      variant: {
        default: "",
        lines: "",
        connectors: "",
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

const treeItemVariants = cva(
  "relative flex min-w-0 flex-col [&:has(>[data-slot=tree-group])>[data-slot=tree-item-label]>[data-slot=tree-item-indicator]>svg]:visible",
  {
    variants: {
      variant: {
        default: "",
        lines: "",
        connectors:
          "in-data-[slot=tree-group-inner]:before:pointer-events-none in-data-[slot=tree-group-inner]:before:absolute in-data-[slot=tree-group-inner]:before:inset-y-0 in-data-[slot=tree-group-inner]:before:start-[calc(var(--tree-row-px)+var(--tree-chevron)/2-var(--tree-indent))] in-data-[slot=tree-group-inner]:before:border-s in-data-[slot=tree-group-inner]:before:border-border in-data-[slot=tree-group-inner]:after:pointer-events-none in-data-[slot=tree-group-inner]:after:absolute in-data-[slot=tree-group-inner]:after:start-[calc(var(--tree-row-px)+var(--tree-chevron)/2-var(--tree-indent))] in-data-[slot=tree-group-inner]:after:top-0 in-data-[slot=tree-group-inner]:after:h-[calc(var(--tree-row-height)/2)] in-data-[slot=tree-group-inner]:after:w-[calc(var(--tree-indent)-var(--tree-chevron)/2+var(--tree-chevron)+var(--tree-gap)-var(--spacing))] in-data-[slot=tree-group-inner]:after:rounded-es-sm in-data-[slot=tree-group-inner]:after:border-s in-data-[slot=tree-group-inner]:after:border-b in-data-[slot=tree-group-inner]:after:border-border in-data-[slot=tree-group-inner]:last:before:hidden in-data-[slot=tree-group-inner]:has-[>[data-slot=tree-group]]:after:w-[calc(var(--tree-indent)-var(--tree-chevron)/2+var(--spacing)*0.5)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const treeGroupVariants = cva(
  "relative flex min-w-0 flex-col ps-(--tree-indent)",
  {
    variants: {
      variant: {
        default: "",
        lines:
          "before:pointer-events-none before:absolute before:inset-y-0 before:start-[calc(var(--tree-row-px)+var(--tree-chevron)/2)] before:border-s before:border-border before:transition-[border-color] before:duration-150 has-[>[data-slot=tree-item]>[data-slot=tree-item-label]:focus-visible]:before:border-muted-foreground/60 has-[>[data-slot=tree-item]>[data-slot=tree-item-label][data-selected]]:before:border-muted-foreground/60",
        connectors: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type TreeVariant = NonNullable<VariantProps<typeof treeVariants>["variant"]>
type TreeSize = NonNullable<VariantProps<typeof treeVariants>["size"]>
type TreeSelectionMode = "none" | "single" | "multiple"
type TreeCheckState = "checked" | "unchecked" | "mixed"

type TreeNode = {
  parent: string | null
  disabled: boolean
  onExpandedChange: (expanded: boolean) => void
}

type TreeRegistry = ReturnType<typeof createTreeRegistry>

function createTreeRegistry() {
  const nodes = new Map<string, TreeNode>()
  const listeners = new Set<() => void>()
  let version = 0

  const emit = () => {
    version += 1
    for (const listener of listeners) {
      listener()
    }
  }

  return {
    nodes,
    register(value: string, node: TreeNode) {
      nodes.set(value, node)
      emit()
      return () => {
        if (nodes.get(value) === node) {
          nodes.delete(value)
          emit()
        }
      }
    },
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    getVersion: () => version,
  }
}

function getChildren(nodes: Map<string, TreeNode>) {
  const children = new Map<string | null, string[]>()
  for (const [value, node] of nodes) {
    const parent =
      node.parent !== null && nodes.has(node.parent) ? node.parent : null
    const list = children.get(parent)
    if (list) {
      list.push(value)
    } else {
      children.set(parent, [value])
    }
  }
  return children
}

function getCheckStates(
  children: Map<string | null, string[]>,
  checked: Set<string>
) {
  const states = new Map<string, TreeCheckState>()

  const visit = (value: string, inherited: boolean): TreeCheckState => {
    states.set(value, "unchecked")
    const self = inherited || checked.has(value)
    const kids = children.get(value)
    let state: TreeCheckState = self ? "checked" : "unchecked"
    if (kids?.length) {
      let all = true
      let none = true
      for (const kid of kids) {
        const kidState = visit(kid, self)
        if (kidState !== "checked") {
          all = false
        }
        if (kidState !== "unchecked") {
          none = false
        }
      }
      state = all ? "checked" : none ? "unchecked" : "mixed"
    }
    states.set(value, state)
    return state
  }

  for (const root of children.get(null) ?? []) {
    visit(root, false)
  }
  return states
}

function toggleChecked(
  value: string,
  nodes: Map<string, TreeNode>,
  children: Map<string | null, string[]>,
  states: Map<string, TreeCheckState>
) {
  const isLeaf = (item: string) => !children.get(item)?.length
  const leaves: string[] = []
  const collect = (item: string) => {
    if (nodes.get(item)?.disabled) {
      return
    }
    if (isLeaf(item)) {
      leaves.push(item)
    }
    for (const kid of children.get(item) ?? []) {
      collect(kid)
    }
  }
  collect(value)

  if (leaves.length === 0) {
    return null
  }

  const target = leaves.some((leaf) => states.get(leaf) !== "checked")
  const next = new Set<string>()
  for (const [item, state] of states) {
    if (state === "checked" && isLeaf(item)) {
      next.add(item)
    }
  }
  for (const leaf of leaves) {
    if (target) {
      next.add(leaf)
    } else {
      next.delete(leaf)
    }
  }

  const result: string[] = []
  for (const [item, state] of getCheckStates(children, next)) {
    if (state === "checked") {
      result.push(item)
    }
  }
  return result
}

type ClassName<State> =
  string | ((state: State) => string | undefined) | undefined

function mergeClassName<State>(base: string, className: ClassName<State>) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

function useLatest<T>(value: T) {
  const ref = React.useRef(value)
  React.useLayoutEffect(() => {
    ref.current = value
  })
  return ref
}

function useControllableValues(
  value: string[] | undefined,
  defaultValue: string[] | undefined,
  onChange: ((values: string[]) => void) | undefined
) {
  const [internal, setInternal] = React.useState<string[]>(
    () => defaultValue ?? []
  )
  const controlled = value !== undefined
  const current = controlled ? value : internal
  const latest = React.useRef(current)
  const onChangeRef = useLatest(onChange)

  React.useLayoutEffect(() => {
    latest.current = current
  }, [current])

  const set = React.useCallback(
    (update: (previous: string[]) => string[]) => {
      const previous = latest.current
      const next = update(previous)
      if (
        next.length === previous.length &&
        next.every((item, index) => item === previous[index])
      ) {
        return
      }
      latest.current = next
      if (!controlled) {
        setInternal(next)
      }
      onChangeRef.current?.(next)
    },
    [controlled, onChangeRef]
  )

  return [current, set, latest] as const
}

type TreeContextValue = {
  variant: TreeVariant
  size: TreeSize
  selectionMode: TreeSelectionMode
  checkboxes: boolean
  disabled: boolean
  hiddenUntilFound: boolean
  expanded: Set<string>
  selected: Set<string>
  checkStates: Map<string, TreeCheckState>
  activeValue: string | null
  registry: TreeRegistry
  setExpanded: (value: string, expanded: boolean) => void
  activate: (
    value: string,
    options: { range?: boolean; toggle?: boolean; expand?: boolean }
  ) => void
  toggleExpanded: (value: string) => void
  toggleCheck: (value: string) => void
  setActiveValue: (value: string) => void
}

const TreeContext = React.createContext<TreeContextValue | null>(null)

function useTreeContext(part: string) {
  const context = React.useContext(TreeContext)
  if (!context) {
    throw new Error(`${part} must be used within <Tree>.`)
  }
  return context
}

type TreeItemContextValue = {
  value: string
  depth: number
  disabled: boolean
  expanded: boolean
  hasGroup: boolean
  groupId: string
  registerGroup: () => () => void
}

const TreeItemContext = React.createContext<TreeItemContextValue | null>(null)

function useTreeItemContext(part: string) {
  const context = React.useContext(TreeItemContext)
  if (!context) {
    throw new Error(`${part} must be used within <TreeItem>.`)
  }
  return context
}

const rowSelector = '[data-slot="tree-item-label"]'

function ownsRow(root: HTMLElement, row: Element) {
  return row.closest('[data-slot="tree"]') === root
}

function isRowVisible(root: HTMLElement, row: HTMLElement) {
  let item = row.parentElement?.parentElement?.closest<HTMLElement>(
    '[data-slot="tree-item"]'
  )
  while (item && root.contains(item)) {
    if (!item.hasAttribute("data-open")) {
      return false
    }
    item = item.parentElement?.closest<HTMLElement>('[data-slot="tree-item"]')
  }
  return true
}

function getRows(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>(rowSelector)).filter(
    (row) =>
      ownsRow(root, row) &&
      row.getAttribute("aria-disabled") !== "true" &&
      isRowVisible(root, row)
  )
}

function getRowValue(row: HTMLElement) {
  return row.dataset.value ?? ""
}

function getRowGroup(row: HTMLElement) {
  return row.parentElement?.querySelector<HTMLElement>(
    ':scope > [data-slot="tree-group"]'
  )
}

function getRowText(row: HTMLElement) {
  return (
    row.querySelector('[data-slot="tree-item-text"]')?.textContent ??
    row.textContent ??
    ""
  )
    .trim()
    .toLowerCase()
}

function isRtl(root: HTMLElement) {
  return (
    root.closest("[dir]")?.getAttribute("dir") === "rtl" ||
    getComputedStyle(root).direction === "rtl"
  )
}

function focusRow(row: HTMLElement | undefined) {
  if (!row) {
    return false
  }
  row.focus()
  row.scrollIntoView?.({ block: "nearest" })
  return true
}

type TreeProps = useRender.ComponentProps<"div"> & {
  variant?: TreeVariant
  size?: TreeSize
  selectionMode?: TreeSelectionMode
  selectedValues?: string[]
  defaultSelectedValues?: string[]
  onSelectedValuesChange?: (values: string[]) => void
  expandedValues?: string[]
  defaultExpandedValues?: string[]
  onExpandedValuesChange?: (values: string[]) => void
  checkboxes?: boolean
  checkedValues?: string[]
  defaultCheckedValues?: string[]
  onCheckedValuesChange?: (values: string[]) => void
  disabled?: boolean
  hiddenUntilFound?: boolean
}

function Tree({
  className,
  render,
  variant = "default",
  size = "default",
  selectionMode = "single",
  selectedValues,
  defaultSelectedValues,
  onSelectedValuesChange,
  expandedValues,
  defaultExpandedValues,
  onExpandedValuesChange,
  checkboxes = false,
  checkedValues,
  defaultCheckedValues,
  onCheckedValuesChange,
  disabled = false,
  hiddenUntilFound = true,
  onKeyDown,
  ref,
  ...props
}: TreeProps) {
  const resolvedVariant = variant ?? "default"
  const resolvedSize = size ?? "default"
  const [registry] = React.useState(createTreeRegistry)
  const version = React.useSyncExternalStore(
    registry.subscribe,
    registry.getVersion,
    registry.getVersion
  )
  const rootRef = React.useRef<HTMLElement | null>(null)
  const anchorRef = React.useRef<string | null>(null)
  const typeaheadRef = React.useRef({ buffer: "", timer: 0 })
  const [activeValue, setActiveValue] = React.useState<string | null>(null)

  const [expandedList, setExpandedList, latestExpanded] = useControllableValues(
    expandedValues,
    defaultExpandedValues,
    onExpandedValuesChange
  )
  const [selectedList, setSelectedList] = useControllableValues(
    selectedValues,
    defaultSelectedValues,
    onSelectedValuesChange
  )
  const [checkedList, setCheckedList] = useControllableValues(
    checkedValues,
    defaultCheckedValues,
    onCheckedValuesChange
  )

  const expanded = React.useMemo(() => new Set(expandedList), [expandedList])
  const selected = React.useMemo(() => new Set(selectedList), [selectedList])
  const children = React.useMemo(
    () => getChildren(registry.nodes),
    [registry, version]
  )
  const checkStates = React.useMemo(
    () => getCheckStates(children, new Set(checkedList)),
    [children, checkedList]
  )
  const latest = useLatest({ children, checkStates, selectionMode, disabled })

  const commitExpanded = React.useCallback(
    (update: (previous: string[]) => string[]) => {
      const before = new Set(latestExpanded.current)
      setExpandedList(update)
      const after = new Set(latestExpanded.current)
      for (const value of new Set([...before, ...after])) {
        if (before.has(value) !== after.has(value)) {
          registry.nodes.get(value)?.onExpandedChange(after.has(value))
        }
      }
    },
    [latestExpanded, registry, setExpandedList]
  )

  const setExpanded = React.useCallback(
    (value: string, open: boolean) => {
      commitExpanded((previous) =>
        open
          ? previous.includes(value)
            ? previous
            : [...previous, value]
          : previous.filter((item) => item !== value)
      )
    },
    [commitExpanded]
  )

  const toggleExpanded = React.useCallback(
    (value: string) => {
      setExpanded(value, !latestExpanded.current.includes(value))
    },
    [latestExpanded, setExpanded]
  )

  const selectRange = React.useCallback(
    (to: string) => {
      const root = rootRef.current
      const from = anchorRef.current ?? to
      if (!root) {
        return
      }
      const values = getRows(root).map(getRowValue)
      const start = values.indexOf(from)
      const end = values.indexOf(to)
      if (start === -1 || end === -1) {
        setSelectedList(() => [to])
        return
      }
      setSelectedList(() =>
        values.slice(Math.min(start, end), Math.max(start, end) + 1)
      )
    },
    [setSelectedList]
  )

  const activate = React.useCallback<TreeContextValue["activate"]>(
    (value, { range = false, toggle = false, expand = true }) => {
      const { selectionMode: mode } = latest.current
      if (mode === "single") {
        anchorRef.current = value
        setSelectedList(() => [value])
      } else if (mode === "multiple") {
        if (range) {
          selectRange(value)
        } else if (toggle) {
          anchorRef.current = value
          setSelectedList((previous) =>
            previous.includes(value)
              ? previous.filter((item) => item !== value)
              : [...previous, value]
          )
        } else {
          anchorRef.current = value
          setSelectedList(() => [value])
        }
      }
      if (expand && !range && !toggle) {
        const root = rootRef.current
        const row = root
          ? getRows(root).find((item) => getRowValue(item) === value)
          : undefined
        if (row && getRowGroup(row)) {
          toggleExpanded(value)
        }
      }
    },
    [latest, selectRange, setSelectedList, toggleExpanded]
  )

  const toggleCheck = React.useCallback(
    (value: string) => {
      const { children: kids, checkStates: states } = latest.current
      const next = toggleChecked(value, registry.nodes, kids, states)
      if (next) {
        setCheckedList(() => next)
      }
    },
    [latest, registry, setCheckedList]
  )

  React.useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) {
      return
    }
    const rows = getRows(root)
    if (rows.length === 0) {
      return
    }
    if (rows.some((row) => getRowValue(row) === activeValue)) {
      return
    }
    let fallback: HTMLElement | undefined
    let parent =
      activeValue !== null
        ? (registry.nodes.get(activeValue)?.parent ?? null)
        : null
    while (parent !== null && !fallback) {
      const value = parent
      fallback = rows.find((row) => getRowValue(row) === value)
      parent = registry.nodes.get(value)?.parent ?? null
    }
    fallback ??=
      rows.find(
        (row) =>
          row.hasAttribute("data-selected") || row.hasAttribute("data-checked")
      ) ?? rows[0]
    const focused = root.ownerDocument.activeElement
    if (
      focused instanceof HTMLElement &&
      focused.matches(rowSelector) &&
      ownsRow(root, focused) &&
      !rows.includes(focused)
    ) {
      fallback.focus({ preventScroll: true })
    }
    setActiveValue(getRowValue(fallback))
  }, [activeValue, expanded, registry, version, disabled])

  React.useEffect(() => {
    const typeahead = typeaheadRef.current
    return () => window.clearTimeout(typeahead.timer)
  }, [])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const root = event.currentTarget
    const row = event.target as HTMLElement
    if (
      !row.matches?.(rowSelector) ||
      !ownsRow(root, row) ||
      row.getAttribute("aria-disabled") === "true"
    ) {
      return
    }

    const rtl = isRtl(root)
    const key =
      event.key === "ArrowRight"
        ? rtl
          ? "ArrowLeft"
          : "ArrowRight"
        : event.key === "ArrowLeft"
          ? rtl
            ? "ArrowRight"
            : "ArrowLeft"
          : event.key
    const value = getRowValue(row)
    const rows = getRows(root)
    const index = rows.indexOf(row)
    const group = getRowGroup(row)
    const isExpanded = latestExpanded.current.includes(value)
    const modifier = event.altKey || event.ctrlKey || event.metaKey
    const { selectionMode: mode } = latest.current
    const multiple = mode === "multiple" && !checkboxes

    const move = (target: HTMLElement | undefined) => {
      event.preventDefault()
      if (!target) {
        return
      }
      focusRow(target)
      if (event.shiftKey && multiple) {
        anchorRef.current ??= value
        selectRange(getRowValue(target))
      }
    }

    switch (key) {
      case "ArrowDown":
        if (!modifier) {
          move(rows[index + 1])
        }
        return
      case "ArrowUp":
        if (!modifier) {
          move(rows[index - 1])
        }
        return
      case "Home":
        if (!event.altKey && !event.metaKey) {
          move(rows[0])
        }
        return
      case "End":
        if (!event.altKey && !event.metaKey) {
          move(rows[rows.length - 1])
        }
        return
      case "ArrowRight": {
        if (modifier || event.shiftKey || !group) {
          return
        }
        event.preventDefault()
        if (!isExpanded) {
          setExpanded(value, true)
          return
        }
        const next = rows[index + 1]
        if (next && group.contains(next)) {
          focusRow(next)
        }
        return
      }
      case "ArrowLeft": {
        if (modifier || event.shiftKey) {
          return
        }
        event.preventDefault()
        if (group && isExpanded) {
          setExpanded(value, false)
          return
        }
        const parentRow = row.parentElement?.parentElement
          ?.closest('[data-slot="tree-item"]')
          ?.querySelector<HTMLElement>(`:scope > ${rowSelector}`)
        if (parentRow && ownsRow(root, parentRow)) {
          focusRow(parentRow)
        }
        return
      }
      case "Enter":
        if (modifier || event.shiftKey || row.tagName === "A") {
          return
        }
        event.preventDefault()
        if (checkboxes) {
          toggleCheck(value)
        } else {
          activate(value, {})
        }
        return
      case " ":
        if (modifier) {
          return
        }
        event.preventDefault()
        if (checkboxes) {
          toggleCheck(value)
        } else if (mode === "multiple") {
          activate(value, {
            toggle: !event.shiftKey,
            range: event.shiftKey,
            expand: false,
          })
        } else if (mode === "single") {
          activate(value, { expand: false })
        } else if (group) {
          toggleExpanded(value)
        }
        return
      case "*": {
        event.preventDefault()
        const parentItem = row.parentElement?.parentElement
        const siblings = rows.filter(
          (item) => item.parentElement?.parentElement === parentItem
        )
        commitExpanded((previous) => {
          const next = new Set(previous)
          for (const sibling of siblings) {
            if (getRowGroup(sibling)) {
              next.add(getRowValue(sibling))
            }
          }
          return [...next]
        })
        return
      }
      default:
        break
    }

    if (
      multiple &&
      (event.ctrlKey || event.metaKey) &&
      !event.altKey &&
      event.key.toLowerCase() === "a"
    ) {
      event.preventDefault()
      setSelectedList(() => rows.map(getRowValue))
      return
    }

    if (event.key.length === 1 && !modifier && event.key !== " ") {
      const typeahead = typeaheadRef.current
      window.clearTimeout(typeahead.timer)
      typeahead.buffer += event.key.toLowerCase()
      typeahead.timer = window.setTimeout(() => {
        typeahead.buffer = ""
      }, 500)
      const buffer = typeahead.buffer
      const repeated = buffer.split("").every((char) => char === buffer[0])
      const search = repeated ? buffer[0] : buffer
      const ordered = [
        ...rows.slice(index + (repeated || buffer.length === 1 ? 1 : 0)),
        ...rows.slice(0, index + (repeated || buffer.length === 1 ? 1 : 0)),
      ]
      const match = ordered.find((item) => getRowText(item).startsWith(search))
      if (match) {
        event.preventDefault()
        focusRow(match)
      }
    }
  }

  const setRootRef = React.useCallback(
    (node: HTMLElement | null) => {
      rootRef.current = node
      if (typeof ref === "function") {
        ref(node as HTMLDivElement)
      } else if (ref) {
        ref.current = node as HTMLDivElement
      }
    },
    [ref]
  )

  const context = React.useMemo<TreeContextValue>(
    () => ({
      variant: resolvedVariant,
      size: resolvedSize,
      selectionMode,
      checkboxes,
      disabled,
      hiddenUntilFound,
      expanded,
      selected,
      checkStates,
      activeValue,
      registry,
      setExpanded,
      activate,
      toggleExpanded,
      toggleCheck,
      setActiveValue,
    }),
    [
      resolvedVariant,
      resolvedSize,
      selectionMode,
      checkboxes,
      disabled,
      hiddenUntilFound,
      expanded,
      selected,
      checkStates,
      activeValue,
      registry,
      setExpanded,
      activate,
      toggleExpanded,
      toggleCheck,
    ]
  )

  const element = useRender({
    defaultTagName: "div",
    render,
    ref: setRootRef,
    props: mergeProps<"div">(
      {
        role: "tree",
        "aria-multiselectable":
          selectionMode === "multiple" && !checkboxes ? true : undefined,
        "aria-disabled": disabled || undefined,
        className: cn(
          treeVariants({ variant: resolvedVariant, size: resolvedSize }),
          className
        ),
        onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
          onKeyDown?.(event)
          if (!event.defaultPrevented) {
            handleKeyDown(event)
          }
        },
      },
      props,
      {
        "data-slot": "tree",
        "data-variant": resolvedVariant,
        "data-size": resolvedSize,
      } as Record<string, string>
    ),
  })

  return <TreeContext.Provider value={context}>{element}</TreeContext.Provider>
}

type TreeItemProps = Omit<
  CollapsiblePrimitive.Root.Props,
  "open" | "defaultOpen" | "onOpenChange"
> & {
  value: string
  onExpandedChange?: (expanded: boolean) => void
}

function TreeItem({
  value,
  disabled: disabledProp = false,
  onExpandedChange,
  className,
  ...props
}: TreeItemProps) {
  const tree = useTreeContext("TreeItem")
  const parent = React.useContext(TreeItemContext)
  const disabled = tree.disabled || (parent?.disabled ?? false) || disabledProp
  const expanded = tree.expanded.has(value)
  const depth = parent ? parent.depth + 1 : 1
  const parentValue = parent?.value ?? null
  const groupId = React.useId()
  const [hasGroup, setHasGroup] = React.useState(false)
  const onExpandedChangeRef = useLatest(onExpandedChange)
  const { registry, setExpanded } = tree

  React.useLayoutEffect(
    () =>
      registry.register(value, {
        parent: parentValue,
        disabled,
        onExpandedChange: (open) => onExpandedChangeRef.current?.(open),
      }),
    [registry, value, parentValue, disabled, onExpandedChangeRef]
  )

  const registerGroup = React.useCallback(() => {
    setHasGroup(true)
    return () => setHasGroup(false)
  }, [])

  const context = React.useMemo<TreeItemContextValue>(
    () => ({
      value,
      depth,
      disabled,
      expanded,
      hasGroup,
      groupId,
      registerGroup,
    }),
    [value, depth, disabled, expanded, hasGroup, groupId, registerGroup]
  )

  return (
    <TreeItemContext.Provider value={context}>
      <CollapsiblePrimitive.Root
        data-slot="tree-item"
        role="none"
        open={expanded}
        onOpenChange={(open) => {
          if (!disabled) {
            setExpanded(value, open)
          }
        }}
        disabled={disabled}
        className={mergeClassName(
          treeItemVariants({ variant: tree.variant }),
          className
        )}
        {...props}
      />
    </TreeItemContext.Provider>
  )
}

type TreeItemLabelState = {
  expanded: boolean
  selected: boolean
  disabled: boolean
  checked: TreeCheckState
}

type TreeItemLabelProps = Omit<
  useRender.ComponentProps<"div", TreeItemLabelState>,
  "className"
> & {
  className?: string
  icon?: React.ReactNode
  expandedIcon?: React.ReactNode
  meta?: React.ReactNode
}

function TreeItemLabel({
  className,
  children,
  icon,
  expandedIcon,
  meta,
  render,
  onClick,
  onFocus,
  ...props
}: TreeItemLabelProps) {
  const tree = useTreeContext("TreeItemLabel")
  const item = useTreeItemContext("TreeItemLabel")
  const { value, depth, disabled, expanded, hasGroup, groupId } = item
  const selectable = tree.selectionMode !== "none" && !tree.checkboxes
  const selected = selectable && tree.selected.has(value)
  const checked = tree.checkStates.get(value) ?? "unchecked"
  const active = tree.activeValue === value && !disabled ? 0 : (-1 as const)

  const state: TreeItemLabelState = {
    expanded: hasGroup && expanded,
    selected,
    disabled,
    checked,
  }

  return useRender({
    defaultTagName: "div",
    render,
    state,
    props: mergeProps<"div">(
      {
        role: "treeitem",
        tabIndex: active,
        "aria-level": depth,
        "aria-expanded": hasGroup ? expanded : undefined,
        "aria-owns": hasGroup ? groupId : undefined,
        "aria-selected": selectable ? selected : undefined,
        "aria-checked": tree.checkboxes
          ? checked === "mixed"
            ? "mixed"
            : checked === "checked"
          : undefined,
        "aria-disabled": disabled || undefined,
        className: cn(
          "group/tree-item-label relative flex h-(--tree-row-height) min-w-0 shrink-0 cursor-default items-center gap-(--tree-gap) rounded-md px-(--tree-row-px) text-start text-foreground no-underline transition-[background-color,color,box-shadow] duration-150 outline-none select-none [-webkit-tap-highlight-color:transparent] hover:bg-muted/60 focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-ring focus-visible:outline-solid focus-visible:ring-inset data-[selected]:bg-muted data-[selected]:hover:bg-muted forced-colors:data-[selected]:outline-2 forced-colors:data-[selected]:-outline-offset-2 forced-colors:data-[selected]:outline-solid data-disabled:pointer-events-none data-disabled:opacity-50",
          className
        ),
        onFocus: (event: React.FocusEvent<HTMLDivElement>) => {
          onFocus?.(event)
          if (event.target === event.currentTarget) {
            tree.setActiveValue(value)
          }
        },
        onClick: (event: React.MouseEvent<HTMLDivElement>) => {
          onClick?.(event)
          if (event.defaultPrevented || disabled) {
            return
          }
          const indicator = (event.target as Element).closest?.(
            '[data-slot="tree-item-indicator"]'
          )
          if (indicator && event.currentTarget.contains(indicator)) {
            if (hasGroup) {
              tree.toggleExpanded(value)
            }
            return
          }
          if (tree.checkboxes) {
            tree.toggleCheck(value)
            return
          }
          const pointerType = (event.nativeEvent as PointerEvent).pointerType
          tree.activate(value, {
            range: event.shiftKey,
            toggle:
              event.metaKey ||
              event.ctrlKey ||
              (pointerType === "touch" && tree.selectionMode === "multiple"),
          })
        },
        children: (
          <>
            <span
              data-slot="tree-item-indicator"
              aria-hidden="true"
              className="relative grid size-(--tree-chevron) shrink-0 place-items-center text-muted-foreground transition-colors duration-150 group-hover/tree-item-label:text-foreground after:absolute after:-inset-x-1 after:-inset-y-2 rtl:-scale-x-100 [&>svg]:invisible [&>svg]:size-4 [&>svg]:transition-[rotate] [&>svg]:duration-200 [&>svg]:ease-out-quint group-data-expanded/tree-item-label:[&>svg]:rotate-90 motion-reduce:[&>svg]:transition-none"
            >
              <IconChevronRight />
            </span>
            {tree.checkboxes ? (
              <Checkbox
                checked={checked === "checked"}
                indeterminate={checked === "mixed"}
                disabled={disabled}
                tabIndex={-1}
                aria-hidden
                className="pointer-events-none group-hover/tree-item-label:inset-ring-foreground/70"
              />
            ) : null}
            {icon ? (
              <span
                data-slot="tree-item-icon"
                aria-hidden="true"
                className="grid size-4 shrink-0 place-items-center text-muted-foreground *:col-start-1 *:row-start-1 *:transition-opacity *:duration-150 motion-reduce:*:transition-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4"
              >
                {expandedIcon ? (
                  <>
                    <span className="grid place-items-center group-data-expanded/tree-item-label:opacity-0">
                      {icon}
                    </span>
                    <span className="grid place-items-center opacity-0 group-data-expanded/tree-item-label:opacity-100">
                      {expandedIcon}
                    </span>
                  </>
                ) : (
                  icon
                )}
              </span>
            ) : null}
            <span
              data-slot="tree-item-text"
              className="min-w-0 flex-1 truncate"
            >
              {children}
            </span>
            {meta != null && meta !== false ? (
              <span
                data-slot="tree-item-meta"
                className="ms-auto flex shrink-0 items-center gap-1 text-xs text-muted-foreground tabular-nums"
              >
                {meta}
              </span>
            ) : null}
          </>
        ),
      },
      props,
      {
        "data-slot": "tree-item-label",
        "data-value": value,
        "data-expanded": state.expanded ? "" : undefined,
        "data-selected": selected ? "" : undefined,
        "data-checked": checked === "checked" ? "" : undefined,
        "data-indeterminate": checked === "mixed" ? "" : undefined,
        "data-disabled": disabled ? "" : undefined,
      } as Record<string, string>
    ),
  })
}

function TreeGroup({
  className,
  children,
  ...props
}: Omit<
  CollapsiblePrimitive.Panel.Props,
  "className" | "hiddenUntilFound" | "keepMounted"
> & {
  className?: string
}) {
  const tree = useTreeContext("TreeGroup")
  const { registerGroup, groupId } = useTreeItemContext("TreeGroup")

  React.useLayoutEffect(() => registerGroup(), [registerGroup])

  return (
    <CollapsiblePrimitive.Panel
      id={groupId}
      role="group"
      data-slot="tree-group"
      hiddenUntilFound={tree.hiddenUntilFound}
      keepMounted
      className="group/tree-group h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out-quint data-ending-style:h-0 data-ending-style:duration-150 data-starting-style:h-0 motion-reduce:transition-none"
      {...props}
    >
      <div
        data-slot="tree-group-inner"
        className={cn(
          treeGroupVariants({ variant: tree.variant }),
          "transition-[opacity,translate] duration-200 ease-out-quint group-data-ending-style/tree-group:-translate-y-1 group-data-ending-style/tree-group:opacity-0 group-data-ending-style/tree-group:duration-150 group-data-starting-style/tree-group:-translate-y-1 group-data-starting-style/tree-group:opacity-0 motion-reduce:transition-none",
          className
        )}
      >
        {children}
      </div>
    </CollapsiblePrimitive.Panel>
  )
}

export { Tree, TreeItem, TreeItemLabel, TreeGroup, treeVariants }
export type {
  TreeProps,
  TreeItemProps,
  TreeItemLabelProps,
  TreeCheckState,
  TreeSelectionMode,
}
