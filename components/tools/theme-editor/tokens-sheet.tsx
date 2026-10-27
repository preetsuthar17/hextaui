"use client"

import * as React from "react"
import { IconArrowBackUp, IconCircleCheck, IconCopy, IconLock } from "@tabler/icons-react"

import { DocsCopyButton } from "@/components/docs/docs-copy-button"
import { SliderRow, TokenEditor } from "@/components/tools/theme-editor/panels"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatOklch, type Oklch } from "@/lib/theme-editor/color"
import {
  checkContrast,
  type ContrastResult,
  type Theme,
  type ThemeMode,
} from "@/lib/theme-editor/theme"
import {
  colorScale,
  neutralAdjustment,
  scaleFamilies,
  scaleToCss,
  type Adjustment,
} from "@/lib/theme-editor/tools"
import { reportPairs, tokenLabel, type TokenName } from "@/lib/theme-editor/tokens"

type SheetTab = "colors" | "adjust" | "scales" | "contrast"

function AdjustPanel({
  theme,
  lockedCount,
  onAdjust,
}: {
  theme: Theme
  lockedCount: number
  onAdjust: (base: Theme, adjustment: Adjustment) => void
}) {
  const [session, setSession] = React.useState<{
    base: Theme
    seen: Theme
    pending: boolean
    values: Adjustment
  }>({ base: theme, seen: theme, pending: false, values: neutralAdjustment })

  let current = session
  if (session.seen !== theme) {
    current = session.pending
      ? { ...session, seen: theme, pending: false }
      : { base: theme, seen: theme, pending: false, values: neutralAdjustment }
    setSession(current)
  }

  const change = (patch: Partial<Adjustment>) => {
    const values = { ...current.values, ...patch }
    setSession({ ...current, values, pending: true })
    onAdjust(current.base, values)
  }

  const changed =
    current.values.hue !== 0 ||
    current.values.saturation !== 1 ||
    current.values.lightness !== 0

  return (
    <div className="flex flex-col gap-5 px-4 py-4">
      <p className="text-xs text-pretty text-muted-foreground">
        Shift every color in both modes at once.
        {lockedCount > 0
          ? ` ${lockedCount} locked ${lockedCount === 1 ? "token stays" : "tokens stay"} put.`
          : " Lock a token on the Colors tab to keep it out."}
      </p>
      <SliderRow
        id="adjust-hue"
        label="Hue"
        value={current.values.hue}
        min={-180}
        max={180}
        step={1}
        format={(value) => `${value > 0 ? "+" : ""}${value}°`}
        onChange={(hue) => change({ hue })}
      />
      <SliderRow
        id="adjust-saturation"
        label="Saturation"
        value={current.values.saturation}
        min={0}
        max={2}
        step={0.05}
        format={(value) => `${Math.round(value * 100)}%`}
        onChange={(saturation) => change({ saturation })}
      />
      <SliderRow
        id="adjust-lightness"
        label="Lightness"
        value={current.values.lightness}
        min={-0.15}
        max={0.15}
        step={0.005}
        format={(value) => `${value > 0 ? "+" : ""}${Math.round(value * 1000) / 10}`}
        onChange={(lightness) => change({ lightness })}
      />
      <div>
        <Button
          variant="outline"
          size="sm"
          disabled={!changed}
          onClick={() => change(neutralAdjustment)}
        >
          <IconArrowBackUp data-icon="inline-start" />
          Reset sliders
        </Button>
      </div>
    </div>
  )
}

