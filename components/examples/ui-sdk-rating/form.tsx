"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Rating, RatingItem } from "@/components/ui/ui-sdk-rating"

function UiSdkRatingForm() {
  const [submitted, setSubmitted] = React.useState<string | null>(null)

  return (
    <form
      className="flex flex-col items-start gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(String(new FormData(event.currentTarget).get("score")))
      }}
      onReset={() => setSubmitted(null)}
    >
      <div className="flex flex-col gap-1.5">
        <span id="rating-form-label" className="text-sm font-medium">
          Rate this answer
        </span>
        <Rating aria-labelledby="rating-form-label" name="score" required>
          <RatingItem />
        </Rating>
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm">
          Submit
        </Button>
        <Button type="reset" variant="outline" size="sm">
          Reset
        </Button>
      </div>
      <p role="status" className="text-sm text-muted-foreground">
        {submitted ? "Submitted score=" + submitted : "Nothing submitted yet."}
      </p>
    </form>
  )
}

export { UiSdkRatingForm }
