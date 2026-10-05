import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselThumbnail,
  CarouselThumbnails,
} from "@/components/ui/carousel"

const photos = Array.from({ length: 10 }, (_, index) => index + 1)

export function CarouselWithThumbnails() {
  return (
    <Carousel aria-label="Gallery" className="w-full max-w-md">
      <CarouselContent>
        {photos.map((photo) => (
          <CarouselItem key={photo}>
            <div className="relative overflow-hidden rounded-xl border">
              <img
                src="/preview/landscape.svg"
                alt={`Landscape ${photo}`}
                draggable={false}
                className="aspect-video w-full object-cover"
              />
              <span className="absolute start-3 top-3 rounded-md bg-background px-2 py-1 text-xs font-medium">
                {photo}
              </span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-3">
        <CarouselThumbnails>
          {photos.map((photo) => (
            <CarouselThumbnail key={photo} className="w-20">
              <img
                src="/preview/landscape.svg"
                alt=""
                draggable={false}
                className="aspect-video w-full object-cover"
              />
            </CarouselThumbnail>
          ))}
        </CarouselThumbnails>
      </div>
    </Carousel>
  )
}
