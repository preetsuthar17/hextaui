"use client"

import * as React from "react"
import Link from "@/components/site/link"
import { cn } from "cn"

import { useLoadSlot } from "@/components/site/block-card"
import { TrackedLink } from "@/components/site/tracked-link"
import { useInViewOnce } from "@/components/site/use-in-view-once"
import { useChrome } from "@/lib/i18n/chrome"

const tiles = [
  {
    slug: "questionnaire",
    name: "Questionnaire",
    Demo: React.lazy(() =>
      import("@/components/examples/questionnaire/demo").then((mod) => ({
        default: mod.QuestionnaireDemo,
      }))
    ),
    className: "lg:row-span-2",
    size: "h-124 lg:h-auto lg:flex-1",
  },
  {
    slug: "number-flow",
    name: "Number flow",
    Demo: React.lazy(() =>
      import("@/components/examples/number-flow/demo").then((mod) => ({
        default: mod.NumberFlowDemo,
      }))
    ),
    className: "",
    size: "h-56",
  },
  {
    slug: "switch",
    name: "Switch",
    Demo: React.lazy(() =>
      import("@/components/examples/switch/async").then((mod) => ({
        default: mod.SwitchAsync,
      }))
    ),
    className: "lg:col-span-1",
    size: "h-56",
  },
  {
    slug: "toast",
    name: "Toast",
    Demo: React.lazy(() =>
      import("@/components/examples/toast/demo").then((mod) => ({
        default: mod.ToastDemo,
      }))
    ),
    className: "lg:col-span-1",
    size: "h-56",
  },
  {
    slug: "input-otp",
    name: "Input OTP",
    Demo: React.lazy(() =>
      import("@/components/examples/input-otp/demo").then((mod) => ({
        default: mod.InputOTPDemo,
      }))
    ),
    className: "",
    size: "h-56",
  },
  {
    slug: "button",
    name: "Button",
    Demo: React.lazy(() =>
      import("@/components/examples/button/demo").then((mod) => ({
        default: mod.ButtonDemo,
      }))
    ),
    className: "",
    size: "h-56",
  },
]

function BlockTile({
  name,
  title,
  free,
  className,
  panelClassName = "aspect-square",
}: {
  name: string
  title: string
  free: boolean
  className?: string
  panelClassName?: string
}) {
  const [ref, inView] = useInViewOnce<HTMLLIElement>()
  const [granted, done] = useLoadSlot(inView)
  const [loaded, setLoaded] = React.useState(false)

  return (
    <li ref={ref} className={cn("preview-tile col-span-2", className)}>
      <div inert className={cn("preview-panel", panelClassName)}>
        {granted ? (
          <iframe
            src={`/preview/blocks/${name}?tile`}
            title={`${title} preview`}
            tabIndex={-1}
            aria-hidden
            onLoad={() => {
              setLoaded(true)
              done()
            }}
            data-loaded={loaded ? "" : undefined}
            className="pointer-events-none absolute top-0 left-0 size-[125%] origin-top-left scale-80 opacity-0 transition-opacity duration-300 ease-out-cubic data-loaded:opacity-100 motion-reduce:transition-none"
          />
        ) : null}
      </div>
      <Link
        href={`/blocks/${name}`}
        className="preview-caption after:absolute after:inset-0 after:rounded-(--tile-radius)"
      >
        {title}
        <span className="text-xs font-normal">{free ? "Free" : "Pro"}</span>
      </Link>
    </li>
  )
}

function DemoTile({
  slug,
  name,
  Demo,
  className,
  size,
}: (typeof tiles)[number]) {
  const [ref, inView] = useInViewOnce<HTMLLIElement>()

  return (
    <li ref={ref} className={cn("preview-tile col-span-2", className)}>
      <div className={cn("preview-panel grid place-items-center p-6", size)}>
        {inView ? (
          <React.Suspense fallback={null}>
            <div className="flex w-full items-center justify-center motion-safe:animate-in motion-safe:animation-duration-300 motion-safe:fade-in-0">
              <Demo />
            </div>
          </React.Suspense>
        ) : null}
      </div>
      <Link href={`/docs/${slug}`} className="preview-caption">
        {name}
      </Link>
    </li>
  )
}

function HomeBlocks({
  blocks,
}: {
  blocks: { name: string; title: string; free: boolean }[]
}) {
  return (
    <ul className="grid grid-cols-2 gap-2 lg:grid-cols-4">
      {blocks.map((block) => (
        <BlockTile
          key={block.name}
          name={block.name}
          title={block.title}
          free={block.free}
        />
      ))}
    </ul>
  )
}

