"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { useHeldKeys } from "@/hooks/use-held-keys"
import { keyLabel, parseHotkey, spokenKey, useIsApple } from "@/lib/hotkey"

function resolveKey(key: string, apple: boolean) {
  if (key === "mod") {
    return apple ? "meta" : "ctrl"
  }
  return key
}

const kbdVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-0.5 font-sans font-medium whitespace-nowrap tabular-nums transition-[translate,box-shadow,background-color,color] duration-100 ease-out-cubic select-none [unicode-bidi:isolate] motion-reduce:transition-colors [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        keycap:
          "bg-background text-muted-foreground shadow-[0_1px_0_0_var(--color-border)] inset-ring-(length:--hairline) inset-ring-border in-data-[slot=button]:bg-current/10 in-data-[slot=button]:text-current in-data-[slot=button]:shadow-none in-data-[slot=button]:inset-ring-current/20 data-pressed:bg-muted data-pressed:text-foreground data-pressed:shadow-none motion-safe:data-pressed:translate-y-px dark:not-in-data-[slot=button]:bg-muted/60 dark:data-pressed:bg-muted forced-colors:border",
        flat: "bg-muted text-muted-foreground in-data-highlighted:bg-background in-data-[slot=button]:bg-current/10 in-data-[slot=button]:text-current data-pressed:bg-foreground/15 data-pressed:text-foreground dark:in-data-highlighted:bg-foreground/10",
      },
      size: {
        sm: "h-4.5 min-w-4.5 rounded-[calc(var(--radius-sm)*0.6)] px-1 text-xs [&_svg:not([class*='size-'])]:size-2.5",
        default:
          "h-5 min-w-5 rounded-[calc(var(--radius-sm)*0.75)] px-1 text-xs [&_svg:not([class*='size-'])]:size-3",
        lg: "h-6 min-w-6 rounded-sm px-1.5 text-sm [&_svg:not([class*='size-'])]:size-3.5",
      },
    },
    defaultVariants: {
      variant: "keycap",
      size: "default",
    },
  }
)

type KbdVariant = NonNullable<VariantProps<typeof kbdVariants>["variant"]>
type KbdSize = NonNullable<VariantProps<typeof kbdVariants>["size"]>

type KbdGroupContextValue = {
  variant?: KbdVariant
  size?: KbdSize
  listen?: boolean
}

const KbdGroupContext = React.createContext<KbdGroupContextValue | null>(null)

function KeyName({ keys, apple }: { keys: string[]; apple: boolean }) {
  const visible = keys.map((key) => keyLabel(key, apple))
  const spoken = keys.map((key) => spokenKey(key, apple)).join(" ")
  const label = apple ? visible.join("") : visible.join("+")

  if (label === spoken) {
    return label
  }

  return (
    <>
      <span aria-hidden="true">{label}</span>
      <span className="sr-only">{spoken}</span>
    </>
  )
}

type KbdProps = useRender.ComponentProps<"kbd"> & {
  variant?: KbdVariant
  size?: KbdSize
  keys?: string
  listen?: boolean
}

function Kbd({
  className,
  variant,
  size,
  keys,
  listen,
  render,
  children,
  ...props
}: KbdProps) {
  const group = React.useContext(KbdGroupContext)
  const resolvedVariant = variant ?? group?.variant ?? "keycap"
  const resolvedSize = size ?? group?.size ?? "default"
  const listening = listen ?? group?.listen ?? false
  const apple = useIsApple()
  const pressedKeys = useHeldKeys(listening)

  const chord = keys ? (parseHotkey(keys)[0] ?? []) : null
  const own =
    chord ??
    (typeof children === "string" && children.trim()
      ? parseHotkey(children.trim().replace(/\s+/g, "+"))[0]
      : null)
  const pressed =
    listening &&
    own !== null &&
    own.length > 0 &&
    own.every((key) => pressedKeys.has(resolveKey(key, apple)))

  return useRender({
    defaultTagName: "kbd",
    render,
    props: mergeProps<"kbd">(
      {
        className: cn(
          kbdVariants({ variant: resolvedVariant, size: resolvedSize }),
          className
        ),
        children: chord ? <KeyName keys={chord} apple={apple} /> : children,
      },
      props,
      {
        "data-slot": "kbd",
        "data-variant": resolvedVariant,
        "data-size": resolvedSize,
        ...(pressed ? { "data-pressed": "" } : {}),
      } as React.ComponentProps<"kbd">
    ),
  })
}

type KbdGroupProps = useRender.ComponentProps<"kbd"> & {
  variant?: KbdVariant
  size?: KbdSize
  keys?: string
  listen?: boolean
  separator?: React.ReactNode
}

function KbdGroup({
  className,
  variant,
  size,
  keys,
  listen,
  separator = "then",
  render,
  children,
  ...props
}: KbdGroupProps) {
  const context = React.useMemo(
    () => ({ variant, size, listen }),
    [variant, size, listen]
  )
  const chords = keys ? parseHotkey(keys) : null

  const content = chords
    ? chords.map((chord, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span
              data-slot="kbd-separator"
              className="px-0.5 font-sans text-xs text-muted-foreground"
            >
              {separator}
            </span>
          )}
          {chord.map((key, keyIndex) => (
            <Kbd key={keyIndex} keys={key} />
          ))}
        </React.Fragment>
      ))
    : children

  const element = useRender({
    defaultTagName: "kbd",
    render,
    props: mergeProps<"kbd">(
      {
        className: cn(
          "inline-flex w-fit shrink-0 items-center gap-1 align-middle [unicode-bidi:isolate] rtl:flex-row-reverse",
          className
        ),
        children: content,
      },
      props,
      { "data-slot": "kbd-group" } as React.ComponentProps<"kbd">
    ),
  })

  return (
    <KbdGroupContext.Provider value={context}>
      {element}
    </KbdGroupContext.Provider>
  )
}

export { Kbd, KbdGroup, kbdVariants, useHeldKeys }
export type { KbdGroupProps, KbdProps }
