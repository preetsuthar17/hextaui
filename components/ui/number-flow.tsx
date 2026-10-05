"use client"

import * as React from "react"
import { cn } from "cn"

import { easeSpring } from "@/lib/motion"

type NumberFlowTrend = "auto" | "up" | "down" | "shortest"

type NumberFlowChar = {
  key: string
  section: number
  order: number
  value: string
  digit: number | null
}

type NumberFlowItem = NumberFlowChar & {
  exiting: boolean
  exitId: number
}

type NumberFlowProps = Omit<
  React.ComponentProps<"span">,
  "children" | "prefix"
> & {
  value: number
  locales?: Intl.LocalesArgument
  format?: Intl.NumberFormatOptions
  prefix?: string
  suffix?: string
  trend?: NumberFlowTrend
  duration?: number
  easing?: string
  animated?: boolean
  onAnimationsStart?: () => void
  onAnimationsFinish?: () => void
}

const rows = 30

const restingClasses =
  "data-[digit='0']:translate-y-[-33.3333%] data-[digit='1']:translate-y-[-36.6667%] data-[digit='2']:translate-y-[-40%] data-[digit='3']:translate-y-[-43.3333%] data-[digit='4']:translate-y-[-46.6667%] data-[digit='5']:translate-y-[-50%] data-[digit='6']:translate-y-[-53.3333%] data-[digit='7']:translate-y-[-56.6667%] data-[digit='8']:translate-y-[-60%] data-[digit='9']:translate-y-[-63.3333%]"

function getSpinDelta(
  from: number,
  to: number,
  trend: Exclude<NumberFlowTrend, "auto">
) {
  let delta = to - from

  if (trend === "up") {
    if (delta < 0) {
      delta += 10
    }
  } else if (trend === "down") {
    if (delta > 0) {
      delta -= 10
    }
  } else if (delta > 5) {
    delta -= 10
  } else if (delta < -4) {
    delta += 10
  }

  return delta
}

function digitGlyphs(
  formatter: Intl.NumberFormat,
  locales: Intl.LocalesArgument
) {
  const { numberingSystem } = formatter.resolvedOptions()
  const plain = new Intl.NumberFormat(locales, {
    numberingSystem,
    useGrouping: false,
  })

  return Array.from({ length: 10 }, (_, digit) => plain.format(digit))
}

function formatChars(
  value: number,
  locales: Intl.LocalesArgument,
  format: Intl.NumberFormatOptions | undefined,
  prefix: string | undefined,
  suffix: string | undefined
) {
  const formatter = new Intl.NumberFormat(locales, format)
  const glyphs = digitGlyphs(formatter, locales)
  const parts = formatter.formatToParts(value)
  const integerCount = parts
    .filter((part) => part.type === "integer")
    .reduce((count, part) => count + Array.from(part.value).length, 0)
  const chars: NumberFlowChar[] = []
  const occurrences = new Map<string, number>()
  let integerIndex = 0
  let fractionIndex = 0
  let seenNumber = false

  function symbol(section: number, type: string, text: string) {
    const name = `${section}-${type}`
    const occurrence = occurrences.get(name) ?? 0
    occurrences.set(name, occurrence + 1)
    chars.push({
      key: `s${name}-${occurrence}`,
      section,
      order: occurrence,
      value: text,
      digit: null,
    })
  }

  if (prefix) {
    chars.push({
      key: "prefix",
      section: 0,
      order: 0,
      value: prefix,
      digit: null,
    })
  }

  for (const part of parts) {
    if (part.type === "integer") {
      seenNumber = true
      for (const glyph of Array.from(part.value)) {
        const place = integerCount - 1 - integerIndex
        const digit = glyphs.indexOf(glyph)
        chars.push({
          key: `i${place}`,
          section: 2,
          order: -place,
          value: glyph,
          digit: digit === -1 ? null : digit,
        })
        integerIndex += 1
      }
    } else if (part.type === "group") {
      const place = integerCount - 1 - integerIndex
      chars.push({
        key: `g${place}`,
        section: 2,
        order: -place - 0.5,
        value: part.value,
        digit: null,
      })
    } else if (part.type === "decimal") {
      seenNumber = true
      chars.push({
        key: "decimal",
        section: 3,
        order: 0,
        value: part.value,
        digit: null,
      })
    } else if (part.type === "fraction") {
      for (const glyph of Array.from(part.value)) {
        const digit = glyphs.indexOf(glyph)
        chars.push({
          key: `f${fractionIndex}`,
          section: 4,
          order: fractionIndex,
          value: glyph,
          digit: digit === -1 ? null : digit,
        })
        fractionIndex += 1
      }
    } else {
      symbol(seenNumber ? 5 : 1, part.type, part.value)
    }
  }

  if (suffix) {
    chars.push({
      key: "suffix",
      section: 6,
      order: 0,
      value: suffix,
      digit: null,
    })
  }

  return chars
}

