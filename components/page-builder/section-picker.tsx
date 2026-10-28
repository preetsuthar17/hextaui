"use client"

import * as React from "react"
import { IconLock, IconSearch } from "@tabler/icons-react"

import { LiveThumb } from "@/components/page-builder/section-thumb"
import { useLoadSlot } from "@/components/site/block-card"
import Link from "@/components/site/link"
import { useInViewOnce } from "@/components/site/use-in-view-once"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import type { ProBlockInfo } from "@/lib/page-builder/doc"
import {
  sectionKinds,
  sections,
  type SectionDefinition,
  type SectionKind,
} from "@/lib/page-builder/registry"
import type { ThemeVars } from "@/lib/page-builder/theme"
import { track } from "@/lib/track"

type Filter = SectionKind | "all" | "pro"

const tileClassName =
  "group/tile flex w-full min-w-0 cursor-pointer flex-col gap-2 rounded-lg p-1 text-start outline-none focus-visible:ring-3 focus-visible:ring-focus-ring forced-colors:focus-visible:outline-2"

const overlayClassName =
  "absolute inset-0 cursor-pointer rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-focus-ring forced-colors:focus-visible:outline-2"

const frameClassName =
  "relative block overflow-hidden rounded-md bg-background ring-(length:--hairline) ring-foreground/10 transition-shadow duration-150 ease-out-cubic group-hover/tile:ring-foreground/25 motion-reduce:transition-none forced-colors:border"

function matches(query: string, ...values: string[]) {
  if (!query) return true
  const haystack = values.join(" ").toLowerCase()
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => haystack.includes(token))
}

function ProThumb({ name, title }: { name: string; title: string }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>()
  const [granted, done] = useLoadSlot(inView)
  const [loaded, setLoaded] = React.useState(false)

  return (
    <div ref={ref} inert className="relative aspect-16/10 overflow-hidden bg-muted/40">
      {granted ? (
        <iframe
          src={`/preview/blocks/${name}?tile`}
          title={`${title} preview`}
          tabIndex={-1}
          aria-hidden
          loading="lazy"
          onLoad={() => {
            setLoaded(true)
            done()
          }}
          data-loaded={loaded ? "" : undefined}
          className="pointer-events-none absolute top-0 left-0 size-[400%] origin-top-left scale-25 border-0 opacity-0 transition-opacity duration-300 ease-out-cubic data-loaded:opacity-100 motion-reduce:transition-none"
        />
      ) : null}
    </div>
  )
}

