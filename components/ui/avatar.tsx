"use client"

import * as React from "react"
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { IconUser } from "@tabler/icons-react"
import { cva } from "class-variance-authority"
import { cn } from "cn"

type AvatarSize = "xs" | "sm" | "default" | "lg" | "xl"

type AvatarShape = "circle" | "square"

type AvatarStatus = "online" | "away" | "busy" | "offline"

type ClassName<State> =
  string | ((state: State) => string | undefined) | undefined

const AvatarGroupContext = React.createContext<{
  size?: AvatarSize
  shape?: AvatarShape
} | null>(null)

function mergeClassName<State>(base: string, className: ClassName<State>) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

const avatarVariants = cva(
  "group/avatar [container-type:size] relative isolate inline-flex shrink-0 rounded-(--avatar-radius) bg-muted align-middle text-muted-foreground outline-none select-none after:pointer-events-none after:absolute after:inset-0 after:z-2 after:rounded-[inherit] after:inset-ring-(length:--hairline) after:inset-ring-foreground/10 focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden",
  {
    variants: {
      size: {
        xs: "size-5",
        sm: "size-6",
        default: "size-8",
        lg: "size-10",
        xl: "size-14",
      },
      shape: {
        circle: "[--avatar-radius:9999px]",
        square: "",
      },
    },
    compoundVariants: [
      {
        shape: "square",
        size: "xs",
        className: "[--avatar-radius:var(--radius-sm)]",
      },
      {
        shape: "square",
        size: "sm",
        className: "[--avatar-radius:var(--radius-md)]",
      },
      {
        shape: "square",
        size: ["default", "lg"],
        className: "[--avatar-radius:var(--radius-lg)]",
      },
      {
        shape: "square",
        size: "xl",
        className: "[--avatar-radius:var(--radius-xl)]",
      },
    ],
    defaultVariants: {
      size: "default",
      shape: "circle",
    },
  }
)

type AvatarProps = AvatarPrimitive.Root.Props & {
  size?: AvatarSize
  shape?: AvatarShape
}