function signature(chars: NumberFlowChar[]) {
  return chars.map((char) => `${char.key}:${char.value}`).join("|")
}

function mergeItems(previous: NumberFlowItem[], next: NumberFlowChar[]) {
  const keys = new Set(next.map((char) => char.key))
  const kept = previous
    .filter((item) => !keys.has(item.key))
    .map((item) =>
      item.exiting ? item : { ...item, exiting: true, exitId: item.exitId + 1 }
    )
  const fresh = next.map((char) => {
    const before = previous.find((item) => item.key === char.key)
    return { ...char, exiting: false, exitId: before?.exitId ?? 0 }
  })

  return [...kept, ...fresh].sort(
    (a, b) => a.section - b.section || a.order - b.order
  )
}

function subscribeReducedMotion(callback: () => void) {
  if (typeof window.matchMedia !== "function") {
    return () => {}
  }
  const query = window.matchMedia("(prefers-reduced-motion: reduce)")
  query.addEventListener("change", callback)
  return () => query.removeEventListener("change", callback)
}

function getReducedMotion() {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

function canAnimate() {
  return (
    typeof Element !== "undefined" &&
    typeof Element.prototype.animate === "function"
  )
}

function liveIndex(column: HTMLElement) {
  const height = column.offsetHeight

  if (!height) {
    return null
  }

  const translate = getComputedStyle(column).translate
  const y = translate === "none" ? "0" : (translate.split(" ")[1] ?? "0")
  const amount = parseFloat(y) || 0

  return y.endsWith("%") ? (-amount / 100) * rows : (-amount / height) * rows
}

function NumberFlow({
  value,
  locales = "en-US",
  format,
  prefix,
  suffix,
  trend = "auto",
  duration = 600,
  easing = easeSpring,
  animated = true,
  onAnimationsStart,
  onAnimationsFinish,
  className,
  ...props
}: NumberFlowProps) {
  const chars = formatChars(value, locales, format, prefix, suffix)
  const key = signature(chars)
  const reducedMotion = React.useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false
  )
  const animate = animated && !reducedMotion && canAnimate()
  const [state, setState] = React.useState(() => ({
    key,
    items: chars.map((char) => ({ ...char, exiting: false, exitId: 0 })),
  }))

  if (state.key !== key) {
    setState({
      key,
      items: animate
        ? mergeItems(state.items, chars)
        : chars.map((char) => ({ ...char, exiting: false, exitId: 0 })),
    })
  }

  const rootRef = React.useRef<HTMLSpanElement>(null)
  const previousRef = React.useRef<Map<
    string,
    { digit: number | null; exiting: boolean; exitId: number }
  > | null>(null)
  const valueRef = React.useRef(value)
  const batchRef = React.useRef(0)
  const callbacksRef = React.useRef({ onAnimationsStart, onAnimationsFinish })
  const finishExitRef = React.useRef((itemKey: string, exitId: number) => {
    setState((current) => ({
      ...current,
      items: current.items.filter(
        (item) =>
          !(item.key === itemKey && item.exiting && item.exitId === exitId)
      ),
    }))
  })

  React.useLayoutEffect(() => {
    callbacksRef.current = { onAnimationsStart, onAnimationsFinish }
  })

  React.useLayoutEffect(() => {
    const root = rootRef.current
    const previous = previousRef.current
    const current = new Map(
      state.items.map((item) => [
        item.key,
        { digit: item.digit, exiting: item.exiting, exitId: item.exitId },
      ])
    )
    const previousValue = valueRef.current

    previousRef.current = current
    valueRef.current = value

    if (!root || !previous || !animate) {
      return
    }

    const direction =
      trend !== "auto"
        ? trend
        : value > previousValue
          ? "up"
          : value < previousValue
            ? "down"
            : "shortest"
    const timing = { duration, easing }
    const started: Animation[] = []
    const cells = root.querySelectorAll<HTMLElement>(
      ":scope > [data-number-flow-key]"
    )

    for (const cell of cells) {
      const itemKey = cell.dataset.numberFlowKey!
      const item = current.get(itemKey)
      const before = previous.get(itemKey)

      if (!item || typeof cell.animate !== "function") {
        continue
      }

      const column = cell.querySelector<HTMLElement>(
        "[data-slot=number-flow-column]"
      )
      const entering = !item.exiting && (!before || before.exiting)
      const leaving = item.exiting && (!before || !before.exiting)

      if (entering || leaving) {
        const running = cell.getAnimations()
        const fromWidth = running.length
          ? cell.getBoundingClientRect().width
          : entering
            ? 0
            : cell.getBoundingClientRect().width
        const fromOpacity = running.length
          ? Number(getComputedStyle(cell).opacity)
          : entering
            ? 0
            : 1
        running.forEach((animation) => animation.cancel())
        const toWidth = entering ? cell.getBoundingClientRect().width : 0
        const animation = cell.animate(
          [
            { width: `${fromWidth}px`, opacity: fromOpacity },
            { width: `${toWidth}px`, opacity: entering ? 1 : 0 },
          ],
          { ...timing, fill: leaving ? "forwards" : "none" }
        )
        started.push(animation)
        if (leaving) {
          const exitId = item.exitId
          animation.finished.then(
            () => finishExitRef.current(itemKey, exitId),
            () => {}
          )
        }
      }

      if (!column || item.digit === null || item.exiting) {
        continue
      }

      const target = item.digit
      const running = column.getAnimations()
      const live = running.length ? liveIndex(column) : null
      running.forEach((animation) => animation.cancel())
      const from =
        live !== null
          ? live - 10
          : entering
            ? 0
            : before && before.digit !== null
              ? before.digit
              : target

      if (live === null && from === target && !entering) {
        continue
      }

      const delta = getSpinDelta(
        from,
        target,
        entering && live === null ? "up" : direction
      )

      if (delta === 0) {
        continue
      }

      started.push(
        column.animate(
          [
            { translate: `0 ${(-(target + 10 - delta) / rows) * 100}%` },
            { translate: `0 ${(-(target + 10) / rows) * 100}%` },
          ],
          timing
        )
      )
    }

    if (!started.length) {
      return
    }

    batchRef.current += 1
    const batch = batchRef.current
    callbacksRef.current.onAnimationsStart?.()
    Promise.all(started.map((animation) => animation.finished)).then(
      () => {
        if (batch === batchRef.current) {
          callbacksRef.current.onAnimationsFinish?.()
        }
      },
      () => {}
    )
  }, [state.items, animate, duration, easing, trend, value])

  return (
    <span
      ref={rootRef}
      dir="ltr"
      className={cn("inline-block max-w-full tabular-nums", className)}
      {...props}
      data-slot="number-flow"
    >
      <span data-slot="number-flow-text" className="sr-only">
        {state.items
          .filter((item) => !item.exiting)
          .map((item) => item.value)
          .join("")}
      </span>
      {state.items.map((item) =>
        item.digit === null ? (
          <span
            key={item.key}
            data-number-flow-key={item.key}
            data-slot="number-flow-symbol"
            aria-hidden
            className="inline-block max-w-full overflow-clip wrap-anywhere whitespace-pre-wrap"
          >
            {item.value}
          </span>
        ) : (
          <span
            key={item.key}
            data-number-flow-key={item.key}
            data-slot="number-flow-digit"
            aria-hidden
            className="relative -my-[0.2em] inline-block overflow-clip [mask-image:linear-gradient(to_bottom,transparent,black_0.2em,black_calc(100%-0.2em),transparent)] py-[0.2em]"
          >
            <span className="opacity-0">{item.value}</span>
            <span
              aria-hidden
              data-slot="number-flow-column"
              data-digit={item.digit}
              className={cn(
                "pointer-events-none absolute inset-x-0 top-0 flex flex-col items-center select-none",
                restingClasses
              )}
            >
              {Array.from({ length: rows }, (_, row) => (
                <span key={row} className="block py-[0.2em]">
                  {glyphFor(item, row)}
                </span>
              ))}
            </span>
          </span>
        )
      )}
    </span>
  )
}

function glyphFor(item: NumberFlowItem, row: number) {
  return String.fromCodePoint(
    item.value.codePointAt(0)! - (item.digit ?? 0) + (row % 10)
  )
}

export {
  NumberFlow,
  getSpinDelta,
  formatChars,
  type NumberFlowProps,
  type NumberFlowTrend,
}
