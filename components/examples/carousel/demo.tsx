import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const slides = [1, 2, 3, 4, 5]

export function CarouselDemo() {
  return (
    <div className="w-full max-w-xs px-12">
      <Carousel aria-label="Numbers">
        <CarouselContent>
          {slides.map((value) => (
            <CarouselItem key={value}>
              <div className="flex aspect-square items-center justify-center rounded-xl border bg-card p-6 text-4xl font-semibold">
                {value}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <div className="mt-3 flex justify-center">
          <CarouselDots />
        </div>
      </Carousel>
    </div>
  )
}
