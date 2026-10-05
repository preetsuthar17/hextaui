"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useToday } from "@/hooks/use-today"

const formatter = new Intl.DateTimeFormat(undefined, { dateStyle: "full" })

function daysUntilNewYear(today: Date) {
  const next = new Date(today.getFullYear() + 1, 0, 1)
  return Math.round((next.getTime() - today.getTime()) / 86_400_000)
}

export function UseTodayDemo() {
  const today = useToday()

  return (
    <div className="flex flex-col items-center gap-1 text-center">
      {today ? (
        <>
          <p className="text-lg font-medium">{formatter.format(today)}</p>
          <p className="text-sm text-muted-foreground">
            {daysUntilNewYear(today)} days until New Year
          </p>
        </>
      ) : (
        <>
          <Skeleton className="h-6 w-56" />
          <Skeleton className="mt-1 h-4 w-36" />
        </>
      )}
    </div>
  )
}
