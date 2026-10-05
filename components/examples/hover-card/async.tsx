"use client"

import * as React from "react"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Skeleton, SkeletonText } from "@/components/ui/skeleton"

type Repo = { name: string; description: string; stars: number }

function fetchRepo(): Promise<Repo> {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          name: "hextaui/hextaui",
          description:
            "Components built on shadcn/ui and Base UI, with motion, keyboard support and edge cases handled. Copy them into your project and make them yours.",
          stars: 2140,
        }),
      900
    )
  )
}

export function HoverCardAsync() {
  const [repo, setRepo] = React.useState<Repo | null>(null)
  const request = React.useRef<Promise<void> | null>(null)

  return (
    <HoverCard
      onOpenChange={(open) => {
        if (open && !request.current) {
          request.current = fetchRepo().then(setRepo)
        }
      }}
    >
      <HoverCardTrigger
        href="#"
        delay={200}
        render={
          <a className="text-sm font-medium underline decoration-border underline-offset-4 hover:decoration-foreground" />
        }
      >
        hextaui/hextaui
      </HoverCardTrigger>
      <HoverCardContent className="w-72" aria-busy={!repo}>
        {repo ? (
          <div className="flex flex-col gap-1.5">
            <p className="font-medium">{repo.name}</p>
            <p className="text-muted-foreground">{repo.description}</p>
            <p className="text-xs text-muted-foreground">
              {repo.stars.toLocaleString("en-US")} stars
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <SkeletonText lines={2} />
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  )
}
