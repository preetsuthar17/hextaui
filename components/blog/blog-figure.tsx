import * as React from "react"

import { BlogDiagramBody } from "@/components/blog/blog-diagrams"
import { getBlogDiagram } from "@/lib/blog-diagrams"
import { t } from "@/lib/i18n/rich"
import { cn } from "@/lib/utils"

function Figure({
  caption,
  children,
  className,
}: {
  caption: string
  children: React.ReactNode
  className?: string
}) {
  const id = `figure-${caption
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`
  return (
    <figure aria-labelledby={caption ? id : undefined} className="mt-8 mb-2">
      <div className={className}>{children}</div>
      {caption ? (
        <figcaption
          id={id}
          className="mt-3 text-sm/6 text-pretty text-muted-foreground"
        >
          {t(caption)}
        </figcaption>
      ) : null}
    </figure>
  )
}

function BlogImage({
  src,
  darkSrc,
  alt,
  caption,
  width,
  height,
}: {
  src: string
  darkSrc?: string
  alt: string
  caption: string
  width?: number
  height?: number
}) {
  const imageClassName =
    "block h-auto max-w-full rounded-lg border bg-background"
  const label = t(alt)
  return (
    <Figure caption={caption} className="flex justify-center">
      <img
        src={src}
        alt={label}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className={cn(imageClassName, darkSrc && "dark:hidden")}
      />
      {darkSrc ? (
        <img
          src={darkSrc}
          alt={label}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          className={cn(imageClassName, "hidden dark:block")}
        />
      ) : null}
    </Figure>
  )
}

function BlogDiagram({ name }: { name: string }) {
  const { caption } = getBlogDiagram(name)
  return (
    <Figure caption={caption}>
      <BlogDiagramBody name={name} />
    </Figure>
  )
}

export { BlogDiagram, BlogImage }
