import * as React from "react"
import { cleanup, render } from "@testing-library/react"
import { createPortal } from "react-dom"
import { renderToString } from "react-dom/server"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import type { TooltipValueType } from "recharts"
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  useChart,
  type ChartConfig,
} from "./chart"

beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(
    DOMRect.fromRect({ width: 400, height: 200 })
  )
})

afterEach(() => {
  cleanup()
})

const config = {
  visitors: { label: "Visitors" },
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: {
    label: "Mobile",
    theme: { light: "#2563eb", dark: "#dc2626" },
  },
  chrome: { label: "Chrome", color: "var(--chart-2)" },
} satisfies ChartConfig

function entry(
  overrides: Partial<{
    name: string
    dataKey: string
    value: TooltipValueType
    color: string
    payload: Record<string, unknown>
    type: "none"
  }>
) {
  return {
    name: "desktop",
    dataKey: "desktop",
    value: 1200,
    color: "var(--color-desktop)",
    payload: { month: "January", desktop: 1200 },
    graphicalItemId: "bar-1",
    ...overrides,
  }
}

function renderTooltip(
  props: React.ComponentProps<typeof ChartTooltipContent>,
  chartConfig: ChartConfig = config
) {
  return render(
    <ChartContainer config={chartConfig}>
      <div>
        <ChartTooltipContent active {...props} />
      </div>
    </ChartContainer>
  )
}

function tooltip(container: HTMLElement) {
  return container.querySelector<HTMLElement>("[data-slot=chart-tooltip]")
}

