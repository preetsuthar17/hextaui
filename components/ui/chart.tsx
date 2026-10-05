"use client"

import * as React from "react"
import { cn } from "cn"
import * as RechartsPrimitive from "recharts"
import type {
  DefaultLegendContentProps,
  TooltipContentProps,
  TooltipProps,
  TooltipValueType,
} from "recharts"

const THEMES = { light: "", dark: ".dark" } as const

const INITIAL_DIMENSION = { width: 320, height: 200 } as const

type TooltipNameType = number | string

type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
>

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within <ChartContainer>.")
  }

  return context
}

function toCssIdent(value: string) {
  return value.replace(/[^\w-]/g, "-")
}

function toCssValue(value: string) {
  return value.replace(/[;{}<>]/g, "").trim()
}

function ChartContainer({
  id,
  className,
  children,
  config,
  initialDimension = INITIAL_DIMENSION,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"]
  initialDimension?: {
    width: number
    height: number
  }
}) {
  const uniqueId = React.useId()
  const chartId = `chart-${toCssIdent(id ?? uniqueId)}`
  const context = React.useMemo(() => ({ config }), [config])

  return (
    <ChartContext.Provider value={context}>
      <div
        role="figure"
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "flex aspect-video min-w-0 justify-center text-xs tabular-nums forced-color-adjust-none [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-angle-axis-tick_text]:fill-muted-foreground [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-foreground/5 [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:rounded-md [&_.recharts-surface]:outline-hidden [&_.recharts-surface]:transition-shadow [&_.recharts-surface]:duration-150 [&_.recharts-surface]:[direction:ltr] [&_.recharts-surface_*]:outline-hidden [&_.recharts-surface:focus-visible]:ring-3 [&_.recharts-surface:focus-visible]:ring-focus-ring [&_.recharts-tooltip-wrapper[data-chart-snap]]:transition-none! [&_.recharts-wrapper]:touch-pan-y",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer
          initialDimension={initialDimension}
        >
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(
    ([, itemConfig]) => itemConfig.theme ?? itemConfig.color
  )

  if (!colorConfig.length) {
    return null
  }

  const css = Object.entries(THEMES)
    .map(([theme, prefix]) => {
      const declarations = colorConfig
        .map(([key, itemConfig]) => {
          const color =
            itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ??
            itemConfig.color
          const value = color ? toCssValue(color) : ""
          return value ? `  --color-${toCssIdent(key)}: ${value};` : null
        })
        .filter(Boolean)
        .join("\n")
      return `${prefix} [data-chart="${toCssIdent(id)}"] {\n${declarations}\n}`
    })
    .join("\n")

  return <style dangerouslySetInnerHTML={{ __html: css }} />
}

function ChartTooltip({
  animationDuration = 200,
  animationEasing = "ease-out",
  ...props
}: TooltipProps<TooltipValueType, TooltipNameType>) {
  return (
    <RechartsPrimitive.Tooltip
      animationDuration={animationDuration}
      animationEasing={animationEasing}
      {...props}
    />
  )
}

function useNumberFormat(locale: Intl.LocalesArgument) {
  return React.useMemo(() => {
    try {
      return new Intl.NumberFormat(locale)
    } catch {
      return new Intl.NumberFormat("en-US")
    }
  }, [locale])
}

function formatValue(value: unknown, format: Intl.NumberFormat): string {
  if (typeof value === "number") {
    return Number.isFinite(value) ? format.format(value) : String(value)
  }
  if (Array.isArray(value)) {
    return value.map((item) => formatValue(item, format)).join(" – ")
  }
  return value == null ? "" : String(value)
}

function snapTooltipWrapper(node: HTMLDivElement | null) {
  const wrapper = node?.parentElement
  if (
    !wrapper?.classList.contains("recharts-tooltip-wrapper") ||
    typeof MutationObserver === "undefined"
  ) {
    return undefined
  }

  let hidden = wrapper.style.visibility === "hidden"
  let from: string | null = null
  let frame = 0
  let timeout: ReturnType<typeof setTimeout> | undefined

  const release = () => {
    from = null
    clearTimeout(timeout)
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        wrapper.removeAttribute("data-chart-snap")
      })
    })
  }

  const snap = () => {
    cancelAnimationFrame(frame)
    clearTimeout(timeout)
    wrapper.setAttribute("data-chart-snap", "")
    from = wrapper.style.transform
    timeout = setTimeout(release, 100)
  }

  if (!hidden) {
    snap()
  }

  const observer = new MutationObserver(() => {
    const nowHidden = wrapper.style.visibility === "hidden"
    if (hidden && !nowHidden) {
      snap()
    } else if (from !== null && wrapper.style.transform !== from) {
      release()
    }
    hidden = nowHidden
  })
  observer.observe(wrapper, { attributes: true, attributeFilter: ["style"] })

  return () => {
    observer.disconnect()
    cancelAnimationFrame(frame)
    clearTimeout(timeout)
    wrapper.removeAttribute("data-chart-snap")
  }
}

