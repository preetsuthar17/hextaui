import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel"

const articles = Array.from({ length: 6 }, (_, index) => index + 1)

export function CarouselLinks() {
  return (
    <Carousel spacing="sm" aria-label="Articles" className="w-full max-w-md">
      <CarouselContent>
        {articles.map((article) => (
          <CarouselItem key={article} className="basis-4/5 sm:basis-1/2">
            <a
              href="#"
              className="flex h-32 flex-col justify-end gap-1 rounded-xl border bg-card p-4 outline-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden"
            >
              <span className="text-sm font-medium">Article {article}</span>
              <span className="text-sm text-muted-foreground">
                Read the full story
              </span>
            </a>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-3 flex justify-center">
        <CarouselDots />
      </div>
    </Carousel>
  )
}