function ScaleRow({ name, base }: { name: TokenName; base: Oklch }) {
  const scale = React.useMemo(() => colorScale(base), [base])
  const css = React.useMemo(() => scaleToCss([{ name, base }]), [name, base])
  const [copied, setCopied] = React.useState<number | null>(null)

  return (
    <li className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium">{tokenLabel(name)}</span>
        <DocsCopyButton
          value={css}
          label={`Copy ${tokenLabel(name).toLowerCase()} scale`}
          event="Theme editor copy"
          eventProps={{ format: "scale" }}
        />
      </div>
      <div role="group" aria-label={`${tokenLabel(name)} scale`} className="grid grid-cols-11 gap-0.5">
        {scale.map(({ step, color }, index) => {
          const value = formatOklch(color)
          return (
            <button
              key={step}
              type="button"
              title={`${step}: ${value}`}
              aria-label={`Copy ${step}: ${value}`}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(value)
                  setCopied(step)
                  setTimeout(() => setCopied(null), 1200)
                } catch {}
              }}
              className="group/step flex h-9 flex-col items-center justify-end rounded-sm bg-(--swatch) pb-0.5 text-xs/none outline-none inset-ring-(length:--hairline) inset-ring-foreground/10 focus-visible:ring-3 focus-visible:ring-focus-ring forced-colors:border"
              style={
                {
                  "--swatch": value,
                  "--label": formatOklch(scale[index < 5 ? 10 : 0].color),
                } as React.CSSProperties
              }
            >
              <span className="text-(--label) opacity-0 group-hover/step:opacity-100 group-focus-visible/step:opacity-100">
                {copied === step ? <IconCopy className="size-3" aria-hidden="true" /> : step}
              </span>
            </button>
          )
        })}
      </div>
    </li>
  )
}

function ScalesPanel({ theme, mode }: { theme: Theme; mode: ThemeMode }) {
  const families = scaleFamilies.map((name) => ({ name, base: theme[mode][name] }))
  const all = React.useMemo(
    () => scaleToCss(scaleFamilies.map((name) => ({ name, base: theme[mode][name] }))),
    [theme, mode]
  )

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-pretty text-muted-foreground">
          50 to 950 from each token’s hue and chroma. Click a step to copy it.
        </p>
        <DocsCopyButton
          value={all}
          label="Copy every scale as Tailwind @theme colors"
          event="Theme editor copy"
          eventProps={{ format: "scales" }}
        />
      </div>
      <ul className="flex flex-col gap-4">
        {families.map((family) => (
          <ScaleRow key={family.name} name={family.name} base={family.base} />
        ))}
      </ul>
    </div>
  )
}

function apcaTarget(result: ContrastResult) {
  return result.kind === "ui" ? 45 : 60
}

function ContrastRow({
  result,
  colors,
  onJump,
}: {
  result: ContrastResult
  colors: { fg: string; bg: string }
  onJump: () => void
}) {
  const aaa = result.kind === "ui" ? null : result.ratio >= 7
  const apca = Math.abs(result.apca)
  const apcaPass = apca >= apcaTarget(result)

  return (
    <li>
      <button
        type="button"
        onClick={onJump}
        className="group/row flex w-full items-center gap-3 px-4 py-2 text-start outline-none hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:ring-inset"
      >
        <span
          aria-hidden="true"
          className="grid size-8 shrink-0 place-items-center rounded-md bg-(--pair-bg) text-sm font-semibold text-(--pair-fg) inset-ring-(length:--hairline) inset-ring-foreground/10 forced-colors:border"
          style={
            {
              "--pair-bg": colors.bg,
              "--pair-fg": colors.fg,
            } as React.CSSProperties
          }
        >
          {result.kind === "ui" ? <span className="size-3 rounded-full bg-(--pair-fg)" /> : "Aa"}
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-xs font-medium">{tokenLabel(result.foreground)}</span>
          <span className="truncate text-xs text-muted-foreground">
            on {tokenLabel(result.background).toLowerCase()}
            {result.kind === "ui" ? ", UI" : ""}
          </span>
        </span>
        <span className="flex shrink-0 flex-col items-end gap-0.5 text-xs tabular-nums">
          <span
            data-fail={result.passes ? undefined : ""}
            className="font-medium data-fail:text-destructive"
          >
            {result.ratio.toFixed(2)}:1 {result.passes ? (aaa ? "AAA" : "AA") : "Fail"}
          </span>
          <span
            data-fail={apcaPass ? undefined : ""}
            className="text-muted-foreground data-fail:text-destructive"
          >
            Lc {apca.toFixed(0)}
          </span>
        </span>
      </button>
    </li>
  )
}

