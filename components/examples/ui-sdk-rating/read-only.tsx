"use client"

import { Rating, RatingItem } from "@/components/ui/ui-sdk-rating"

function UiSdkRatingReadOnly() {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Rating
        readOnly
        size="sm"
        value={4.3}
        getValueLabel={(value, max) =>
          "Rated " + value + " out of " + max + " stars"
        }
      >
        <RatingItem />
      </Rating>
      <span className="font-medium tabular-nums">4.3</span>
      <span className="text-muted-foreground">(1,284 reviews)</span>
    </div>
  )
}

export { UiSdkRatingReadOnly }
