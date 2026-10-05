import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function CarouselSeveralPerView() {
  return (
    <div className="w-full max-w-md px-12">
      <Carousel spacing="sm" aria-label="Several per view">
        <CarouselContent>
          {Array.from({ length: 9 }, (_, index) => (
            <CarouselItem key={index} className="basis-1/2 sm:basis-1/3">
              <div className="flex aspect-square items-center justify-center rounded-xl border bg-card p-6 text-3xl font-semibold">
                {index + 1}
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
