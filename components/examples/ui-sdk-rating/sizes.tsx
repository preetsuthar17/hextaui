import { Rating, RatingItem } from "@/components/ui/ui-sdk-rating"

function UiSdkRatingSizes() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Rating aria-label="Small rating" size="sm" defaultValue={3}>
        <RatingItem />
      </Rating>
      <Rating aria-label="Default rating" defaultValue={3}>
        <RatingItem />
      </Rating>
      <Rating aria-label="Large rating" size="lg" defaultValue={3}>
        <RatingItem />
      </Rating>
    </div>
  )
}

export { UiSdkRatingSizes }