describe("ChartStyle", () => {
  it("writes a color variable per configured key for light and dark", () => {
    const { container } = render(<ChartStyle id="chart-a" config={config} />)
    const css = container.querySelector("style")!.innerHTML
    expect(css).toContain(
      ' [data-chart="chart-a"] {\n  --color-desktop: var(--chart-1);'
    )
    expect(css).toContain("--color-mobile: #2563eb;")
    expect(css).toContain('.dark [data-chart="chart-a"]')
    expect(css).toContain("--color-mobile: #dc2626;")
    expect(css).not.toContain("--color-visitors")
  })

  it("renders nothing without colors", () => {
    const { container } = render(
      <ChartStyle id="chart-a" config={{ total: { label: "Total" } }} />
    )
    expect(container.querySelector("style")).toBeNull()
  })

  it("keeps hostile ids, keys and colors inside the rule", () => {
    const { container } = render(
      <ChartStyle
        id={'x"] {} body { display: none } [a="'}
        config={{
          "Mobile users": { color: "red" },
          evil: { color: "red; } </style><script>alert(1)</script> {" },
        }}
      />
    )
    const css = container.querySelector("style")!.innerHTML
    expect(css).not.toContain("</style>")
    expect(css).not.toContain("display: none }")
    expect(css).toContain("--color-Mobile-users: red;")
    expect(css.match(/\{/g)?.length).toBe(css.match(/\}/g)?.length)
    expect(css.match(/\{/g)?.length).toBe(2)
  })
})

describe("ChartContainer", () => {
  it("scopes colors with a CSS-safe data-chart id", () => {
    const { container } = render(
      <ChartContainer config={config}>
        <div />
      </ChartContainer>
    )
    const root = container.querySelector<HTMLElement>("[data-slot=chart]")!
    expect(root.dataset.chart).toMatch(/^chart-[\w-]+$/)
    expect(container.querySelector("style")!.innerHTML).toContain(
      `[data-chart="${root.dataset.chart}"]`
    )
  })

  it("uses the id prop", () => {
    const { container } = render(
      <ChartContainer id="sales" config={config} className="h-40">
        <div />
      </ChartContainer>
    )
    const root = container.querySelector<HTMLElement>("[data-slot=chart]")!
    expect(root.dataset.chart).toBe("chart-sales")
    expect(root.className).toContain("h-40")
  })

  it("renders a full chart on the server", () => {
    const html = renderToString(
      <ChartContainer config={config} className="h-40">
        <BarChart data={[{ month: "Jan", desktop: 1 }]}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="desktop" fill="var(--color-desktop)" />
        </BarChart>
      </ChartContainer>
    )
    expect(html).toContain('data-slot="chart"')
    expect(html).toContain("--color-desktop")
  })

  it("throws a clear error when useChart is used outside", () => {
    function Probe() {
      useChart()
      return null
    }
    expect(() => render(<Probe />)).toThrow(
      "useChart must be used within <ChartContainer>."
    )
  })
})

describe("ChartTooltipContent", () => {
  it("renders nothing while inactive or empty", () => {
    const inactive = renderTooltip({ active: false, payload: [entry({})] })
    expect(tooltip(inactive.container)).toBeNull()
    cleanup()
    const empty = renderTooltip({ payload: [] })
    expect(tooltip(empty.container)).toBeNull()
  })

  it("shows the label, configured names and formatted values", () => {
    const { container } = renderTooltip({
      label: "January",
      payload: [
        entry({}),
        entry({ name: "mobile", dataKey: "mobile", value: 80 }),
      ],
    })
    const root = tooltip(container)!
    expect(root.textContent).toBe("JanuaryDesktop1,200Mobile80")
    expect(
      root.querySelectorAll("[data-slot=chart-tooltip-indicator]").length
    ).toBe(2)
  })

  it("keeps numeric labels", () => {
    const { container } = renderTooltip({ label: 2024, payload: [entry({})] })
    expect(
      container.querySelector("[data-slot=chart-tooltip-label]")!.textContent
    ).toBe("2024")
  })

  it("does not read labels from the object prototype", () => {
    const { container } = renderTooltip({
      label: "constructor",
      payload: [entry({})],
    })
    expect(
      container.querySelector("[data-slot=chart-tooltip-label]")!.textContent
    ).toBe("constructor")
  })

  it("formats values with the locale and joins ranges", () => {
    const { container } = renderTooltip({
      label: "Jan",
      locale: "de-DE",
      payload: [entry({ value: [1000.5, 2000] })],
    })
    expect(tooltip(container)!.textContent).toContain("1.000,5 – 2.000")
  })

  it("falls back when the locale is invalid", () => {
    const { container } = renderTooltip({
      label: "Jan",
      locale: "not a locale!!",
      payload: [entry({ value: 1234 })],
    })
    expect(tooltip(container)!.textContent).toContain("1,234")
  })

  it("hides the label and indicator on request", () => {
    const { container } = renderTooltip({
      label: "January",
      hideLabel: true,
      hideIndicator: true,
      payload: [entry({})],
    })
    expect(
      container.querySelector("[data-slot=chart-tooltip-label]")
    ).toBeNull()
    expect(
      container.querySelector("[data-slot=chart-tooltip-indicator]")
    ).toBeNull()
  })

  it("nests the label next to a single line indicator", () => {
    const { container } = renderTooltip({
      label: "January",
      indicator: "line",
      payload: [entry({})],
    })
    const item = container.querySelector("[data-slot=chart-tooltip-item]")!
    expect(item.querySelector("[data-slot=chart-tooltip-label]")).not.toBeNull()
    expect(
      item
        .querySelector("[data-slot=chart-tooltip-indicator]")!
        .getAttribute("data-indicator")
    ).toBe("line")
  })

  it("uses labelKey and nameKey", () => {
    const { container } = renderTooltip({
      label: "chrome",
      labelKey: "visitors",
      nameKey: "browser",
      payload: [
        entry({
          name: "visitors",
          dataKey: "visitors",
          value: 275,
          payload: { browser: "chrome", visitors: 275, fill: "red" },
        }),
      ],
    })
    expect(tooltip(container)!.textContent).toBe("VisitorsChrome275")
    expect(
      container
        .querySelector<HTMLElement>("[data-slot=chart-tooltip-indicator]")!
        .style.getPropertyValue("--chart-indicator")
    ).toBe("red")
  })

  it("passes values through formatter and labelFormatter", () => {
    const { container } = renderTooltip({
      label: "January",
      labelFormatter: (value) => `Month: ${value}`,
      formatter: (value, name) => (
        <span>
          {name}={String(value)}
        </span>
      ),
      payload: [entry({})],
    })
    expect(tooltip(container)!.textContent).toBe("Month: Januarydesktop=1200")
  })

  it("formats only the value with valueFormatter", () => {
    const { container } = renderTooltip({
      label: "January",
      valueFormatter: (value, name) => `$${value} ${name}`,
      payload: [entry({})],
    })
    expect(tooltip(container)!.textContent).toBe("JanuaryDesktop$1200 desktop")
    expect(
      container.querySelector("[data-slot=chart-tooltip-indicator]")
    ).not.toBeNull()
  })

  it("snaps into place when the tooltip reappears instead of gliding", async () => {
    const wrapper = document.createElement("div")
    wrapper.classList.add("recharts-tooltip-wrapper")
    document.body.append(wrapper)
    render(
      <ChartContainer config={config}>
        <div>
          {createPortal(
            <ChartTooltipContent active label="Jan" payload={[entry({})]} />,
            wrapper
          )}
        </div>
      </ChartContainer>
    )
    expect(wrapper.hasAttribute("data-chart-snap")).toBe(true)
    await new Promise((resolve) => setTimeout(resolve, 150))
    await new Promise((resolve) => requestAnimationFrame(resolve))
    await new Promise((resolve) => requestAnimationFrame(resolve))
    await new Promise((resolve) => requestAnimationFrame(resolve))
    expect(wrapper.hasAttribute("data-chart-snap")).toBe(false)

    wrapper.style.visibility = "hidden"
    await Promise.resolve()
    expect(wrapper.hasAttribute("data-chart-snap")).toBe(false)
    wrapper.style.visibility = "visible"
    await Promise.resolve()
    expect(wrapper.hasAttribute("data-chart-snap")).toBe(true)
    wrapper.style.transform = "translate(10px, 10px)"
    await Promise.resolve()
    await new Promise((resolve) => requestAnimationFrame(resolve))
    await new Promise((resolve) => requestAnimationFrame(resolve))
    await new Promise((resolve) => requestAnimationFrame(resolve))
    expect(wrapper.hasAttribute("data-chart-snap")).toBe(false)
    cleanup()
    wrapper.remove()
  })

  it("skips entries with type none", () => {
    const { container } = renderTooltip({
      label: "January",
      payload: [entry({}), entry({ name: "mobile", type: "none" })],
    })
    expect(
      container.querySelectorAll("[data-slot=chart-tooltip-item]").length
    ).toBe(1)
  })
})

describe("ChartLegendContent", () => {
  function renderLegend(
    props: React.ComponentProps<typeof ChartLegendContent>
  ) {
    return render(
      <ChartContainer config={config}>
        <div>
          <ChartLegendContent {...props} />
        </div>
      </ChartContainer>
    )
  }

  it("lists configured labels with swatches", () => {
    const { container } = renderLegend({
      payload: [
        { value: "desktop", dataKey: "desktop", color: "var(--color-desktop)" },
        { value: "mobile", dataKey: "mobile", color: "var(--color-mobile)" },
        { value: "hidden", dataKey: "hidden", type: "none" },
      ],
    })
    const items = container.querySelectorAll("[data-slot=chart-legend-item]")
    expect([...items].map((item) => item.textContent)).toEqual([
      "Desktop",
      "Mobile",
    ])
    expect(
      container
        .querySelector<HTMLElement>("[data-slot=chart-legend-indicator]")!
        .style.getPropertyValue("--chart-indicator")
    ).toBe("var(--color-desktop)")
  })

  it("falls back to the payload value and uses nameKey", () => {
    const { container } = renderLegend({
      nameKey: "browser",
      payload: [
        {
          value: "visitors",
          dataKey: "visitors",
          payload: { browser: "chrome" },
        },
        { value: "Other", dataKey: "other" },
      ],
    })
    const items = container.querySelectorAll("[data-slot=chart-legend-item]")
    expect([...items].map((item) => item.textContent)).toEqual([
      "Chrome",
      "Other",
    ])
  })

  it("renders nothing without items", () => {
    const { container } = renderLegend({ payload: [] })
    expect(container.querySelector("[data-slot=chart-legend]")).toBeNull()
  })
})
