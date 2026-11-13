import { Rating, RatingItem } from "@/components/ui/ui-sdk-rating"

function UiSdkRatingDisabled() {
  return (
    <Rating aria-label="Rating" disabled defaultValue={3}>
      <RatingItem />
    </Rating>
  )
}

export { UiSdkRatingDisabled }