function SectionPicker({
  proBlocks,
  vars,
  dark,
  onAdd,
  onAddPro,
}: {
  proBlocks: ProBlockInfo[]
  vars: ThemeVars
  dark: boolean
  onAdd: (section: SectionDefinition) => void
  onAddPro: (block: ProBlockInfo) => void
}) {
  const [query, setQuery] = React.useState("")
  const [filter, setFilter] = React.useState<Filter>("all")
  const deferred = React.useDeferredValue(query.trim())

  const groups = sectionKinds
    .filter((kind) => filter === "all" || filter === kind.kind)
    .map((kind) => ({
      ...kind,
      items: sections.filter(
        (section) =>
          section.kind === kind.kind &&
          matches(deferred, kind.title, section.variant, section.description)
      ),
    }))
    .filter((group) => group.items.length > 0)

  const pro =
    filter === "all" || filter === "pro"
      ? proBlocks.filter((block) =>
          matches(deferred, block.title, block.category, "pro")
        )
      : []

  const filters: { value: Filter; label: string; count: number }[] = [
    { value: "all", label: "All", count: sections.length },
    ...sectionKinds.map((kind) => ({
      value: kind.kind,
      label: kind.title,
      count: sections.filter((section) => section.kind === kind.kind).length,
    })),
    { value: "pro", label: "Pro blocks", count: proBlocks.length },
  ]

  return (
    <div className="flex min-h-0 flex-col gap-3">
      <InputGroup>
        <InputGroupAddon>
          <IconSearch aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          aria-label="Search sections"
          placeholder="Search sections"
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
      </InputGroup>
      <div className="flex min-h-0 gap-4 sm:h-[min(34rem,62svh)]">
        <nav aria-label="Categories" className="hidden w-36 shrink-0 flex-col gap-px overflow-y-auto sm:flex">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={filter === item.value}
              onClick={() => setFilter(item.value)}
              className="flex h-7 shrink-0 items-center justify-between gap-2 rounded-md px-2 text-start text-sm text-muted-foreground outline-none transition-colors duration-150 ease-out-cubic hover:text-foreground focus-visible:ring-3 focus-visible:ring-focus-ring aria-pressed:bg-muted aria-pressed:text-foreground motion-reduce:transition-none forced-colors:aria-pressed:outline-2 forced-colors:aria-pressed:outline-solid"
            >
              <span className="flex items-center gap-1.5 truncate">
                {item.value === "pro" ? (
                  <IconLock aria-hidden="true" className="size-3.5 shrink-0" />
                ) : null}
                {item.label}
              </span>
              <span className="text-xs tabular-nums opacity-70">{item.count}</span>
            </button>
          ))}
        </nav>
        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:thin] max-sm:max-h-[60svh]">
          <div className="flex flex-col gap-6 pb-1">
            {groups.map((group) => (
              <section key={group.kind} aria-labelledby={`pb-pick-${group.kind}`}>
                <h3
                  id={`pb-pick-${group.kind}`}
                  className="px-1 pb-1.5 text-xs font-medium text-muted-foreground"
                >
                  {group.title}
                </h3>
                <ul className="grid grid-cols-2 gap-2 lg:grid-cols-3">
                  {group.items.map((section) => (
                    <li key={section.id} className="group/tile relative min-w-0">
                      <div className="flex w-full min-w-0 flex-col gap-2 p-1">
                        <span className={frameClassName}>
                          <LiveThumb
                            items={[{ sectionId: section.id, props: section.defaults }]}
                            vars={vars}
                            dark={dark}
                            className="aspect-16/10"
                          />
                        </span>
                        <span className="flex min-w-0 flex-col px-0.5">
                          <span className="truncate text-sm">{section.variant}</span>
                          <span className="truncate text-xs text-muted-foreground">
                            {section.description}
                          </span>
                        </span>
                      </div>
                      <button
                        type="button"
                        className={overlayClassName}
                        aria-label={`Add ${group.title}: ${section.variant}`}
                        onClick={() => onAdd(section)}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            {pro.length > 0 ? (
              <section aria-labelledby="pb-pick-pro">
                <div className="flex items-baseline justify-between gap-2 px-1 pb-1.5">
                  <h3
                    id="pb-pick-pro"
                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
                  >
                    <IconLock aria-hidden="true" className="size-3.5" />
                    Pro blocks
                  </h3>
                  <Link
                    href="/pricing"
                    onClick={() => track("Page builder unlock", { from: "picker" })}
                    className="rounded-sm text-xs font-medium text-foreground underline decoration-foreground/30 underline-offset-4 outline-none hover:decoration-foreground focus-visible:ring-3 focus-visible:ring-focus-ring"
                  >
                    Unlock with Pro
                  </Link>
                </div>
                <p className="px-1 pb-2 text-xs text-pretty text-muted-foreground">
                  Placed as a locked placeholder. The export adds the install
                  command for Pro members.
                </p>
                <ul className="grid grid-cols-2 gap-2 lg:grid-cols-3">
                  {pro.map((block) => (
                    <li key={block.name} className="min-w-0">
                      <button
                        type="button"
                        className={tileClassName}
                        aria-label={`Add ${block.title} placeholder (Pro)`}
                        onClick={() => onAddPro(block)}
                      >
                        <span className={frameClassName}>
                          <ProThumb name={block.name} title={block.title} />
                          <span className="absolute end-1.5 top-1.5 flex h-5 items-center gap-1 rounded-full bg-background/90 px-1.5 text-xs text-muted-foreground ring-(length:--hairline) ring-foreground/10 backdrop-blur forced-colors:border">
                            <IconLock aria-hidden="true" className="size-3" />
                            Pro
                          </span>
                        </span>
                        <span className="flex min-w-0 flex-col px-0.5">
                          <span className="truncate text-sm">{block.title}</span>
                          <span className="truncate text-xs text-muted-foreground">
                            Unlock with Pro
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            {groups.length === 0 && pro.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No sections match “{deferred}”.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export { SectionPicker }
