"use client"

import * as React from "react"
import {
  IconArrowUpRight,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconDeviceTablet,
} from "@tabler/icons-react"
import { cn } from "cn"

import {
  CopyPromptButton,
  OpenInV0Link,
} from "@/components/blocks/block-actions"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const viewports = [
  { value: "desktop", label: "Desktop", icon: IconDeviceDesktop },
  { value: "tablet", label: "Tablet", icon: IconDeviceTablet },
  { value: "mobile", label: "Mobile", icon: IconDeviceMobile },
] as const

type Viewport = (typeof viewports)[number]["value"]

function BlockFrame({
  name,
  title,
  free,
}: {
  name: string
  title: string
  free?: boolean
}) {
  const [viewport, setViewport] = React.useState<Viewport>("desktop")
  const src = `/preview/blocks/${name}`

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ToggleGroup
          variant="outline"
          size="sm"
          aria-label="Preview size"
          value={[viewport]}
          onValueChange={(value) => {
            if (value.length > 0) setViewport(value[0] as Viewport)
          }}
          className="max-md:hidden"
        >
          {viewports.map(({ value, label, icon: Icon }) => (
            <ToggleGroupItem key={value} value={value} aria-label={label}>
              <Icon />
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div className="ms-auto flex flex-wrap items-center justify-end gap-1">
          <CopyPromptButton block={{ name, title, free }} />
          {free ? <OpenInV0Link name={name} /> : null}
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            aria-label="Open in new tab"
            render={<a href={src} target="_blank" rel="noreferrer" />}
          >
            <span className="max-sm:sr-only">Open in new tab</span>
            <IconArrowUpRight data-icon="inline-end" />
          </Button>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border bg-muted">
        <div
          className={cn(
            "relative isolate mx-auto h-150 w-full transition-all duration-300 ease-out-quint motion-reduce:transition-none sm:h-200",
            viewport === "tablet" && "max-w-3xl border-x",
            viewport === "mobile" && "max-w-sm border-x"
          )}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-1 flex flex-col items-center justify-center gap-2 bg-background text-sm text-muted-foreground motion-safe:animate-in motion-safe:fade-in-0 motion-safe:fill-mode-backwards motion-safe:animation-duration-300 motion-safe:delay-300"
          >
            <Spinner size="sm" />
            Loading {title}
          </div>
          <iframe
            src={src}
            title={`${title} preview`}
            className="block size-full"
          />
        </div>
      </div>
    </div>
  )
}

export { BlockFrame }
