import { DocsCodeBlock } from "@/components/docs/docs-code-block"
import { DocsComponentPage } from "@/components/docs/docs-component-page"
import {
  DocsCode,
  DocsList,
  DocsParagraph,
  DocsSection,
} from "@/components/docs/docs-content"
import { DocsExample } from "@/components/docs/docs-example"
import { DocsInstall } from "@/components/docs/docs-install"
import {
  DocsAttributesTable,
  DocsKeyboardTable,
  DocsPropsTable,
} from "@/components/docs/docs-props-table"
import { ChartBar } from "@/components/examples/chart/bar"
import { ChartDemo } from "@/components/examples/chart/demo"
import { ChartHorizontal } from "@/components/examples/chart/horizontal"
import { ChartIcons } from "@/components/examples/chart/icons"
import { ChartLine } from "@/components/examples/chart/line"
import { ChartLongLabels } from "@/components/examples/chart/long-labels"
import { ChartNegative } from "@/components/examples/chart/negative"
import { ChartPie } from "@/components/examples/chart/pie"
import { ChartRadar } from "@/components/examples/chart/radar"
import { ChartRtl } from "@/components/examples/chart/rtl"
import { ChartStacked } from "@/components/examples/chart/stacked"
import { ChartTheme } from "@/components/examples/chart/theme"
import { ChartTooltipIndicators } from "@/components/examples/chart/tooltip"
import { ChartValueFormat } from "@/components/examples/chart/value-format"
import { getDocsComponentMetadata } from "@/lib/docs"

export const metadata = getDocsComponentMetadata("chart")

const importCode = `import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"`

const configCode = `const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig`

const usageCode = `<ChartContainer
  aria-label="Bar chart of desktop and mobile visitors by month"
  config={chartConfig}
  className="min-h-52 w-full"
>
  <BarChart data={chartData}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" tickLine={false} axisLine={false} />
    <ChartTooltip content={<ChartTooltipContent />} />
    <ChartLegend content={<ChartLegendContent />} />
    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
  </BarChart>
</ChartContainer>`

const themeCode = `const chartConfig = {
  desktop: {
    label: "Desktop",
    icon: IconDeviceDesktop,
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    theme: {
      light: "oklch(0.5 0.17 285)",
      dark: "oklch(0.75 0.14 190)",
    },
  },
} satisfies ChartConfig`

const colorsCode = `<Bar dataKey="desktop" fill="var(--color-desktop)" />

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
]

<LabelList className="fill-(--color-desktop)" />`

const compositionCode = `ChartContainer
└── BarChart / LineChart / AreaChart / …
    ├── ChartTooltip
    │   └── ChartTooltipContent
    └── ChartLegend
        └── ChartLegendContent`

