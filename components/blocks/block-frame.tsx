"use client"

import * as React from "react"
import {
  IconArrowUpRight,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconDeviceTablet,
} from "@tabler/icons-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const viewports = [
  { value: "desktop", label: "Desktop", icon: IconDeviceDesktop },
  { value: "tablet", label: "Tablet", icon: IconDeviceTablet },
  { value: "mobile", label: "Mobile", icon: IconDeviceMobile },
] as const

type Viewport = (typeof viewports)[number]["value"]

function BlockFrame({ name, title }: { name: string; title: string }) {
  const [viewport, setViewport] = React.useState<Viewport>("desktop")
  const src = `/preview/blocks/${name}`

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
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
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          className="ms-auto"
          render={<a href={src} target="_blank" rel="noreferrer" />}
        >
          Open in new tab
          <IconArrowUpRight data-icon="inline-end" />
        </Button>
      </div>
      <div className="overflow-hidden rounded-xl border bg-muted">
        <iframe
          src={src}
          title={`${title} preview`}
          loading="lazy"
          className={cn(
            "mx-auto block h-150 w-full bg-background transition-all duration-300 ease-out-quint motion-reduce:transition-none sm:h-200",
            viewport === "tablet" && "max-w-3xl border-x",
            viewport === "mobile" && "max-w-sm border-x"
          )}
        />
      </div>
    </div>
  )
}

export { BlockFrame }
