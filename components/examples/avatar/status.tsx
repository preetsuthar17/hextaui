"use client"

import * as React from "react"
import { IconCheck } from "@tabler/icons-react"

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
  type AvatarStatus,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const sizes = ["xs", "sm", "default", "lg", "xl"] as const
const shapes = ["circle", "square"] as const
const statuses: AvatarStatus[] = ["online", "away", "busy", "offline"]

export function AvatarStatusDemo() {
  const [index, setIndex] = React.useState(0)
  const status = statuses[index]

  return (
    <div className="flex flex-col gap-4">
      {shapes.map((shape) => (
        <div key={shape} className="flex flex-wrap items-center gap-3">
          {sizes.map((size) => (
            <Avatar key={size} size={size} shape={shape}>
              <AvatarImage src="/preview/landscape.svg" alt="" />
              <AvatarFallback>GH</AvatarFallback>
              <AvatarBadge status={status} />
            </Avatar>
          ))}
          <Avatar size="lg" shape={shape}>
            <AvatarFallback>AT</AvatarFallback>
            <AvatarBadge>
              <IconCheck />
            </AvatarBadge>
          </Avatar>
        </div>
      ))}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIndex((index + 1) % statuses.length)}
        >
          Next status
        </Button>
        <span className="text-sm text-muted-foreground">{status}</span>
      </div>
    </div>
  )
}