function ContrastReport({
  theme,
  mode,
  onJump,
}: {
  theme: Theme
  mode: ThemeMode
  onJump: (name: TokenName) => void
}) {
  const results = React.useMemo(() => checkContrast(theme, mode, reportPairs), [theme, mode])
  const sorted = React.useMemo(
    () => [...results].sort((a, b) => Number(a.passes) - Number(b.passes) || a.ratio / a.minimum - b.ratio / b.minimum),
    [results]
  )
  const failing = results.filter((result) => !result.passes).length

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-1 border-b px-4 py-3 text-xs">
        <p className="flex items-center gap-1.5 font-medium">
          {failing === 0 ? (
            <IconCircleCheck className="size-3.5 text-success" aria-hidden="true" />
          ) : null}
          {failing === 0
            ? `All ${results.length} pairs pass in ${mode} mode`
            : `${failing} of ${results.length} pairs fail in ${mode} mode`}
        </p>
        <p className="text-pretty text-muted-foreground">
          Text needs 4.5:1 (AA) and 7:1 for AAA. UI parts and chart colors need
          3:1. APCA Lc aims for 60 on text and 45 on UI. Click a pair to edit it.
        </p>
      </div>
      <ul className="flex flex-col py-1">
        {sorted.map((result) => (
          <ContrastRow
            key={`${result.foreground}-${result.background}`}
            result={result}
            colors={{
              fg: formatOklch(theme[mode][result.foreground]),
              bg: formatOklch(theme[mode][result.background]),
            }}
            onJump={() => onJump(result.foreground)}
          />
        ))}
      </ul>
    </div>
  )
}

function TokensSheetBody({
  theme,
  mode,
  tab,
  onTabChange,
  locked,
  linked,
  onLinkedChange,
  onToggleLock,
  onTokenChange,
  onAdjust,
}: {
  theme: Theme
  mode: ThemeMode
  tab: SheetTab
  onTabChange: (tab: SheetTab) => void
  locked: ReadonlySet<TokenName>
  linked: boolean
  onLinkedChange: (linked: boolean) => void
  onToggleLock: (name: TokenName) => void
  onTokenChange: (name: TokenName, color: Oklch) => void
  onAdjust: (base: Theme, adjustment: Adjustment) => void
}) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const pendingJump = React.useRef<TokenName | null>(null)

  React.useEffect(() => {
    const name = pendingJump.current
    if (tab !== "colors" || !name) return
    pendingJump.current = null
    const input = document.getElementById(`token-${mode}-${name}`)
    if (!(input instanceof HTMLInputElement)) return
    input.scrollIntoView({ block: "center" })
    input.focus({ preventScroll: true })
    input.select()
  }, [tab, mode])

  return (
    <div ref={rootRef}>
      <Tabs value={tab} onValueChange={(value) => onTabChange(value as SheetTab)}>
        <div className="sticky top-0 z-10 border-b bg-popover px-4 pt-2">
          <TabsList variant="line">
            <TabsTrigger value="colors">
              Colors
              {locked.size > 0 ? (
                <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground tabular-nums">
                  <IconLock className="size-3" aria-label="locked" />
                  {locked.size}
                </span>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value="adjust">Adjust</TabsTrigger>
            <TabsTrigger value="scales">Scales</TabsTrigger>
            <TabsTrigger value="contrast">Contrast</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="colors">
          <TokenEditor
            theme={theme}
            mode={mode}
            locked={locked}
            linked={linked}
            onLinkedChange={onLinkedChange}
            onToggleLock={onToggleLock}
            onChange={onTokenChange}
          />
        </TabsContent>
        <TabsContent value="adjust">
          <AdjustPanel theme={theme} lockedCount={locked.size} onAdjust={onAdjust} />
        </TabsContent>
        <TabsContent value="scales">
          <ScalesPanel theme={theme} mode={mode} />
        </TabsContent>
        <TabsContent value="contrast">
          <ContrastReport
            theme={theme}
            mode={mode}
            onJump={(name) => {
              pendingJump.current = name
              if (tab === "colors") return
              onTabChange("colors")
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export { TokensSheetBody, type SheetTab }
