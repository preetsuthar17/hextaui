import {
  Carousel,
  CarouselContent,
  CarouselCounter,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel"

export function CarouselDotsAndCounter() {
  return (
    <Carousel aria-label="Dots and counter" className="w-full max-w-md">
      <CarouselContent>
        {Array.from({ length: 12 }, (_, index) => (
          <CarouselItem key={index} className="basis-4/5">
            <div className="flex aspect-square items-center justify-center rounded-xl border bg-card p-6 text-4xl font-semibold">
              {index + 1}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-3 flex items-center justify-between gap-4">
        <CarouselCounter />
        <CarouselDots />
      </div>
    </Carousel>
  )
}
