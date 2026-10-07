"use client"

import * as React from "react"

import {
  CatalogCard,
  CatalogCardLink,
  CatalogCardPreview,
} from "@/components/site/catalog-card"
import { useInViewOnce } from "@/components/site/use-in-view-once"

type Demo = React.LazyExoticComponent<React.ComponentType>

const demos = new Map<string, Demo>()

const wideDemos = new Set(["sidebar"])

function demoFor(slug: string) {
  let demo = demos.get(slug)
  if (!demo) {
    demo = React.lazy(async () => {
      const mod: Record<string, React.ComponentType> = await import(
        `../examples/${slug}/demo`
      )
      const name = Object.keys(mod).find((key) => key.endsWith("Demo"))
      return { default: name ? mod[name] : () => null }
    })
    demos.set(slug, demo)
  }
  return demo
}

function FittedDemo({
  slug,
  frameRef,
}: {
  slug: string
  frameRef: React.RefObject<HTMLDivElement | null>
}) {
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [Demo] = React.useState(() => demoFor(slug))

  React.useLayoutEffect(() => {
    const frame = frameRef.current
    const content = contentRef.current
    if (!frame || !content) return

    const fit = () => {
      const width = content.offsetWidth
      const height = content.offsetHeight
      const scale = Math.min(
        1,
        frame.clientWidth / width,
        frame.clientHeight / height
      )
      content.style.transform =
        scale < 1
          ? `translate(${(frame.clientWidth - width * scale) / 2}px, ${(frame.clientHeight - height * scale) / 2}px) scale(${scale})`
          : ""
    }

    fit()
    const frameId = requestAnimationFrame(() => {
      content.dataset.fitted = ""
    })
    const observer = new ResizeObserver(fit)
    observer.observe(frame)
    observer.observe(content)
    return () => {
      cancelAnimationFrame(frameId)
      observer.disconnect()
    }
  }, [frameRef])

  return (
    <div
      ref={contentRef}
      data-wide={wideDemos.has(slug) ? "" : undefined}
      className="absolute top-0 left-0 grid min-h-full min-w-full origin-top-left place-items-center p-6 data-fitted:transition-transform data-fitted:duration-300 data-fitted:ease-out-cubic data-wide:min-w-160 motion-safe:animate-in motion-safe:animation-duration-300 motion-safe:fade-in-0 motion-reduce:transition-none"
    >
      <div className="flex w-full items-center justify-center">
        <Demo />
      </div>
    </div>
  )
}

function ComponentCard({ slug, name }: { slug: string; name: string }) {
  const [ref, inView] = useInViewOnce<HTMLLIElement>()
  const frameRef = React.useRef<HTMLDivElement>(null)

  return (
    <CatalogCard ref={ref}>
      <CatalogCardPreview ref={frameRef} className="aspect-square">
        {inView ? (
          <React.Suspense fallback={null}>
            <FittedDemo slug={slug} frameRef={frameRef} />
          </React.Suspense>
        ) : null}
      </CatalogCardPreview>
      <CatalogCardLink href={`/docs/${slug}`}>{name}</CatalogCardLink>
    </CatalogCard>
  )
}

export { ComponentCard }
