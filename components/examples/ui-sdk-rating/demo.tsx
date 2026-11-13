"use client"

import * as React from "react"

import { Rating, RatingItem } from "@/components/ui/ui-sdk-rating"

const labels = ["Terrible", "Poor", "Okay", "Good", "Great"]

function UiSdkRatingDemo() {
  const [value, setValue] = React.useState<number | null>(4)

  return (
    <div className="flex flex-col items-center gap-2">
      <Rating
        aria-label="How was your stay?"
        size="lg"
        value={value}
        onValueChange={setValue}
        getValueLabel={(score, max) =>
          labels[score - 1] + ", " + score + " of " + max
        }
      >
        <RatingItem />
      </Rating>
      <p
        aria-hidden="true"
        className="min-h-5 text-sm text-muted-foreground tabular-nums"
      >
        {value ? labels[value - 1] : "Not rated yet"}
      </p>
    </div>
  )
}

export { UiSdkRatingDemo }
