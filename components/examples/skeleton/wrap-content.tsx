"use client"

import * as React from "react"
import { IconUserPlus } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonWrapContent() {
  const [loading, setLoading] = React.useState(true)

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex items-start gap-4 rounded-xl border p-4">
        <Skeleton loading={loading} className="rounded-full">
          <img
            src="/preview/landscape.svg"
            alt=""
            className="size-12 rounded-full object-cover"
          />
        </Skeleton>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Skeleton loading={loading}>
            <h3 className="font-semibold">Olivia Martin</h3>
          </Skeleton>
          <Skeleton loading={loading}>
            <p className="text-sm text-muted-foreground">
              Design engineer at Acme. Writes about motion and small details.
            </p>
          </Skeleton>
        </div>
        <Skeleton loading={loading}>
          <Button size="sm" variant="outline">
            <IconUserPlus data-icon="inline-start" />
            Follow
          </Button>
        </Skeleton>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => setLoading(false)}>
          Load
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setLoading(true)}>
          Reset
        </Button>
      </div>
    </div>
  )
}
