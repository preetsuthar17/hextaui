"use client"

import { Marker, MarkerContent, MarkerTime } from "@/components/ui/marker"

const day = 24 * 60 * 60 * 1000
const dates = [0, 1, 3, 40, 400].map((ago) => new Date(Date.now() - ago * day))

export function MarkerTimeDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      {dates.map((date) => (
        <Marker key={date.getTime()} variant="separator">
          <MarkerContent>
            <MarkerTime date={date} />
          </MarkerContent>
        </Marker>
      ))}
      <Marker variant="separator">
        <MarkerContent>
          <MarkerTime
            date={dates[0]}
            format={(date) =>
              date.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })
            }
          />
        </MarkerContent>
      </Marker>
    </div>
  )
}
