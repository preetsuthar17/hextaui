"use client"

import * as React from "react"

import {
  CatalogCard,
  CatalogCardLink,
  CatalogCardPreview,
} from "@/components/site/catalog-card"
import { useInViewOnce } from "@/components/site/use-in-view-once"

const maxLoading = 2
const waiting: (() => void)[] = []
let loading = 0

function release() {
  loading -= 1
  const next = waiting.shift()
  if (next) {
    loading += 1
    next()
  }
}

function useLoadSlot(requested: boolean) {
  const [granted, setGranted] = React.useState(false)
  const held = React.useRef(false)

  React.useEffect(() => {
    if (!requested) return
    const start = () => {
      held.current = true
      setGranted(true)
    }
    if (loading < maxLoading) {
      loading += 1
      start()
    } else {
      waiting.push(start)
    }
    return () => {
      const index = waiting.indexOf(start)
      if (index !== -1) waiting.splice(index, 1)
      if (held.current) {
        held.current = false
        release()
      }
    }
  }, [requested])

  const done = React.useCallback(() => {
    if (!held.current) return
    held.current = false
    release()
  }, [])

  return [granted, done] as const
}

function BlockCard({ name, title }: { name: string; title: string }) {
  const [ref, inView] = useInViewOnce<HTMLLIElement>()
  const [granted, done] = useLoadSlot(inView)
  const [loaded, setLoaded] = React.useState(false)

  return (
    <CatalogCard ref={ref}>
      <CatalogCardPreview
        inert
        className="aspect-4/3 in-data-[catalog-view=single]:aspect-16/10"
      >
        {granted ? (
          <iframe
            src={`/preview/blocks/${name}`}
            title={`${title} preview`}
            tabIndex={-1}
            aria-hidden
            onLoad={() => {
              setLoaded(true)
              done()
            }}
            data-loaded={loaded ? "" : undefined}
            className="pointer-events-none absolute top-0 left-0 size-[300%] origin-top-left scale-[calc(1/3)] opacity-0 transition-opacity duration-300 ease-out-cubic in-data-[catalog-view=single]:size-full in-data-[catalog-view=single]:scale-100 data-loaded:opacity-100 motion-reduce:transition-none"
          />
        ) : null}
      </CatalogCardPreview>
      <CatalogCardLink
        href={`/blocks/${name}`}
        className="after:absolute after:inset-0 after:rounded-(--catalog-radius)"
      >
        {title}
      </CatalogCardLink>
    </CatalogCard>
  )
}

export { BlockCard, useLoadSlot }
