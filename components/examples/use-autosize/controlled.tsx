"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { useAutosize } from "@/hooks/use-autosize"

const template = `Hi team,

The release is out. Highlights:
- Faster search
- Offline drafts
- New keyboard shortcuts

Thanks!`

export function UseAutosizeControlled() {
  const ref = React.useRef<HTMLTextAreaElement>(null)
  const [value, setValue] = React.useState("")
  useAutosize(ref, true, value)

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <textarea
        ref={ref}
        rows={1}
        aria-label="Message"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Message"
        className="max-h-[calc(8lh+1rem)] min-h-[calc(2lh+1rem)] w-full resize-none rounded-lg bg-muted px-3 py-2 text-sm/6 outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden pointer-coarse:text-touch"
      />
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => setValue(template)}>
          Insert template
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setValue("")}>
          Clear
        </Button>
      </div>
    </div>
  )
}
