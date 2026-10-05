"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { IconFile } from "@tabler/icons-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { duration, easeOut, easeSpring } from "@/lib/motion"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea, type ScrollAreaProps } from "@/components/ui/scroll-area"

type AttachmentState = "idle" | "uploading" | "processing" | "error" | "done"

type AttachmentOrientation = "horizontal" | "vertical"

const AttachmentContext = React.createContext<{
  state: AttachmentState
  titleId: string
  orientation: AttachmentOrientation
}>({ state: "done", titleId: "", orientation: "horizontal" })

const layoutDuration = duration.morph

function subscribe() {
  return () => {}
}

function prefersReducedMotion() {
  return (
    typeof window.matchMedia !== "function" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

const attachmentVariants = cva(
  "group/attachment relative flex w-fit max-w-full min-w-0 shrink-0 flex-wrap rounded-(--attachment-radius) border bg-card text-card-foreground transition-[background-color,border-color,box-shadow,scale] duration-150 ease-out-quint [--attachment-inset:1px] [--attachment-radius:var(--radius-xl)] has-[>[data-slot=attachment-trigger]]:hover:bg-muted/50 has-[>[data-slot=attachment-trigger]:focus-visible]:border-ring has-[>[data-slot=attachment-trigger]:focus-visible]:ring-3 has-[>[data-slot=attachment-trigger]:focus-visible]:ring-focus-ring data-[state=error]:border-destructive/30 data-[state=idle]:border-dashed motion-safe:has-[>[data-slot=attachment-trigger]:active]:scale-[0.99]",
  {
    variants: {
      size: {
        default:
          "gap-2 text-sm has-data-[slot=attachment-content]:px-2.5 has-data-[slot=attachment-content]:py-2 has-data-[slot=attachment-media]:p-2 has-data-[slot=attachment-media]:[--attachment-inset:calc(var(--spacing)*2+1px)]",
        sm: "gap-2.5 text-xs has-data-[slot=attachment-content]:px-2 has-data-[slot=attachment-content]:py-1.5 has-data-[slot=attachment-media]:p-1.5 has-data-[slot=attachment-media]:[--attachment-inset:calc(var(--spacing)*1.5+1px)]",
        xs: "gap-1.5 text-xs [--attachment-radius:var(--radius-lg)] has-data-[slot=attachment-content]:px-1.5 has-data-[slot=attachment-content]:py-1 has-data-[slot=attachment-media]:p-1 has-data-[slot=attachment-media]:[--attachment-inset:calc(var(--spacing)+1px)]",
      },
      orientation: {
        horizontal: "min-w-40 items-center",
        vertical: "w-24 flex-col has-data-[slot=attachment-content]:w-30",
      },
    },
    defaultVariants: {
      size: "default",
      orientation: "horizontal",
    },
  }
)

type AttachmentProps = React.ComponentProps<"div"> &
  VariantProps<typeof attachmentVariants> & {
    state?: AttachmentState
    progress?: number
  }

function clampProgress(progress: number) {
  return Number.isFinite(progress) ? Math.min(100, Math.max(0, progress)) : 0
}

function Attachment({
  className,
  state = "done",
  size = "default",
  orientation = "horizontal",
  progress,
  children,
  ref,
  ...props
}: AttachmentProps) {
  const titleId = React.useId()
  const resolvedOrientation = orientation ?? "horizontal"
  const isHydrating = React.useSyncExternalStore(
    subscribe,
    () => false,
    () => true
  )
  const [popIn] = React.useState(!isHydrating)
  const context = React.useMemo(
    () => ({ state, titleId, orientation: resolvedOrientation }),
    [state, titleId, resolvedOrientation]
  )
  const value =
    state === "uploading" && progress !== undefined
      ? clampProgress(progress)
      : null

  return (
    <AttachmentContext.Provider value={context}>
      <div
        ref={ref}
        data-slot="attachment"
        data-state={state}
        data-size={size}
        data-orientation={orientation}
        className={cn(
          attachmentVariants({ size, orientation }),
          popIn &&
            "motion-safe:animate-in motion-safe:ease-out-quint motion-safe:animation-duration-200 motion-safe:fade-in-0 motion-safe:zoom-in-95",
          className
        )}
        {...props}
      >
        {children}
        {value !== null ? (
          <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
            <Progress
              value={value}
              size="xs"
              aria-labelledby={titleId}
              data-slot="attachment-progress"
              className="absolute inset-x-0 bottom-0 [&>[data-slot=progress-track]]:bg-transparent"
            />
          </span>
        ) : null}
      </div>
    </AttachmentContext.Provider>
  )
}

const attachmentMediaVariants = cva(
  "relative flex aspect-square w-10 shrink-0 items-center justify-center overflow-hidden rounded-[max(calc(var(--radius-sm)*0.5),calc(var(--attachment-radius)-var(--attachment-inset)))] bg-muted text-foreground [--attachment-media-radius:max(calc(var(--radius-sm)*0.5),calc(var(--attachment-radius)-var(--attachment-inset)))] group-data-[orientation=vertical]/attachment:w-full group-data-[size=sm]/attachment:w-8 group-data-[size=xs]/attachment:w-7 group-data-[state=error]/attachment:bg-destructive/10 group-data-[state=error]/attachment:text-destructive [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 group-data-[orientation=vertical]/attachment:[&_svg:not([class*='size-'])]:size-6 group-data-[size=xs]/attachment:[&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        icon: "",
        image:
          "opacity-60 transition-opacity duration-300 ease-out-quint group-data-[state=done]/attachment:opacity-100 group-data-[state=idle]/attachment:opacity-100",
      },
    },
    defaultVariants: {
      variant: "icon",
    },
  }
)

