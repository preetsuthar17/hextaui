import {
  Carousel,
  CarouselContent,
  CarouselCounter,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel"

export function CarouselLongContent() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Carousel aria-label="Long content">
        <CarouselContent>
          <CarouselItem className="basis-4/5">
            <div className="rounded-xl border bg-card p-4 text-sm wrap-anywhere">
              Supercalifragilisticexpialidocious_with_an_unbroken_string_that_never_ends_and_keeps_going_well_past_the_edge
            </div>
          </CarouselItem>
          <CarouselItem className="basis-4/5">
            <div className="rounded-xl border bg-card p-4 text-sm">
              مرحبا 你好 👩‍👩‍👧‍👦 A second slide with mixed scripts.
            </div>
          </CarouselItem>
        </CarouselContent>
        <div className="mt-3 flex justify-center">
          <CarouselDots />
        </div>
      </Carousel>
      <Carousel aria-label="Single slide">
        <CarouselContent>
          <CarouselItem>
            <div className="flex aspect-video items-center justify-center rounded-xl border bg-card p-6 text-2xl font-semibold">
              Only one
            </div>
          </CarouselItem>
        </CarouselContent>
        <div className="mt-3 flex items-center justify-between">
          <CarouselCounter />
          <CarouselDots />
        </div>
      </Carousel>
    </div>
  )
}
