"use client"

import * as React from "react"
import { flushSync } from "react-dom"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { IconPhotoOff } from "@tabler/icons-react"
import { cn } from "cn"

import { Skeleton } from "@/components/ui/skeleton"

type AspectRatioValue = number | `${number}/${number}` | `${number}:${number}`

type MediaState = "loading" | "loaded" | "error"

type AspectRatioProps = useRender.ComponentProps<"div"> & {
  ratio?: AspectRatioValue
  placeholder?: boolean
  fallback?: React.ReactNode
}

const mediaSelector = ":scope > img, :scope > picture > img, :scope > video"

function parseAspectRatio(ratio: AspectRatioValue | undefined) {
  if (ratio === undefined) {
    return 1
  }

  let value = Number.NaN

  if (typeof ratio === "number") {
    value = ratio
  } else {
    const trimmed = ratio.trim()
    const pair = trimmed.match(/^(\d*\.?\d+)\s*[/:]\s*(\d*\.?\d+)$/)
    if (pair) {
      value = Number(pair[1]) / Number(pair[2])
    } else if (/^\d*\.?\d+$/.test(trimmed)) {
      value = Number(trimmed)
    }
  }

  if (!Number.isFinite(value) || value <= 0) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `AspectRatio: invalid ratio ${JSON.stringify(ratio)}, falling back to 1.`
      )
    }
    return 1
  }

  return value
}

function readMediaState(media: Element): MediaState {
  if (media instanceof HTMLImageElement) {
    if (!media.getAttribute("src") && !media.getAttribute("srcset")) {
      return "loading"
    }
    if (!media.complete) {
      return "loading"
    }
    return media.naturalWidth > 0 ? "loaded" : "error"
  }
  if (media instanceof HTMLVideoElement) {
    if (
      media.error ||
      media.networkState === HTMLMediaElement.NETWORK_NO_SOURCE
    ) {
      return "error"
    }
    return media.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA
      ? "loaded"
      : "loading"
  }
  return "loaded"
}

function useMediaState(
  containerRef: React.RefObject<HTMLElement | null>,
  enabled: boolean
) {
  const [state, setState] = React.useState<MediaState | null>(null)

  React.useLayoutEffect(() => {
    const container = containerRef.current
    if (!enabled || !container) {
      return
    }

    const findMedia = () => container.querySelector(mediaSelector)

    const sync = () => {
      const media = findMedia()
      setState(media ? readMediaState(media) : null)
    }

    const isOwn = (target: EventTarget | null) => {
      const media = findMedia()
      return (
        media !== null &&
        (target === media ||
          (target instanceof HTMLSourceElement &&
            target.parentElement === media))
      )
    }

    const handleLoad = (event: Event) => {
      if (isOwn(event.target)) {
        setState("loaded")
      }
    }

    const handleError = (event: Event) => {
      if (isOwn(event.target)) {
        setState("error")
      }
    }

    container.addEventListener("load", handleLoad, true)
    container.addEventListener("loadeddata", handleLoad, true)
    container.addEventListener("error", handleError, true)

    const observer = new MutationObserver(() => flushSync(sync))
    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src", "srcset"],
    })

    sync()

    return () => {
      container.removeEventListener("load", handleLoad, true)
      container.removeEventListener("loadeddata", handleLoad, true)
      container.removeEventListener("error", handleError, true)
      observer.disconnect()
      setState(null)
    }
  }, [containerRef, enabled])

  return enabled ? state : null
}

function AspectRatio({
  ratio,
  placeholder = true,
  fallback = <IconPhotoOff />,
  className,
  style,
  render,
  ref,
  children,
  ...props
}: AspectRatioProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const value = React.useMemo(() => parseAspectRatio(ratio), [ratio])
  const state = useMediaState(containerRef, placeholder)

  return useRender({
    defaultTagName: "div",
    render,
    ref: ref ? [containerRef, ref] : containerRef,
    props: mergeProps<"div">(
      {
        ...({ "data-slot": "aspect-ratio" } as Record<string, string>),
        className: cn(
          "relative aspect-(--ratio) w-full [&>:is(img,video)]:object-cover [&>:is(img,video,iframe,picture)]:absolute [&>:is(img,video,iframe,picture)]:inset-0 [&>:is(img,video,iframe,picture)]:size-full [&>:is(img,video,iframe,picture)]:rounded-[inherit] [&>picture>img]:size-full [&>picture>img]:rounded-[inherit] [&>picture>img]:object-cover",
          "[&>:is(img,video,picture)]:transition-opacity [&>:is(img,video,picture)]:duration-300 [&>:is(img,video,picture)]:ease-out-quint data-[state=error]:[&>:is(img,video,picture)]:opacity-0 data-[state=loading]:[&>:is(img,video,picture)]:opacity-0 motion-reduce:[&>:is(img,video,picture)]:transition-none",
          className
        ),
        style: { ...style, "--ratio": value } as React.CSSProperties,
        children: (
          <>
            {state === "loading" || state === "error" ? (
              <Skeleton
                data-slot="aspect-ratio-placeholder"
                animation={state === "loading" ? "shimmer" : "none"}
                className="pointer-events-none absolute inset-0 rounded-[inherit]"
              />
            ) : null}
            {children}
            {state === "error" && fallback !== null ? (
              <span
                data-slot="aspect-ratio-fallback"
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 grid animate-in place-items-center rounded-[inherit] text-muted-foreground animation-duration-200 fade-in-0 [&>svg:not([class*='size-'])]:size-6"
              >
                {fallback}
              </span>
            ) : null}
          </>
        ),
        "aria-busy": state === "loading" || undefined,
      },
      props,
      {
        "data-state": state ?? undefined,
      } as Record<string, string | undefined>
    ),
  })
}

export { AspectRatio, parseAspectRatio }
export type { AspectRatioProps, AspectRatioValue }
