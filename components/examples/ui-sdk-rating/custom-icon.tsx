import { IconHeart, IconHeartFilled } from "@tabler/icons-react"

import { Rating, RatingItem } from "@/components/ui/ui-sdk-rating"

function UiSdkRatingCustomIcon() {
  return (
    <Rating
      aria-label="How much did you like it?"
      defaultValue={3}
      tone="destructive"
    >
      <RatingItem>
        <IconHeart
          aria-hidden="true"
          className="size-6 group-data-[filled]/rating-item:hidden group-data-[partial]/rating-item:hidden"
        />
        <IconHeartFilled
          aria-hidden="true"
          className="hidden size-6 group-data-[filled]/rating-item:block group-data-[partial]/rating-item:block"
        />
      </RatingItem>
    </Rating>
  )
}

export { UiSdkRatingCustomIcon }
