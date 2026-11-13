import { Rating, RatingItem } from "@/components/ui/ui-sdk-rating"

function UiSdkRatingDeselectable() {
  return (
    <Rating aria-label="Rating" deselectable defaultValue={2}>
      <RatingItem />
    </Rating>
  )
}

export { UiSdkRatingDeselectable }