export default function Page() {
  return (
    <DocsComponentPage slug="chart">
      <DocsExample file="chart/demo" previewClassName="p-4 sm:p-6">
        <ChartDemo />
      </DocsExample>

      <DocsInstall
        dependencies={["recharts", "cn"]}
        files={["components/ui/chart.tsx"]}
      />

      <DocsSection title="Usage">
        <DocsParagraph>
          You build charts with Recharts components and add the parts from{" "}
          <DocsCode>chart</DocsCode> only where you need them. Recharts is not
          wrapped, so its own docs and upgrade guides apply as they are.
        </DocsParagraph>
        <DocsCodeBlock code={importCode} />
        <DocsParagraph>
          A <DocsCode>ChartConfig</DocsCode> maps each data key to a label, an
          optional icon and a color. It stays separate from the data, so one
          config can serve several charts.
        </DocsParagraph>
        <DocsCodeBlock code={configCode} />
        <DocsCodeBlock code={usageCode} />
        <DocsParagraph>
          Give <DocsCode>{"<ChartContainer />"}</DocsCode> a height, a{" "}
          <DocsCode>min-h-*</DocsCode> or an <DocsCode>aspect-*</DocsCode> so
          the chart can measure itself on the first render. Without one it falls
          back to <DocsCode>aspect-video</DocsCode>.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCodeBlock code={compositionCode} lang="text" />
      </DocsSection>

      <DocsSection title="Theming">
        <DocsParagraph>
          Each config key becomes a <DocsCode>--color-KEY</DocsCode> variable
          scoped to its chart. Point it at a theme token, at any CSS color, or
          give it separate <DocsCode>light</DocsCode> and{" "}
          <DocsCode>dark</DocsCode> values.
        </DocsParagraph>
        <DocsCodeBlock code={themeCode} />
        <DocsParagraph>
          Use the variable wherever Recharts takes a color: on components, in
          your data, or in Tailwind classes.
        </DocsParagraph>
        <DocsCodeBlock code={colorsCode} />
        <DocsParagraph>
          The theme ships five chart tokens, <DocsCode>--chart-1</DocsCode> to{" "}
          <DocsCode>--chart-5</DocsCode>: blue, teal, amber, violet and rose. In
          this order, neighbouring colors stay distinct with the common forms of
          color blindness, and each one has at least 3:1 contrast against the
          light and dark backgrounds. Use them in order and keep the legend or
          labels on, so color is never the only cue.
        </DocsParagraph>
        <DocsParagraph>
          Keys that are not valid in a CSS name, such as{" "}
          <DocsCode>Mobile users</DocsCode>, become{" "}
          <DocsCode>--color-Mobile-users</DocsCode>.
        </DocsParagraph>
      </DocsSection>

      <DocsSection title="Examples">
        <DocsExample
          file="chart/bar"
          title="Bar chart"
          description={
            <>
              A grid, an axis, <DocsCode>{"<ChartTooltip />"}</DocsCode> and{" "}
              <DocsCode>{"<ChartLegend />"}</DocsCode>. The tooltip and legend
              read their labels and colors from the config.
            </>
          }
        >
          <ChartBar />
        </DocsExample>
        <DocsExample
          file="chart/line"
          title="Line chart"
          description={
            <>
              <DocsCode>{'indicator="line"'}</DocsCode> matches the tooltip keys
              to the lines they describe.
            </>
          }
        >
          <ChartLine />
        </DocsExample>
        <DocsExample
          file="chart/stacked"
          title="Stacked bars"
          description={
            <>
              Bars with the same <DocsCode>stackId</DocsCode> stack. Round only
              the outer ends, so the stack reads as one bar.
            </>
          }
        >
          <ChartStacked />
        </DocsExample>
        <DocsExample
          file="chart/horizontal"
          title="Horizontal bars"
          description={
            <>
              Set <DocsCode>{'layout="vertical"'}</DocsCode> on the chart and
              swap the axis types. <DocsCode>{"<LabelList />"}</DocsCode> prints
              each value at the end of its bar.
            </>
          }
        >
          <ChartHorizontal />
        </DocsExample>
        <DocsExample
          file="chart/pie"
          title="Donut"
          description={
            <>
              Each slice takes its color from <DocsCode>fill</DocsCode> in the
              data. <DocsCode>nameKey</DocsCode> on the tooltip and legend looks
              up the label for each slice in the config.
            </>
          }
        >
          <ChartPie />
        </DocsExample>
        <DocsExample
          file="chart/radar"
          title="Radar"
          description="Polar grids and axes pick up the same muted strokes and labels as cartesian ones."
        >
          <ChartRadar />
        </DocsExample>
        <DocsExample
          file="chart/tooltip"
          title="Tooltip"
          description={
            <>
              Switch between <DocsCode>dot</DocsCode>, <DocsCode>line</DocsCode>{" "}
              and <DocsCode>dashed</DocsCode> indicators, and hide the label
              with <DocsCode>hideLabel</DocsCode>.{" "}
              <DocsCode>defaultIndex</DocsCode> on{" "}
              <DocsCode>{"<ChartTooltip />"}</DocsCode> shows a point on the
              first render.
            </>
          }
        >
          <ChartTooltipIndicators />
        </DocsExample>
        <DocsExample
          file="chart/value-format"
          title="Formatting values"
          description={
            <>
              <DocsCode>valueFormatter</DocsCode> formats the number and keeps
              the indicator and name. <DocsCode>labelFormatter</DocsCode> does
              the same for the label. To replace a whole row instead, use{" "}
              <DocsCode>formatter</DocsCode>.
            </>
          }
        >
          <ChartValueFormat />
        </DocsExample>
        <DocsExample
          file="chart/icons"
          title="Icons"
          description={
            <>
              An <DocsCode>icon</DocsCode> in the config replaces the color key
              in the tooltip and legend.
            </>
          }
        >
          <ChartIcons />
        </DocsExample>
        <DocsExample
          file="chart/theme"
          title="Light and dark colors"
          description={
            <>
              A <DocsCode>theme</DocsCode> object picks a different color in
              each theme. Switch the site theme to see it change.
            </>
          }
        >
          <ChartTheme />
        </DocsExample>
        <DocsExample
          file="chart/negative"
          title="Negative values"
          description={
            <>
              Color each bar with <DocsCode>{"<Cell />"}</DocsCode> and mark
              zero with <DocsCode>{"<ReferenceLine />"}</DocsCode>.
            </>
          }
        >
          <ChartNegative />
        </DocsExample>
        <DocsExample
          file="chart/long-labels"
          title="Long labels"
          description="Long series names wrap in the legend and the tooltip, and large values stay on one line beside them."
        >
          <ChartLongLabels />
        </DocsExample>
        <DocsExample
          file="chart/rtl"
          title="Right to left"
          description={
            <>
              Recharts does not mirror axes on its own. Set{" "}
              <DocsCode>reversed</DocsCode> on the x-axis and move the y-axis to
              the right. Pass <DocsCode>locale</DocsCode> to the tooltip to show
              the reader&apos;s digits.
            </>
          }
        >
          <ChartRtl />
        </DocsExample>
      </DocsSection>

      <DocsSection title="Keyboard">
        <DocsParagraph>
          Recharts turns on <DocsCode>accessibilityLayer</DocsCode> by default,
          so the chart is one tab stop that you move through point by point.
        </DocsParagraph>
        <DocsKeyboardTable
          keys={[
            {
              keys: ["Tab"],
              description: "Focuses the chart and shows a focus ring.",
            },
            {
              keys: ["←", "→"],
              description:
                "Moves the tooltip to the next or previous point. In a reversed axis the keys follow the screen.",
            },
            {
              keys: ["Enter"],
              description: "Shows or hides the tooltip at the current point.",
            },
          ]}
        />
      </DocsSection>

      <DocsSection title="Accessibility">
        <DocsList>
          <li>
            Charts are images to screen readers. Name each one with a visible
            title nearby or an <DocsCode>aria-label</DocsCode> on the Recharts
            chart, and offer a table when people need the exact values.
          </li>
          <li>
            The tooltip and legend name every series in text, so a reader never
            has to match colors alone.
          </li>
          <li>
            With reduced motion, Recharts skips its enter animations and the
            tooltip jumps between points instead of gliding.
          </li>
          <li>
            Tooltip values are formatted in <DocsCode>en-US</DocsCode> unless
            you pass <DocsCode>locale</DocsCode>, so the server and browser
            render the same text.
          </li>
        </DocsList>
      </DocsSection>

      <DocsSection title="API reference">
        <DocsParagraph>
          The parts sit on top of Recharts. Every Recharts prop still works on
          the chart components you put inside.
        </DocsParagraph>
        <DocsSection title="ChartContainer" level={3}>
          <DocsParagraph>
            Provides the config, writes the color variables and renders a
            Recharts <DocsCode>{"<ResponsiveContainer />"}</DocsCode> around its
            child. Takes every <DocsCode>{"<div>"}</DocsCode> prop.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              {
                name: "config",
                type: "ChartConfig",
                description: "Labels, icons and colors for each data key.",
              },
              {
                name: "children",
                type: "ReactElement",
                description: "One Recharts chart, such as <BarChart />.",
              },
              {
                name: "initialDimension",
                type: "{ width: number; height: number }",
                default: "{ width: 320, height: 200 }",
                description: "The size used before the container is measured.",
              },
              {
                name: "id",
                type: "string",
                description:
                  "Names the chart in data-chart. Generated when omitted.",
              },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              { name: 'data-slot="chart"', description: "The container." },
              {
                name: "data-chart",
                description: "The id the color variables are scoped to.",
              },
              {
                name: "--color-KEY",
                description: "One color variable per configured key.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ChartConfig" level={3}>
          <DocsPropsTable
            props={[
              { name: "label", type: "ReactNode" },
              {
                name: "icon",
                type: "ComponentType",
                description:
                  "Replaces the color key in the tooltip and legend.",
              },
              {
                name: "color",
                type: "string",
                description: "Any CSS color or variable.",
              },
              {
                name: "theme",
                type: "{ light: string; dark: string }",
                description: "Use instead of color for a color per theme.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ChartTooltip" level={3}>
          <DocsParagraph>
            The Recharts <DocsCode>{"<Tooltip />"}</DocsCode>, with a shorter
            glide between points. Takes every Recharts tooltip prop.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              {
                name: "content",
                type: "ReactElement | (props) => ReactNode",
                description: "Usually <ChartTooltipContent />.",
              },
              { name: "animationDuration", type: "number", default: "200" },
              {
                name: "animationEasing",
                type: "string",
                default: '"ease-out"',
              },
              {
                name: "defaultIndex",
                type: "number",
                description: "Shows the tooltip at this point on first render.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ChartTooltipContent" level={3}>
          <DocsPropsTable
            props={[
              {
                name: "indicator",
                type: '"dot" | "line" | "dashed"',
                default: '"dot"',
              },
              { name: "hideLabel", type: "boolean", default: "false" },
              { name: "hideIndicator", type: "boolean", default: "false" },
              {
                name: "labelKey",
                type: "string",
                description: "The config or data key to use for the label.",
              },
              {
                name: "nameKey",
                type: "string",
                description: "The config or data key to use for each name.",
              },
              {
                name: "valueFormatter",
                type: "(value, name, item) => ReactNode",
                description:
                  "Formats each value and keeps the indicator and name.",
              },
              {
                name: "labelFormatter",
                type: "(label, payload) => ReactNode",
              },
              {
                name: "formatter",
                type: "(value, name, item, index, payload) => ReactNode",
                description: "Replaces each row.",
              },
              {
                name: "locale",
                type: "Intl.LocalesArgument",
                default: '"en-US"',
                description: "Formats numeric values.",
              },
              {
                name: "color",
                type: "string",
                description: "One indicator color for every row.",
              },
              { name: "className", type: "string" },
              { name: "labelClassName", type: "string" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              { name: 'data-slot="chart-tooltip"', description: "The box." },
              {
                name: 'data-slot="chart-tooltip-label"',
                description: "The label.",
              },
              {
                name: 'data-slot="chart-tooltip-item"',
                description: "One row per series.",
              },
              {
                name: 'data-slot="chart-tooltip-indicator"',
                description: "The color key.",
              },
              {
                name: "data-indicator",
                description: "On the key: dot, line or dashed.",
              },
              {
                name: "--chart-indicator",
                description: "The key's color.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ChartLegend" level={3}>
          <DocsParagraph>
            The Recharts <DocsCode>{"<Legend />"}</DocsCode>. Takes every
            Recharts legend prop, and lists series in the order you declare them
            instead of alphabetically.
          </DocsParagraph>
          <DocsPropsTable
            props={[
              {
                name: "content",
                type: "ReactElement | (props) => ReactNode",
                description: "Usually <ChartLegendContent />.",
              },
              {
                name: "itemSorter",
                type: '"value" | "dataKey" | (item) => number | string | null',
                default: "null",
                description: "null keeps the declared order.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="ChartLegendContent" level={3}>
          <DocsPropsTable
            props={[
              { name: "hideIcon", type: "boolean", default: "false" },
              {
                name: "nameKey",
                type: "string",
                description: "The config or data key to use for each name.",
              },
              { name: "className", type: "string" },
            ]}
          />
          <DocsAttributesTable
            attributes={[
              { name: 'data-slot="chart-legend"', description: "The list." },
              {
                name: 'data-slot="chart-legend-item"',
                description: "One entry per series.",
              },
              {
                name: 'data-slot="chart-legend-indicator"',
                description: "The color swatch.",
              },
            ]}
          />
        </DocsSection>
        <DocsSection title="useChart" level={3}>
          <DocsParagraph>
            Returns <DocsCode>{"{ config }"}</DocsCode> inside a{" "}
            <DocsCode>{"<ChartContainer />"}</DocsCode>, for building your own
            tooltip or legend content.
          </DocsParagraph>
        </DocsSection>
      </DocsSection>
    </DocsComponentPage>
  )
}