type ChartTooltipPayload = TooltipContentProps<
  TooltipValueType,
  TooltipNameType
>["payload"]

type ChartTooltipContentProps = {
  active?: boolean
  payload?: ChartTooltipPayload
  label?: React.ReactNode
  labelFormatter?: TooltipProps<
    TooltipValueType,
    TooltipNameType
  >["labelFormatter"]
  formatter?: TooltipProps<TooltipValueType, TooltipNameType>["formatter"]
  valueFormatter?: (
    value: TooltipValueType | undefined,
    name: TooltipNameType | undefined,
    item: ChartTooltipPayload[number]
  ) => React.ReactNode
  className?: string
  labelClassName?: string
  color?: string
  indicator?: "line" | "dot" | "dashed"
  hideLabel?: boolean
  hideIndicator?: boolean
  nameKey?: string
  labelKey?: string
  locale?: Intl.LocalesArgument
}

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  valueFormatter,
  color,
  nameKey,
  labelKey,
  locale = "en-US",
}: ChartTooltipContentProps) {
  const { config } = useChart()
  const format = useNumberFormat(locale)

  if (!active || !payload?.length) {
    return null
  }

  const items = payload.filter((item) => item.type !== "none")

  const tooltipLabel = (() => {
    if (hideLabel) {
      return null
    }
    const [item] = payload
    const key = `${labelKey ?? item?.dataKey ?? item?.name ?? "value"}`
    const itemConfig = getPayloadConfigFromPayload(config, item, key)
    const value =
      !labelKey && (typeof label === "string" || typeof label === "number")
        ? ((Object.hasOwn(config, label) ? config[label].label : undefined) ??
          label)
        : itemConfig?.label

    if (labelFormatter) {
      const formatted = labelFormatter(value, payload)
      return formatted == null || formatted === "" ? null : (
        <div
          data-slot="chart-tooltip-label"
          className={cn("font-medium text-pretty", labelClassName)}
        >
          {formatted}
        </div>
      )
    }

    if (value == null || value === "") {
      return null
    }

    return (
      <div
        data-slot="chart-tooltip-label"
        className={cn("font-medium text-pretty", labelClassName)}
      >
        {value}
      </div>
    )
  })()

  const nestLabel = items.length === 1 && indicator !== "dot"

  return (
    <div
      ref={snapTooltipWrapper}
      data-slot="chart-tooltip"
      className={cn(
        "grid max-w-[min(18rem,calc(100vw-2rem))] min-w-32 animate-in items-start gap-1.5 rounded-lg bg-popover px-2.5 py-1.5 text-xs wrap-anywhere text-popover-foreground shadow-md ring-(length:--hairline) ring-foreground/10 ease-out-quint animation-duration-150 fade-in-0 motion-safe:zoom-in-95 forced-colors:border",
        className
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {items.map((item, index) => {
          const key = `${nameKey ?? item.name ?? item.dataKey ?? "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)
          const indicatorColor = color ?? item.payload?.fill ?? item.color
          const value = valueFormatter
            ? valueFormatter(item.value, item.name, item)
            : formatValue(item.value, format)

          return (
            <div
              key={`${item.graphicalItemId ?? ""}-${String(item.dataKey ?? index)}-${index}`}
              data-slot="chart-tooltip-item"
              className={cn(
                "flex w-full flex-wrap items-stretch gap-2 [&>svg]:size-2.5 [&>svg]:shrink-0 [&>svg]:text-muted-foreground",
                indicator === "dot" && "items-center"
              )}
            >
              {formatter && item.value !== undefined && item.name ? (
                formatter(item.value, item.name, item, index, payload)
              ) : (
                <>
                  {itemConfig?.icon ? (
                    <itemConfig.icon />
                  ) : (
                    !hideIndicator && (
                      <div
                        aria-hidden
                        data-slot="chart-tooltip-indicator"
                        data-indicator={indicator}
                        style={
                          {
                            "--chart-indicator": indicatorColor,
                          } as React.CSSProperties
                        }
                        className={cn(
                          "shrink-0 rounded-[calc(var(--radius-sm)*0.4)] border-(--chart-indicator) bg-(--chart-indicator)",
                          indicator === "dot" && "size-2.5",
                          indicator === "line" && "w-1",
                          indicator === "dashed" &&
                            "w-0 border-[1.5px] border-dashed bg-transparent",
                          nestLabel && indicator === "dashed" && "my-0.5"
                        )}
                      />
                    )
                  )}
                  <div
                    className={cn(
                      "flex min-w-0 flex-1 justify-between gap-4 leading-none",
                      nestLabel ? "items-end" : "items-center"
                    )}
                  >
                    <div className="grid min-w-0 gap-1.5">
                      {nestLabel ? tooltipLabel : null}
                      <span className="text-muted-foreground">
                        {itemConfig?.label ?? item.name}
                      </span>
                    </div>
                    {value != null && value !== "" && value !== false && (
                      <span
                        dir="ltr"
                        className="shrink-0 font-medium text-foreground tabular-nums"
                      >
                        {value}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ChartLegend({
  itemSorter = null,
  ...props
}: React.ComponentProps<typeof RechartsPrimitive.Legend>) {
  return <RechartsPrimitive.Legend itemSorter={itemSorter} {...props} />
}

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: Pick<DefaultLegendContentProps, "payload" | "verticalAlign"> & {
  className?: string
  hideIcon?: boolean
  nameKey?: string
}) {
  const { config } = useChart()

  const items = payload?.filter((item) => item.type !== "none") ?? []

  if (!items.length) {
    return null
  }

  return (
    <div
      data-slot="chart-legend"
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {items.map((item, index) => {
        const key = `${nameKey ?? item.dataKey ?? "value"}`
        const itemConfig = getPayloadConfigFromPayload(config, item, key)

        return (
          <div
            key={`${String(item.dataKey ?? item.value ?? "")}-${index}`}
            data-slot="chart-legend-item"
            className="flex min-w-0 items-center gap-1.5 [&>svg]:size-3 [&>svg]:shrink-0 [&>svg]:text-muted-foreground"
          >
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                aria-hidden
                data-slot="chart-legend-indicator"
                style={
                  { "--chart-indicator": item.color } as React.CSSProperties
                }
                className="size-2 shrink-0 rounded-[calc(var(--radius-sm)*0.4)] bg-(--chart-indicator)"
              />
            )}
            <span className="min-w-0 wrap-anywhere">
              {itemConfig?.label ?? item.value}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return Object.hasOwn(config, configLabelKey)
    ? config[configLabelKey]
    : Object.hasOwn(config, key)
      ? config[key]
      : undefined
}

export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  useChart,
}
export type { ChartConfig, ChartTooltipContentProps }
