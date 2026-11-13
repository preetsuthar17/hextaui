import { Rating, RatingItem } from "@/components/ui/ui-sdk-rating"

function UiSdkRatingHalf() {
  return (
    <Rating aria-label="Rating" step={0.5} defaultValue={3.5}>
      <RatingItem />
    </Rating>
  )
}

export { UiSdkRatingHalf }
