import * as React from "react"

import { isBlogDiagram, type BlogDiagramName } from "@/lib/blog-diagrams"
import { T, t } from "@/lib/i18n/rich"
import { cn } from "@/lib/utils"

const codeClassName = "rounded-sm bg-muted px-1 py-px font-mono text-foreground"

function C({ children }: { children: string }) {
  return <code className={codeClassName}>{children}</code>
}

function withCode(text: string) {
  return text
    .split(/(`[^`]+`)/)
    .filter(Boolean)
    .map((part, index) =>
      part.startsWith("`") ? (
        <code key={index} className={codeClassName}>
          {part.slice(1, -1)}
        </code>
      ) : (
        part
      )
    )
}

function Arrow({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={cn("size-4 shrink-0 text-muted-foreground/70", className)}
    >
      <path
        d="M3 8h9m-3.5-3.5L12 8l-3.5 3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Panel({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-muted/30 p-4 sm:p-5 [&_code]:font-mono [&_code]:text-foreground",
        className
      )}
    >
      {children}
    </div>
  )
}

type FlowStep = {
  title: string
  label: React.ReactNode
  body: React.ReactNode
  accent?: boolean
}

function Flow({ steps }: { steps: FlowStep[] }) {
  return (
    <Panel>
      <ol className="flex flex-col items-stretch gap-2 sm:flex-row">
        {steps.map((step, index) => (
          <React.Fragment key={step.title}>
            {index > 0 ? (
              <li aria-hidden="true" className="flex justify-center self-center">
                <Arrow className="rotate-90 sm:rotate-0" />
              </li>
            ) : null}
            <li
              className={cn(
                "flex flex-1 flex-col gap-1.5 rounded-lg border bg-background p-3 text-sm/5",
                step.accent && "border-brand/50 ring-3 ring-brand/10"
              )}
            >
              <span className="font-medium text-foreground">
                {t(step.title)}
              </span>
              <span className="text-xs">{step.label}</span>
              <span className="text-pretty text-muted-foreground">
                <T>{step.body}</T>
              </span>
            </li>
          </React.Fragment>
        ))}
      </ol>
    </Panel>
  )
}

function LayersDiagram() {
  return (
    <div className="flex flex-col gap-3">
      <Flow
        steps={[
          {
            title: "Behaviors",
            label: <C>@ui-sdk/core</C>,
            body: "Focus, keys, selection, popups, drag and drop.",
          },
          {
            title: "Primitive",
            label: <C>definePrimitive</C>,
            body: "State, an API and named slots in one definition.",
          },
          {
            title: "Parts",
            label: <C>@ui-sdk/react</C>,
            body: (
              <>
                Each slot renders with <code>data-slot</code>, state attributes
                and CSS variables.
              </>
            ),
          },
          {
            title: "Your styles",
            label: <C>className</C>,
            body: "Tailwind utilities or plain CSS that target those hooks.",
            accent: true,
          },
        ]}
      />
      <Panel className="overflow-x-auto font-mono text-xs/6 text-muted-foreground">
        <p className="whitespace-nowrap">
          <span className="text-foreground">{"<div "}</span>
          {'data-slot="select-item" '}
          <span className="text-brand-strong">data-highlighted</span>
          {' data-selected role="option">'}
        </p>
        <p className="whitespace-nowrap">
          <span className="text-foreground">{"className="}</span>
          {'"data-highlighted:'}
          <span className="text-brand-strong">bg-accent</span>
          {' data-selected:font-medium"'}
        </p>
      </Panel>
    </div>
  )
}

type LifecycleStep = {
  title: string
  attrs: string[]
  note: string
  preview: "hidden" | "faint" | "full"
  dashed?: boolean
}

