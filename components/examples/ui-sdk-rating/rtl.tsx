import { Rating, RatingItem } from "@/components/ui/ui-sdk-rating"

function UiSdkRatingRtl() {
  return (
    <div dir="rtl">
      <Rating aria-label="التقييم" step={0.5} defaultValue={2.5}>
        <RatingItem />
      </Rating>
    </div>
  )
}

export { UiSdkRatingRtl }
