import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel"

const outerSlides = [1, 2, 3]
const innerSlides = [1, 2, 3, 4, 5]

export function CarouselNested() {
  return (
    <Carousel aria-label="Outer" className="w-full max-w-md">
      <CarouselContent>
        {outerSlides.map((outer) => (
          <CarouselItem key={outer}>
            <div className="flex flex-col gap-3 rounded-xl border bg-card p-4">
              <p className="text-sm font-medium">Outer slide {outer}</p>
              <Carousel spacing="sm" aria-label={`Inner ${outer}`}>
                <CarouselContent>
                  {innerSlides.map((inner) => (
                    <CarouselItem key={inner} className="basis-1/3">
                      <div className="flex aspect-square items-center justify-center rounded-lg bg-muted text-lg font-medium">
                        {outer}.{inner}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="mt-2 flex justify-center">
                  <CarouselDots />
                </div>
              </Carousel>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-3 flex justify-center">
        <CarouselDots />
      </div>
    </Carousel>
  )
}