function LifecycleDiagram() {
  const steps: LifecycleStep[] = [
    {
      title: "Closed",
      attrs: [],
      note: "Not in the page",
      preview: "hidden",
      dashed: true,
    },
    {
      title: "First frame",
      attrs: ["data-open", "data-starting-style"],
      note: "Style the state you animate from",
      preview: "faint",
    },
    {
      title: "Open",
      attrs: ["data-open"],
      note: "Transitions to its normal styles",
      preview: "full",
    },
    {
      title: "Closing",
      attrs: ["data-closed", "data-ending-style"],
      note: "Stays mounted until the exit finishes",
      preview: "faint",
    },
    {
      title: "Unmounted",
      attrs: [],
      note: "Or hidden, with keepMounted",
      preview: "hidden",
      dashed: true,
    },
  ]

  return (
    <Panel>
      <ol className="grid gap-3 sm:grid-cols-5">
        {steps.map((step) => (
          <li
            key={step.title}
            className="flex items-start gap-3 sm:flex-col sm:items-stretch"
          >
            <div
              aria-hidden="true"
              className={cn(
                "flex h-16 w-20 shrink-0 items-center justify-center rounded-lg border bg-background sm:w-auto",
                step.dashed && "border-dashed"
              )}
            >
              <div
                className={cn(
                  "h-9 w-12 rounded-md border border-brand/60 bg-brand/25",
                  step.preview === "hidden" && "scale-95 opacity-0",
                  step.preview === "faint" && "scale-95 opacity-25"
                )}
              />
            </div>
            <div className="flex flex-col gap-1 text-sm/5">
              <span className="font-medium text-foreground">
                {t(step.title)}
              </span>
              {step.attrs.length ? (
                <span className="flex flex-wrap gap-1 text-xs">
                  {step.attrs.map((attr) => (
                    <C key={attr}>{attr}</C>
                  ))}
                </span>
              ) : null}
              <span className="text-pretty text-muted-foreground">
                {t(step.note)}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  )
}

type MatrixValue = { text: string; tone?: "yes" | "no" | "partial" }

const matrixLibraries = ["Radix", "Base UI", "UI SDK"]

const matrixRows: { label: string; values: MatrixValue[] }[] = [
  {
    label: "Package",
    values: [
      { text: "`radix-ui` 1.8.1" },
      { text: "`@base-ui/react` 1.9.0" },
      { text: "`@ui-sdk/react` 0.1.0-beta.1" },
    ],
  },
  {
    label: "License",
    values: [{ text: "MIT" }, { text: "MIT" }, { text: "Apache-2.0" }],
  },
  {
    label: "Status",
    values: [
      { text: "Stable", tone: "yes" },
      { text: "Stable", tone: "yes" },
      { text: "Beta", tone: "partial" },
    ],
  },
  {
    label: "Frameworks",
    values: [
      { text: "React" },
      { text: "React" },
      { text: "React, Vue, Svelte, Solid, Web Components" },
    ],
  },
  {
    label: "Open state",
    values: [
      { text: '`data-state="open"`' },
      { text: "`data-open`" },
      { text: "`data-open`" },
    ],
  },
  {
    label: "Enter and exit",
    values: [
      { text: "Keyframes on `data-state`" },
      { text: "`data-starting-style`, `data-ending-style`" },
      { text: "`data-starting-style`, `data-ending-style`" },
    ],
  },
  {
    label: "`data-slot` on parts",
    values: [
      { text: "No", tone: "no" },
      { text: "No", tone: "no" },
      { text: "Yes", tone: "yes" },
    ],
  },
  {
    label: "Popup parts",
    values: [
      { text: "Portal, Content" },
      { text: "Portal, Positioner, Popup" },
      { text: "Content in the top layer" },
    ],
  },
  {
    label: "Agent bridge",
    values: [
      { text: "No", tone: "no" },
      { text: "No", tone: "no" },
      { text: "Yes, with WebMCP", tone: "yes" },
    ],
  },
]

function Tone({ tone }: { tone?: MatrixValue["tone"] }) {
  if (!tone) return null
  return (
    <span
      aria-hidden="true"
      className={cn(
        "mt-1.5 size-2 shrink-0 rounded-full",
        tone === "yes" && "bg-chart-2",
        tone === "partial" && "bg-chart-3",
        tone === "no" && "border border-muted-foreground/60"
      )}
    />
  )
}

function MatrixDiagram() {
  return (
    <Panel className="overflow-x-auto p-0 sm:p-0">
      <table className="w-full min-w-xl border-collapse text-left text-sm/5 [&_code]:whitespace-nowrap">
        <thead>
          <tr className="border-b">
            <td className="p-3" />
            {matrixLibraries.map((library) => (
              <th
                key={library}
                scope="col"
                className={cn(
                  "p-3 font-display text-base font-semibold",
                  library === "UI SDK" && "text-brand-strong"
                )}
              >
                {library}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrixRows.map((row) => (
            <tr key={row.label} className="border-b last:border-b-0">
              <th
                scope="row"
                className="w-1/5 p-3 align-top font-medium text-foreground"
              >
                <T>{withCode(row.label)}</T>
              </th>
              {row.values.map((value, index) => (
                <td
                  key={matrixLibraries[index]}
                  className="p-3 align-top text-muted-foreground"
                >
                  <span className="flex gap-2">
                    <Tone tone={value.tone} />
                    <span>
                      <T>{withCode(value.text)}</T>
                    </span>
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  )
}

type TreeNode = { name: string; extra?: boolean; note?: string }

const anatomyTrees: { library: string; nodes: TreeNode[][] }[] = [
  {
    library: "Radix",
    nodes: [
      [{ name: "Popover.Root" }],
      [{ name: "Popover.Trigger" }, { name: "Popover.Portal", extra: true }],
      [{ name: "Popover.Content" }],
    ],
  },
  {
    library: "Base UI",
    nodes: [
      [{ name: "Popover.Root" }],
      [{ name: "Popover.Trigger" }, { name: "Popover.Portal", extra: true }],
      [{ name: "Popover.Positioner", extra: true }],
      [{ name: "Popover.Popup" }],
    ],
  },
  {
    library: "UI SDK",
    nodes: [
      [{ name: "Popover" }],
      [
        { name: "PopoverTrigger" },
        { name: "PopoverContent", note: "Rendered in place, in the top layer" },
      ],
    ],
  },
]

const indents = ["ps-0", "ps-3.5", "ps-7", "ps-10.5"]

function AnatomyDiagram() {
  return (
    <Panel>
      <div className="grid gap-4 sm:grid-cols-3">
        {anatomyTrees.map((tree) => (
          <div key={tree.library} className="flex flex-col gap-2">
            <p className="font-display text-base font-semibold">
              {tree.library}
            </p>
            <ul className="flex flex-col gap-1.5 font-mono text-xs/5">
              {tree.nodes.map((level, depth) =>
                level.map((node) => (
                  <li
                    key={node.name}
                    className={cn("flex flex-col", indents[depth])}
                  >
                    <span
                      className={cn(
                        "w-fit rounded-md border bg-background px-2 py-0.5 text-foreground",
                        node.extra && "border-dashed text-muted-foreground"
                      )}
                    >
                      {node.name}
                    </span>
                    {node.note ? (
                      <span className="mt-1 font-sans text-xs text-brand-strong">
                        {t(node.note)}
                      </span>
                    ) : null}
                  </li>
                ))
              )}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <span
          aria-hidden="true"
          className="h-4 w-8 rounded-sm border border-dashed"
        />
        {t("A part that exists to move or place the popup")}
      </p>
    </Panel>
  )
}

function BridgeDiagram() {
  const app = ["Input", "Select", "Switch", "Your definePrimitive parts"]
  return (
    <Panel>
      <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1.1fr_auto_1fr]">
        <div className="flex flex-col gap-2 rounded-lg border bg-background p-3">
          <p className="text-sm font-medium">{t("Your React app")}</p>
          <ul className="flex flex-col gap-1 text-xs">
            {app.map((item) => (
              <li
                key={item}
                className="rounded-md border px-2 py-1 text-muted-foreground"
              >
                {t(item)}
              </li>
            ))}
          </ul>
        </div>
        <Arrow className="mx-auto rotate-90 sm:rotate-0" />
        <div className="flex flex-col gap-2 rounded-lg border border-brand/50 bg-background p-3 ring-3 ring-brand/10">
          <p className="text-sm font-medium">
            <T>
              The bridge: <code>createAgent()</code>
            </T>
          </p>
          <ul className="flex flex-col gap-1 text-xs text-muted-foreground">
            <li>
              <T>
                <code>snapshot()</code> lists components, state and actions
              </T>
            </li>
            <li>
              <T>
                <code>query()</code> finds components and their choices
              </T>
            </li>
            <li>
              <T>
                <code>act()</code> runs steps through each component&apos;s API
              </T>
            </li>
            <li>
              <T>
                <code>allow</code> approves or refuses each step
              </T>
            </li>
          </ul>
        </div>
        <Arrow className="mx-auto rotate-90 sm:rotate-0" />
        <div className="flex flex-col gap-2">
          <div className="rounded-lg border bg-background p-3 text-xs text-muted-foreground">
            <p className="text-sm font-medium text-foreground">
              {t("Your own agent")}
            </p>
            <p className="mt-1">
              <T>
                Tool definitions from <code>agentTools</code>, wired to your
                model SDK
              </T>
            </p>
          </div>
          <div className="rounded-lg border bg-background p-3 text-xs text-muted-foreground">
            <p className="text-sm font-medium text-foreground">
              {t("A browser's agent")}
            </p>
            <p className="mt-1">
              <T>
                <code>registerTools()</code> publishes the tools on{" "}
                <code>document.modelContext</code> (WebMCP), with a second{" "}
                <code>allow</code>
              </T>
            </p>
          </div>
        </div>
      </div>
      <p className="mt-4 rounded-lg border border-dashed px-3 py-2 text-xs text-muted-foreground">
        <T>
          Every change an agent makes reaches your change callbacks with{" "}
          <code>details.source === &quot;agent&quot;</code>, and{" "}
          <code>details.cancel()</code> can still refuse it.
        </T>
      </p>
    </Panel>
  )
}

const benchmarkRows = [
  { label: "Tool calls", before: 16, after: 5, format: (n: number) => `${n}` },
  {
    label: "Text read (characters)",
    before: 39.8,
    after: 6.8,
    format: (n: number) => `${n}k`,
  },
  {
    label: "Time",
    before: 41,
    after: 16,
    format: (n: number) => `${n} s`,
  },
  {
    label: "Cost",
    before: 0.073,
    after: 0.032,
    format: (n: number) => `$${n.toFixed(3)}`,
  },
]

function BenchmarkDiagram() {
  return (
    <Panel>
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="size-2.5 rounded-sm bg-muted-foreground/40"
          />
          {t("Browser tools")}
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="size-2.5 rounded-sm bg-brand" />
          {t("UI SDK agent bridge")}
        </span>
      </div>
      <dl className="mt-4 flex flex-col gap-4">
        {benchmarkRows.map((row) => {
          const share = Math.round((row.after / row.before) * 100)
          return (
            <div key={row.label} className="flex flex-col gap-1.5">
              <dt className="flex justify-between gap-3 text-sm font-medium">
                <span>{t(row.label)}</span>
                <span className="font-normal text-muted-foreground tabular-nums">
                  −{100 - share}%
                </span>
              </dt>
              <dd className="flex flex-col gap-1 text-xs tabular-nums">
                <span className="flex items-center gap-2">
                  <span className="h-3 w-full rounded-sm bg-muted-foreground/40" />
                  <span className="w-14 shrink-0 text-end text-muted-foreground">
                    {row.format(row.before)}
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="flex h-3 w-full">
                    <span
                      className="h-full w-(--share) rounded-sm bg-brand"
                      style={{ "--share": `${share}%` } as React.CSSProperties}
                    />
                  </span>
                  <span className="w-14 shrink-0 text-end text-foreground">
                    {row.format(row.after)}
                  </span>
                </span>
              </dd>
            </div>
          )
        })}
      </dl>
      <p className="mt-4 text-xs text-muted-foreground">
        {t(
          "Source: Vercel's UI SDK docs. Medians of three runs per approach, Sonnet through Claude Code. Not reproduced by HextaUI."
        )}
      </p>
    </Panel>
  )
}

function PipelineDiagram() {
  return (
    <Flow
      steps={[
        {
          title: "Find the target",
          label: <C>ref</C>,
          body: "A ref like c3, then a label, an item, then a kind.",
        },
        {
          title: "Bridge allow",
          label: <C>createAgent</C>,
          body: "Your policy for every caller. False stops the call.",
        },
        {
          title: "WebMCP allow",
          label: <C>registerTools</C>,
          body: "A second policy, only for the browser's agent.",
        },
        {
          title: "Component API",
          label: <C>setValue</C>,
          body: "The same method a controller would call.",
        },
        {
          title: "Your callback",
          label: <C>details.source</C>,
          body: (
            <>
              Sees <code>&quot;agent&quot;</code> and can call{" "}
              <code>cancel()</code>.
            </>
          ),
          accent: true,
        },
      ]}
    />
  )
}

const diagrams: Record<BlogDiagramName, () => React.ReactNode> = {
  "ui-sdk-layers": LayersDiagram,
  "popup-lifecycle": LifecycleDiagram,
  "headless-matrix": MatrixDiagram,
  "popup-anatomy": AnatomyDiagram,
  "agent-bridge-flow": BridgeDiagram,
  "agent-benchmark": BenchmarkDiagram,
  "act-step-pipeline": PipelineDiagram,
}

function BlogDiagramBody({ name }: { name: string }) {
  if (!isBlogDiagram(name)) throw new Error(`blog: no diagram named ${name}`)
  const Diagram = diagrams[name]
  return <Diagram />
}

export { BlogDiagramBody }
