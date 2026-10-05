"use client"

import * as React from "react"
import { IconBell } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"

export function PopoverResizing() {
  const [rows, setRows] = React.useState(1)
  const [loading, setLoading] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <Popover
      onOpenChange={(open) => {
        if (open) {
          setRows(1)
          setLoading(true)
          clearTimeout(timer.current)
          timer.current = setTimeout(() => setLoading(false), 700)
        }
      }}
    >
      <PopoverTrigger render={<Button variant="outline" />}>
        <IconBell />
        Notifications
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Notifications</PopoverTitle>
          <PopoverDescription>
            The height animates as content loads and grows.
          </PopoverDescription>
        </PopoverHeader>
        {loading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <ul className="flex flex-col gap-2">
            {Array.from({ length: rows }, (_, index) => (
              <li
                key={index}
                className="rounded-md bg-muted px-2.5 py-2 text-sm"
              >
                Deploy #{1200 + index} finished in {12 + index}s
              </li>
            ))}
          </ul>
        )}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={() => setRows(Math.min(rows + 2, 12))}
          >
            Load more
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={loading || rows === 1}
            onClick={() => setRows(1)}
          >
            Collapse
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
