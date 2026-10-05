import {
  Carousel,
  CarouselContent,
  CarouselCounter,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const slides = [1, 2, 3, 4, 5]

export function CarouselRtl() {
  return (
    <div dir="rtl" className="w-full max-w-md px-12">
      <Carousel autoplay={{ delay: 4000 }} aria-label="شرائح">
        <CarouselContent>
          {slides.map((value) => (
            <CarouselItem key={value} className="basis-1/2">
              <div className="flex aspect-square items-center justify-center rounded-xl border bg-card p-6 text-4xl font-semibold">
                {value}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <div className="mt-3 flex items-center justify-between">
          <CarouselCounter />
          <CarouselDots />
        </div>
      </Carousel>
    </div>
  )
}
