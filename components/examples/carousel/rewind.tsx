import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const slides = [1, 2, 3, 4, 5]

export function CarouselRewind() {
  return (
    <div className="w-full max-w-xs px-12">
      <Carousel rewind defaultIndex={2} aria-label="Rewind">
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
      </Carousel>
    </div>
  )
}
