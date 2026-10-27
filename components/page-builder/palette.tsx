"use client"

import * as React from "react"
import { IconLock, IconPlus, IconSearch } from "@tabler/icons-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import Link from "@/components/site/link"
import { useLoadSlot } from "@/components/site/block-card"
import { useInViewOnce } from "@/components/site/use-in-view-once"
import type { ProBlockInfo } from "@/lib/page-builder/doc"
import {
  sectionKinds,
  sections,
  type SectionDefinition,
} from "@/lib/page-builder/registry"

const rowClassName =
  "group/row flex w-full cursor-pointer items-start gap-2 rounded-md px-2 py-1.5 text-start outline-none transition-colors duration-150 hover:bg-muted focus-visible:ring-3 focus-visible:ring-focus-ring motion-reduce:transition-none forced-colors:focus-visible:outline-2"

function matches(query: string, ...values: string[]) {
  if (!query) return true
  const haystack = values.join(" ").toLowerCase()
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => haystack.includes(token))
}

function ProThumbnail({ name, title }: { name: string; title: string }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>()
  const [granted, done] = useLoadSlot(inView)
  const [loaded, setLoaded] = React.useState(false)

  return (
    <div
      ref={ref}
      inert
      className="relative aspect-16/10 overflow-hidden rounded-sm bg-muted/50"
    >
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

function Palette({
  proBlocks,
  onAdd,
  onAddPro,
}: {
  proBlocks: ProBlockInfo[]
  onAdd: (section: SectionDefinition) => void
  onAddPro: (block: ProBlockInfo) => void
}) {
  const [query, setQuery] = React.useState("")
  const deferred = React.useDeferredValue(query.trim())

  const groups = sectionKinds
    .map((kind) => ({
      ...kind,
      items: sections.filter(
        (section) =>
          section.kind === kind.kind &&
          matches(deferred, kind.title, section.variant, section.description)
      ),
    }))
    .filter((group) => group.items.length > 0)

  const pro = proBlocks.filter((block) =>
    matches(deferred, block.title, block.category, "pro")
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="p-2">
        <InputGroup className="h-8">
          <InputGroupAddon>
            <IconSearch aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            aria-label="Search sections"
            placeholder="Search sections"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
        </InputGroup>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-4">
        {groups.map((group) => (
          <section
            key={group.kind}
            aria-labelledby={`pb-group-${group.kind}`}
            className="mt-2 first:mt-0"
          >
            <h3
              id={`pb-group-${group.kind}`}
              className="px-2 py-1.5 text-xs font-medium text-muted-foreground"
            >
              {group.title}
            </h3>
            <ul className="flex flex-col">
              {group.items.map((section) => (
                <li key={section.id}>
                  <button
                    type="button"
                    className={rowClassName}
                    onClick={() => onAdd(section)}
                    aria-label={`Add ${group.title}: ${section.variant}`}
                  >
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="text-sm">{section.variant}</span>
                      <span className="text-xs text-pretty text-muted-foreground">
                        {section.description}
                      </span>
                    </span>
                    <IconPlus
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity duration-150 group-hover/row:opacity-100 group-focus-visible/row:opacity-100 motion-reduce:transition-none pointer-coarse:opacity-100"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
        {pro.length > 0 ? (
          <section
            aria-labelledby="pb-group-pro"
            className="mt-4 border-t pt-3"
          >
            <div className="flex items-baseline justify-between gap-2 px-2 pb-2">
              <h3
                id="pb-group-pro"
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
              >
                <IconLock aria-hidden="true" className="size-3.5" />
                Pro blocks
              </h3>
              <Link
                href="/pricing"
                className="rounded-sm text-xs text-foreground underline decoration-foreground/30 underline-offset-4 outline-none hover:decoration-foreground focus-visible:ring-3 focus-visible:ring-focus-ring"
              >
                Unlock with Pro
              </Link>
            </div>
            <p className="px-2 pb-3 text-xs text-pretty text-muted-foreground">
              Placed as a locked placeholder. The export adds its install
              command for Pro members.
            </p>
            <ul className="grid grid-cols-2 gap-2 px-1">
              {pro.map((block) => (
                <li key={block.name}>
                  <button
                    type="button"
                    onClick={() => onAddPro(block)}
                    aria-label={`Add ${block.title} placeholder (Pro)`}
                    className="group/tile flex w-full cursor-pointer flex-col gap-1.5 rounded-md p-1 text-start transition-colors duration-150 outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-focus-ring motion-reduce:transition-none forced-colors:focus-visible:outline-2"
                  >
                    <span className="relative block rounded-md ring-(length:--hairline) ring-border">
                      <ProThumbnail name={block.name} title={block.title} />
                      <span className="absolute end-1 top-1 flex size-5 items-center justify-center rounded-full bg-background/90 text-muted-foreground ring-(length:--hairline) ring-border">
                        <IconLock aria-hidden="true" className="size-3" />
                      </span>
                    </span>
                    <span className="truncate px-0.5 text-xs">
                      {block.title}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {groups.length === 0 && pro.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">
            No sections match “{deferred}”.
          </p>
        ) : null}
      </div>
    </div>
  )
}

export { Palette }