function AttachmentMedia({
  className,
  variant = "icon",
  children,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof attachmentMediaVariants>) {
  if (variant === "image") {
    return (
      <AspectRatio
        ratio={1}
        fallback={<IconFile />}
        data-slot="attachment-media"
        data-variant="image"
        className={cn(attachmentMediaVariants({ variant }), className)}
        {...props}
      >
        {children}
      </AspectRatio>
    )
  }

  return (
    <div
      data-slot="attachment-media"
      data-variant={variant}
      className={cn(attachmentMediaVariants({ variant }), className)}
      {...props}
    >
      {children}
    </div>
  )
}

function AttachmentContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-content"
      className={cn(
        "max-w-full min-w-0 flex-1 leading-tight group-data-[orientation=vertical]/attachment:px-1",
        className
      )}
      {...props}
    />
  )
}

function splitFileName(name: string) {
  const dot = name.lastIndexOf(".")
  if (dot <= 0 || dot === name.length - 1 || name.length - dot > 8) {
    return null
  }
  return { base: name.slice(0, dot), extension: name.slice(dot) }
}

function AttachmentTitle({
  className,
  children,
  id,
  title,
  ...props
}: React.ComponentProps<"span">) {
  const { titleId } = React.useContext(AttachmentContext)
  const parts = typeof children === "string" ? splitFileName(children) : null

  return (
    <span
      data-slot="attachment-title"
      id={id ?? (titleId || undefined)}
      title={title ?? (typeof children === "string" ? children : undefined)}
      className={cn(
        "max-w-full min-w-0 font-medium group-data-[state=processing]/attachment:shimmer group-data-[state=uploading]/attachment:shimmer",
        parts ? "flex" : "block truncate",
        className
      )}
      {...props}
    >
      {parts ? (
        <>
          <span className="min-w-0 truncate">{parts.base}</span>
          <span className="shrink-0">{parts.extension}</span>
        </>
      ) : (
        children
      )}
    </span>
  )
}

function AttachmentDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-description"
      className={cn(
        "mt-0.5 block max-w-full min-w-0 truncate text-xs text-muted-foreground group-data-[state=error]/attachment:text-destructive",
        className
      )}
      {...props}
    />
  )
}

function AttachmentActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { orientation } = React.useContext(AttachmentContext)

  return (
    <div
      data-slot="attachment-actions"
      className={cn(
        "relative z-20 flex shrink-0 items-center",
        orientation === "vertical" &&
          "absolute end-3 top-3 gap-1 transition-opacity duration-150 *:data-[slot=attachment-action]:rounded-[max(calc(var(--radius-sm)*0.5),calc(var(--attachment-radius)-var(--attachment-inset)-4px))] *:data-[slot=attachment-action]:bg-background/80 *:data-[slot=attachment-action]:shadow-xs *:data-[slot=attachment-action]:backdrop-blur-sm *:data-[slot=attachment-action]:hover:bg-background [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-focus-within/attachment:opacity-100 [@media(hover:hover)]:group-hover/attachment:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function AttachmentAction({
  variant,
  size = "icon-xs",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="attachment-action"
      variant={variant ?? "ghost"}
      size={size}
      {...props}
    />
  )
}

function AttachmentTrigger({
  className,
  render,
  type,
  ...props
}: useRender.ComponentProps<"button">) {
  return useRender({
    defaultTagName: "button",
    render,
    props: mergeProps<"button">(
      {
        type: render ? type : (type ?? "button"),
        className: cn(
          "absolute inset-0 z-10 rounded-[inherit] outline-none focus-visible:outline-hidden",
          className
        ),
      },
      props,
      { "data-slot": "attachment-trigger" } as Record<string, string>
    ),
  })
}

type Box = { left: number; top: number; width: number; height: number }

function useGroupMotion(containerRef: React.RefObject<HTMLDivElement | null>) {
  const boxesRef = React.useRef(new Map<HTMLElement, Box>())

  React.useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }
    const reduce =
      prefersReducedMotion() || typeof container.animate !== "function"
    const previous = boxesRef.current
    const next = new Map<HTMLElement, Box>()

    for (const child of Array.from(container.children)) {
      if (
        !(child instanceof HTMLElement) ||
        child.dataset.slot !== "attachment"
      ) {
        continue
      }
      const box = {
        left: child.offsetLeft,
        top: child.offsetTop,
        width: child.offsetWidth,
        height: child.offsetHeight,
      }
      next.set(child, box)
      const before = previous.get(child)
      if (!reduce && before && before.left !== box.left) {
        child.animate(
          [
            { translate: `${before.left - box.left}px 0` },
            { translate: "0 0" },
          ],
          { duration: layoutDuration, easing: easeSpring }
        )
      }
    }

    if (!reduce) {
      for (const [element, box] of previous) {
        if (next.has(element) || element.isConnected) {
          continue
        }
        const ghost = element.cloneNode(true) as HTMLElement
        ghost.removeAttribute("id")
        ghost
          .querySelectorAll("[id]")
          .forEach((node) => node.removeAttribute("id"))
        ghost.setAttribute("aria-hidden", "true")
        ghost.inert = true
        Object.assign(ghost.style, {
          position: "absolute",
          left: `${box.left}px`,
          top: `${box.top}px`,
          width: `${box.width}px`,
          height: `${box.height}px`,
          margin: "0",
          pointerEvents: "none",
        })
        container.appendChild(ghost)
        const exit = ghost.animate(
          [
            { opacity: 1, scale: 1 },
            { opacity: 0, scale: 0.92 },
          ],
          { duration: 180, easing: easeOut, fill: "forwards" }
        )
        exit.onfinish = () => ghost.remove()
      }
    }

    boxesRef.current = next
  })
}

function AttachmentGroup({
  className,
  children,
  ...props
}: Omit<ScrollAreaProps, "scrollbars">) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  useGroupMotion(containerRef)

  return (
    <ScrollArea
      data-slot="attachment-group"
      scrollbars="horizontal"
      className={cn(
        "min-w-0 [&>[data-slot=scroll-area-viewport]]:snap-x [&>[data-slot=scroll-area-viewport]]:snap-mandatory [&>[data-slot=scroll-area-viewport]]:scroll-px-1",
        className
      )}
      {...props}
    >
      <div
        ref={containerRef}
        data-slot="attachment-group-list"
        className="relative flex w-max gap-3 p-1 *:data-[slot=attachment]:flex-none *:data-[slot=attachment]:snap-start"
      >
        {children}
      </div>
    </ScrollArea>
  )
}

export {
  Attachment,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
  AttachmentTrigger,
  attachmentVariants,
}
export type { AttachmentProps, AttachmentState }
