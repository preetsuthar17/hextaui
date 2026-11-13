"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  createRatingController,
  Rating,
  RatingItem,
} from "@/components/ui/ui-sdk-rating"

function UiSdkRatingControlled() {
  const [rating] = React.useState(createRatingController)
  const [value, setValue] = React.useState<number | null>(null)

  return (
    <div className="flex flex-col items-center gap-3">
      <Rating
        aria-label="Rating"
        controller={rating}
        value={value}
        onValueChange={setValue}
      >
        <RatingItem />
      </Rating>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => rating.setValue(5)}>
          Rate 5
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={value === null}
          onClick={() => setValue(null)}
        >
          Clear
        </Button>
      </div>
      <p className="text-sm text-muted-foreground tabular-nums">
        {value === null ? "No score" : "Score: " + value}
      </p>
    </div>
  )
}

export { UiSdkRatingControlled }
