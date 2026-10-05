"use client"

import * as React from "react"
import { IconBellOff, IconX } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

const initial = [
  "Jun approved your pull request",
  "Mira mentioned you in #design",
  "Deploy to production finished",
]

export function EmptyTransition() {
  const [items, setItems] = React.useState(initial)

  return (
    <div className="flex min-h-64 w-full max-w-sm flex-col">
      {items.length > 0 ? (
        <ul className="flex flex-col gap-1 rounded-xl border p-1.5 text-sm">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-center justify-between gap-2 rounded-md py-1 ps-2.5"
            >
              <span className="min-w-0 truncate">{item}</span>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Dismiss “${item}”`}
                onClick={() =>
                  setItems(items.filter((other) => other !== item))
                }
              >
                <IconX />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <Empty variant="outline" size="sm">
          <EmptyHeader>
            <EmptyMedia variant="stack">
              <IconBellOff />
            </EmptyMedia>
            <EmptyTitle>No notifications</EmptyTitle>
            <EmptyDescription>
              Dismissed items are gone for good.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setItems(initial)}
            >
              Bring them back
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </div>
  )
}
