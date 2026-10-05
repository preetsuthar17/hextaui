import {
  Carousel,
  CarouselAutoplayToggle,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel"

const slides = [1, 2, 3, 4, 5]

export function CarouselAutoplay() {
  return (
    <Carousel
      autoplay={{ delay: 3000 }}
      aria-label="Autoplay"
      className="w-full max-w-xs"
    >
      <CarouselContent>
        {slides.map((value) => (
          <CarouselItem key={value}>
            <div className="flex aspect-square items-center justify-center rounded-xl border bg-card p-6 text-4xl font-semibold">
              {value}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-3 flex items-center justify-center gap-2">
        <CarouselAutoplayToggle />
        <CarouselDots />
      </div>
    </Carousel>
  )
}
