"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ScrollAreaDynamic() {
  const [count, setCount] = React.useState(4)

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <ScrollArea peek className="h-48 rounded-lg border">
        <ul className="flex flex-col gap-1 p-2">
          {Array.from({ length: count }, (_, index) => (
            <li key={index} className="rounded-md bg-muted px-3 py-3 text-sm">
              Item {index + 1}
            </li>
          ))}
        </ul>
      </ScrollArea>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => setCount(count + 1)}>
          Add item
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setCount(Math.max(0, count - 1))}
        >
          Remove item
        </Button>
      </div>
    </div>
  )
}
