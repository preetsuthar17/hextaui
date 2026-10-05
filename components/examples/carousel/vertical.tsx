import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const slides = [1, 2, 3, 4, 5]

export function CarouselVertical() {
  return (
    <div className="w-full max-w-xs py-12">
      <Carousel orientation="vertical" aria-label="Vertical">
        <CarouselContent className="h-52">
          {slides.map((value) => (
            <CarouselItem key={value} className="basis-1/2">
              <div className="flex h-full items-center justify-center rounded-xl border bg-card p-6 text-3xl font-semibold">
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