function HomeDemos() {
  return (
    <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {tiles.map((tile) => (
        <DemoTile key={tile.slug} {...tile} />
      ))}
    </ul>
  )
}

type StageBlock = { name: string; title: string; free: boolean }

function StagePanel({
  block,
  visible,
}: {
  block: StageBlock
  visible: boolean
}) {
  const c = useChrome()
  const [loaded, setLoaded] = React.useState(false)
  const [engaged, setEngaged] = React.useState(false)

  return (
    <div className="preview-panel h-108 sm:h-150">
      {visible ? (
        <iframe
          src={`/preview/blocks/${block.name}?tile`}
          title={`${block.title} preview`}
          onLoad={() => setLoaded(true)}
          data-loaded={loaded ? "" : undefined}
          className="absolute top-0 left-0 size-[125%] origin-top-left scale-80 opacity-0 transition-opacity duration-300 ease-out-cubic data-loaded:opacity-100 motion-reduce:transition-none sm:size-full sm:scale-100"
        />
      ) : null}
      {engaged ? null : (
        <button
          type="button"
          onClick={() => setEngaged(true)}
          className="stage-engage"
        >
          <span>{c("Tap to try it")}</span>
        </button>
      )}
    </div>
  )
}

function HomeStage({ blocks }: { blocks: StageBlock[] }) {
  const c = useChrome()
  const [ref, inView] = useInViewOnce<HTMLDivElement>()
  const listRef = React.useRef<HTMLDivElement>(null)
  const [active, setActive] = React.useState(blocks[0]?.name ?? "")
  const [visited, setVisited] = React.useState(() => new Set([active]))
  const current = blocks.find((block) => block.name === active) ?? blocks[0]

  if (!current) return null

  const select = (index: number, focus = false) => {
    const name = blocks[index].name
    setActive(name)
    setVisited((previous) => new Set(previous).add(name))
    const tab = listRef.current?.children[index]
    if (!(tab instanceof HTMLElement)) return
    if (focus) tab.focus({ preventScroll: true })
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    tab.scrollIntoView({
      block: "nearest",
      inline: "center",
      behavior: reduce.matches ? "auto" : "smooth",
    })
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl"
    const index = blocks.findIndex((block) => block.name === active)
    const steps: Record<string, number> = {
      ArrowRight: rtl ? -1 : 1,
      ArrowLeft: rtl ? 1 : -1,
    }
    const step = steps[event.key]
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? blocks.length - 1
          : step === undefined
            ? -1
            : (index + step + blocks.length) % blocks.length
    if (next < 0) return
    event.preventDefault()
    select(next, true)
  }

  return (
    <div ref={ref}>
      <div className="flex min-w-0 justify-center">
        <div
          ref={listRef}
          role="tablist"
          aria-label={c("Live blocks")}
          className="stage-tabs"
          onKeyDown={onKeyDown}
        >
          {blocks.map((block, index) => (
            <button
              key={block.name}
              type="button"
              role="tab"
              id={`stage-tab-${block.name}`}
              aria-controls={`stage-panel-${block.name}`}
              aria-selected={block.name === active}
              tabIndex={block.name === active ? 0 : -1}
              onClick={() => select(index)}
              className="stage-tab"
            >
              {block.title}
            </button>
          ))}
        </div>
      </div>
      <div className="preview-tile mt-2">
        {blocks
          .filter((block) => visited.has(block.name))
          .map((block) => (
            <div
              key={block.name}
              role="tabpanel"
              id={`stage-panel-${block.name}`}
              aria-labelledby={`stage-tab-${block.name}`}
              hidden={block.name !== active}
            >
              <StagePanel block={block} visible={inView} />
            </div>
          ))}
        <TrackedLink
          href={`/blocks/${current.name}`}
          event="Pro link clicked"
          eventProps={{ from: "home-stage", to: `/blocks/${current.name}` }}
          className="preview-caption justify-between"
        >
          <span className="flex items-center gap-2">
            {current.title}
            <span className="text-xs font-normal">
              {current.free ? c("Free") : "Pro"}
            </span>
          </span>
          <span className="text-xs font-normal">{c("Open block")}</span>
        </TrackedLink>
      </div>
    </div>
  )
}

export { HomeBlocks, HomeDemos, HomeStage }
