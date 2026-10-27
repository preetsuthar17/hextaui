"use client"

import * as React from "react"
import { IconArrowUpRight } from "@tabler/icons-react"

import Link from "@/components/site/link"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type PreviewBlock = { name: string; title: string; category: string }

function applyTheme(
  frame: HTMLIFrameElement | null,
  vars: Record<string, string>,
  dark: boolean
) {
  const root = frame?.contentDocument?.documentElement
  if (!root) return
  for (const [name, value] of Object.entries(vars)) {
    root.style.setProperty(name, value)
  }
  root.style.colorScheme = dark ? "dark" : "light"
  if (root.classList.contains("dark") !== dark) {
    root.classList.toggle("dark", dark)
  }
}

function ProPreview({
  blocks,
  vars,
  dark,
}: {
  blocks: PreviewBlock[]
  vars: Record<string, string>
  dark: boolean
}) {
  const [active, setActive] = React.useState(blocks[0]?.name ?? "")
  const frameRef = React.useRef<HTMLIFrameElement>(null)
  const latest = React.useRef({ vars, dark })

  React.useEffect(() => {
    latest.current = { vars, dark }
    applyTheme(frameRef.current, vars, dark)
  }, [vars, dark])

  const onLoad = React.useCallback(() => {
    const frame = frameRef.current
    const root = frame?.contentDocument?.documentElement
    if (!root) return
    applyTheme(frame, latest.current.vars, latest.current.dark)
    const observer = new MutationObserver(() => {
      applyTheme(frame, latest.current.vars, latest.current.dark)
    })
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })
    frame.contentWindow?.addEventListener("pagehide", () => observer.disconnect(), {
      once: true,
    })
  }, [])

  const block = blocks.find((item) => item.name === active) ?? blocks[0]
  if (!block) return null

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b px-3 py-2">
        <ToggleGroup
          variant="outline"
          size="sm"
          aria-label="Pro block"
          value={[block.name]}
          onValueChange={(value) => {
            if (value[0]) setActive(value[0])
          }}
          className="max-w-full overflow-x-auto"
        >
          {blocks.map((item) => (
            <ToggleGroupItem key={item.name} value={item.name}>
              {item.title}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div className="ms-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href={`/blocks/${block.name}`} />}
          >
            About this block
          </Button>
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href="/pricing" />}
          >
            Get Pro
            <IconArrowUpRight data-icon="inline-end" />
          </Button>
        </div>
      </div>
      <iframe
        key={block.name}
        ref={frameRef}
        src={`/preview/blocks/${block.name}`}
        title={`${block.title} block with your theme`}
        onLoad={onLoad}
        className="block min-h-[36rem] w-full flex-1 bg-background"
      />
    </div>
  )
}

export { ProPreview, type PreviewBlock }
