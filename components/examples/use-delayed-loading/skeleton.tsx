"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useDelayedLoading } from "@/hooks/use-delayed-loading"

const people = ["Ada Lovelace", "Grace Hopper", "Alan Turing"]

export function UseDelayedLoadingSkeleton() {
  const [loading, setLoading] = React.useState(false)
  const [cached, setCached] = React.useState(false)
  const showSkeleton = useDelayedLoading(loading, {
    delay: 200,
    minDuration: 500,
  })

  const refresh = () => {
    setLoading(true)
    setTimeout(
      () => {
        setLoading(false)
        setCached(true)
      },
      cached ? 60 : 1200
    )
  }

  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <ul className="flex flex-col gap-3">
        {people.map((name) => (
          <li key={name} className="flex h-5 items-center text-sm">
            {showSkeleton ? <Skeleton className="h-3 w-32" /> : name}
          </li>
        ))}
      </ul>
      <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
        {cached ? "Refresh (cached)" : "Refresh (slow)"}
      </Button>
    </div>
  )
}