function Avatar({ className, size, shape, ...props }: AvatarProps) {
  const group = React.useContext(AvatarGroupContext)
  const resolvedSize = size ?? group?.size ?? "default"
  const resolvedShape = shape ?? group?.shape ?? "circle"

  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={resolvedSize}
      data-shape={resolvedShape}
      className={mergeClassName(
        cn(
          avatarVariants({ size: resolvedSize, shape: resolvedShape }),
          group && "ring-2 ring-background"
        ),
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={mergeClassName(
        "absolute inset-0 z-1 size-full rounded-(--avatar-radius) object-cover transition-opacity duration-200 ease-out-quint data-ending-style:opacity-0 data-error:invisible data-loading:invisible data-starting-style:opacity-0 motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

function isEmpty(children: React.ReactNode) {
  return (
    children === undefined ||
    children === null ||
    typeof children === "boolean" ||
    (typeof children === "string" && children.trim() === "")
  )
}

type AvatarFallbackProps = useRender.ComponentProps<"span"> & {
  delay?: number
}

function AvatarFallback({
  className,
  children,
  delay = 0,
  render,
  ...props
}: AvatarFallbackProps) {
  const [delayPassed, setDelayPassed] = React.useState(delay <= 0)

  React.useEffect(() => {
    if (delay <= 0) {
      return
    }

    const timeout = window.setTimeout(() => setDelayPassed(true), delay)

    return () => window.clearTimeout(timeout)
  }, [delay])

  const ready = delayPassed || delay <= 0

  return useRender({
    defaultTagName: "span",
    render,
    props: mergeProps<"span">(
      {
        className: cn(
          "absolute inset-0 flex items-center justify-center overflow-hidden rounded-(--avatar-radius) bg-muted text-[max(0.5625rem,38cqmin)] leading-none font-medium whitespace-nowrap text-muted-foreground transition-[opacity,visibility] duration-200 ease-out-quint data-[ready=false]:invisible data-[ready=false]:opacity-0 motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-[56cqmin] [[data-slot=avatar]:has(>[data-slot=avatar-image]:not([data-loading]):not([data-error]):not([data-ending-style]))>&]:invisible [[data-slot=avatar]:has(>[data-slot=avatar-image]:not([data-loading]):not([data-error]):not([data-ending-style]))>&]:opacity-0",
          className
        ),
        children: isEmpty(children) ? <IconUser aria-hidden /> : children,
      },
      props,
      { "data-slot": "avatar-fallback", "data-ready": String(ready) } as Record<
        string,
        string
      >
    ),
  })
}

const statusLabels: Record<AvatarStatus, string> = {
  online: "Online",
  away: "Away",
  busy: "Busy",
  offline: "Offline",
}

const avatarBadgeVariants = cva(
  "absolute end-(--avatar-badge-inset) bottom-(--avatar-badge-inset) z-3 inline-flex size-(--avatar-badge-size) items-center justify-center rounded-full ring-2 ring-background select-none [--avatar-badge-inset:calc(min(var(--avatar-radius),50cqmin)*0.2929-var(--avatar-badge-size)/2)] [--avatar-badge-size:max(0.375rem,min(0.875rem,30cqmin))] [&>svg]:pointer-events-none [&>svg]:size-[calc(var(--avatar-badge-size)*0.75)] group-data-[size=sm]/avatar:[&>svg]:hidden group-data-[size=xs]/avatar:[&>svg]:hidden",
  {
    variants: {
      status: {
        none: "bg-primary text-primary-foreground",
        online: "bg-success",
        away: "bg-warning",
        busy: "bg-destructive",
        offline:
          "border-[max(1.5px,calc(var(--avatar-badge-size)*0.22))] border-muted-foreground bg-background",
      },
    },
    defaultVariants: {
      status: "none",
    },
  }
)

type AvatarBadgeProps = React.ComponentProps<"span"> & {
  status?: AvatarStatus
}

function AvatarBadge({
  className,
  status,
  children,
  ...props
}: AvatarBadgeProps) {
  const [pulse, setPulse] = React.useState({ status, count: 0 })

  if (status !== pulse.status) {
    setPulse({ status, count: pulse.count + 1 })
  }

  const showPulse = pulse.count > 0 && status && status !== "offline"

  return (
    <span
      data-slot="avatar-badge"
      data-status={status}
      role={status ? "img" : undefined}
      aria-label={status ? statusLabels[status] : undefined}
      className={cn(
        avatarBadgeVariants({ status: status ?? "none" }),
        className
      )}
      {...props}
    >
      {showPulse ? (
        <span
          key={pulse.count}
          data-slot="avatar-badge-pulse"
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] bg-inherit motion-safe:animate-avatar-badge-pulse motion-reduce:hidden"
        />
      ) : null}
      {children}
    </span>
  )
}

const avatarGroupVariants = cva(
  "group/avatar-group isolate flex w-fit max-w-full items-center",
  {
    variants: {
      size: {
        xs: "-space-x-1.5",
        sm: "-space-x-2",
        default: "-space-x-2",
        lg: "-space-x-2.5",
        xl: "-space-x-3.5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

type AvatarGroupProps = React.ComponentProps<"div"> & {
  size?: AvatarSize
  shape?: AvatarShape
  max?: number
}

function resolveMax(max: number | undefined) {
  return max !== undefined && Number.isFinite(max) && max >= 1
    ? Math.max(2, Math.floor(max))
    : Infinity
}

function AvatarGroup({
  className,
  size = "default",
  shape = "circle",
  max,
  children,
  ...props
}: AvatarGroupProps) {
  const context = React.useMemo(() => ({ size, shape }), [size, shape])
  const items = React.Children.toArray(children)
  const limit = resolveMax(max)
  const overflow = items.length > limit ? items.length - limit + 1 : 0

  return (
    <AvatarGroupContext.Provider value={context}>
      <div
        data-slot="avatar-group"
        data-size={size}
        role="group"
        className={cn(avatarGroupVariants({ size }), className)}
        {...props}
      >
        {overflow ? items.slice(0, limit - 1) : items}
        {overflow ? <AvatarGroupCount count={overflow} /> : null}
      </div>
    </AvatarGroupContext.Provider>
  )
}

function formatCount(count: number) {
  return count > 99 ? "99+" : `+${count}`
}

type AvatarGroupCountProps = React.ComponentProps<"span"> & {
  count?: number
  size?: AvatarSize
  shape?: AvatarShape
}

function AvatarGroupCount({
  className,
  count,
  size,
  shape,
  children,
  ...props
}: AvatarGroupCountProps) {
  const group = React.useContext(AvatarGroupContext)
  const resolvedSize = size ?? group?.size ?? "default"
  const resolvedShape = shape ?? group?.shape ?? "circle"
  const value =
    count !== undefined && Number.isFinite(count)
      ? Math.max(0, Math.floor(count))
      : undefined

  return (
    <span
      data-slot="avatar-group-count"
      data-size={resolvedSize}
      data-shape={resolvedShape}
      className={cn(
        avatarVariants({ size: resolvedSize, shape: resolvedShape }),
        group && "ring-2 ring-background",
        className
      )}
      {...props}
    >
      <span className="flex size-full items-center justify-center overflow-hidden rounded-[inherit] text-[max(0.5625rem,36cqmin)] leading-none font-medium whitespace-nowrap tabular-nums [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-[50cqmin]">
        {value !== undefined && children === undefined ? (
          <>
            <span aria-hidden dir="ltr">
              {formatCount(value)}
            </span>
            <span className="sr-only">{`${value} more`}</span>
          </>
        ) : (
          children
        )}
      </span>
    </span>
  )
}

const segmenter =
  typeof Intl !== "undefined" && "Segmenter" in Intl
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null

const visible = /[\p{L}\p{N}\p{Extended_Pictographic}]/u

const markless = /^[\p{Script=Latin}\p{Script=Greek}\p{Script=Cyrillic}]/u

function graphemes(word: string) {
  return segmenter
    ? Array.from(segmenter.segment(word), (part) => part.segment)
    : Array.from(word)
}

function firstGrapheme(word: string) {
  const grapheme = graphemes(word.slice(0, 64)).find((part) =>
    visible.test(part)
  )

  if (!grapheme) {
    return ""
  }

  return markless.test(grapheme) ? grapheme.replace(/\p{M}+/gu, "") : grapheme
}

function getInitials(name: string | null | undefined, max = 2) {
  if (typeof name !== "string") {
    return ""
  }

  const limit = Number.isFinite(max) ? Math.max(1, Math.floor(max)) : 2
  const source = name.trim()
  const at = source.indexOf("@")
  const words =
    at > 0
      ? source
          .slice(0, at)
          .split("+")[0]
          .split(/[._-]+/u)
      : source.split(/\s+/u)
  const letters: string[] = []

  for (const word of words) {
    const letter = firstGrapheme(word)

    if (letter) {
      letters.push(letter)
    }
  }

  const picked =
    letters.length <= limit
      ? letters
      : limit === 1
        ? letters.slice(0, 1)
        : [...letters.slice(0, limit - 1), letters[letters.length - 1]]

  return picked.join("").toLocaleUpperCase()
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
  avatarVariants,
  avatarBadgeVariants,
  getInitials,
  type AvatarProps,
  type AvatarFallbackProps,
  type AvatarBadgeProps,
  type AvatarGroupProps,
  type AvatarGroupCountProps,
  type AvatarSize,
  type AvatarShape,
  type AvatarStatus,
}
