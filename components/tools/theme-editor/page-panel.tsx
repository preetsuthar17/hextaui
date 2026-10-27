"use client"

import * as React from "react"
import {
  IconBuildingStore,
  IconComponents,
  IconCreditCard,
  IconLayoutDashboard,
  IconLogin2,
  IconMail,
  IconMessageCircle,
  IconSettings,
  IconStack2,
} from "@tabler/icons-react"

import { SectionTitle } from "@/components/tools/theme-editor/panels"
import { Kbd } from "@/components/ui/kbd"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cvdModes, type CvdMode } from "@/lib/theme-editor/tools"

type PreviewPage =
  | "components"
  | "dashboard"
  | "chat"
  | "sign-in"
  | "pricing"
  | "settings"
  | "mail"
  | "store"
  | "blocks"

const previewPages: { value: PreviewPage; label: string; icon: React.ReactNode }[] = [
  { value: "components", label: "Components", icon: <IconComponents /> },
  { value: "dashboard", label: "Dashboard", icon: <IconLayoutDashboard /> },
  { value: "chat", label: "AI chat", icon: <IconMessageCircle /> },
  { value: "sign-in", label: "Sign in", icon: <IconLogin2 /> },
  { value: "pricing", label: "Pricing", icon: <IconCreditCard /> },
  { value: "settings", label: "Settings", icon: <IconSettings /> },
  { value: "mail", label: "Mail", icon: <IconMail /> },
  { value: "store", label: "Store", icon: <IconBuildingStore /> },
  { value: "blocks", label: "Pro blocks", icon: <IconStack2 /> },
]

type CompareTarget = "default" | "saved"

function PagePanel({
  page,
  onPageChange,
  cvd,
  onCvdChange,
  compareTarget,
  onCompareTargetChange,
  hasSaved,
  comparing,
  onComparingChange,
}: {
  page: PreviewPage
  onPageChange: (page: PreviewPage) => void
  cvd: CvdMode
  onCvdChange: (mode: CvdMode) => void
  compareTarget: CompareTarget
  onCompareTargetChange: (target: CompareTarget) => void
  hasSaved: boolean
  comparing: boolean
  onComparingChange: (comparing: boolean) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <div role="radiogroup" aria-label="Preview page" className="grid grid-cols-3 gap-1">
        {previewPages.map((item, index) => (
          <button
            key={item.value}
            type="button"
            role="radio"
            aria-checked={item.value === page}
            onClick={() => onPageChange(item.value)}
            className="flex h-14 min-w-0 flex-col items-start justify-between rounded-md p-2 text-start text-xs text-muted-foreground inset-ring-(length:--hairline) inset-ring-border outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-focus-ring aria-checked:bg-muted aria-checked:text-foreground aria-checked:inset-ring-foreground/30 forced-colors:border forced-colors:aria-checked:outline-2 forced-colors:aria-checked:outline-solid [&_svg]:size-4"
          >
            <span className="flex w-full items-center justify-between">
              {item.icon}
              <span className="text-xs text-muted-foreground/70 tabular-nums max-sm:hidden">
                {index + 1}
              </span>
            </span>
            <span className="truncate font-medium">{item.label}</span>
          </button>
        ))}
      </div>
      <div className="-mx-3 border-t" />
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <SectionTitle>Color vision</SectionTitle>
          <span className="text-xs text-muted-foreground">Canvas only</span>
        </div>
        <div role="radiogroup" aria-label="Simulate color vision" className="-mx-1 flex flex-col">
          {cvdModes.map((mode) => (
            <button
              key={mode.value}
              type="button"
              role="radio"
              aria-checked={mode.value === cvd}
              onClick={() => onCvdChange(mode.value)}
              className="flex h-7 items-center gap-2 rounded-md px-1.5 text-start text-xs outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-focus-ring aria-checked:bg-muted forced-colors:aria-checked:outline-1 forced-colors:aria-checked:outline-solid"
            >
              <span
                aria-hidden="true"
                className="grid size-3.5 shrink-0 place-items-center rounded-full inset-ring-(length:--hairline) inset-ring-foreground/30 in-aria-checked:inset-ring-4 in-aria-checked:inset-ring-foreground forced-colors:border"
              />
              <span className="font-medium">{mode.label}</span>
              <span className="ms-auto truncate text-muted-foreground">{mode.description}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="-mx-3 border-t" />
      <div className="flex flex-col gap-2">
        <label className="flex items-center justify-between gap-3">
          <span className="flex flex-col gap-0.5">
            <SectionTitle>Compare</SectionTitle>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              Or hold <Kbd size="sm">B</Kbd> to peek
            </span>
          </span>
          <Switch size="sm" checked={comparing} onCheckedChange={onComparingChange} />
        </label>
        <ToggleGroup
          variant="outline"
          size="sm"
          aria-label="Compare with"
          value={[compareTarget]}
          onValueChange={(next) => {
            if (next[0]) onCompareTargetChange(next[0] as CompareTarget)
          }}
          className="grid w-full grid-cols-2"
        >
          <ToggleGroupItem value="default">HextaUI default</ToggleGroupItem>
          <ToggleGroupItem value="saved" disabled={!hasSaved}>
            Last saved
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  )
}

export { PagePanel, previewPages, type CompareTarget, type PreviewPage }
