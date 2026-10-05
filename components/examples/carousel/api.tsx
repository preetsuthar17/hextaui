"use client"

import * as React from "react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

const slides = [1, 2, 3, 4, 5]

export function CarouselWithApi() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }
    const sync = () => {
      setCount(api.scrollSnapList().length)
      setCurrent(api.selectedScrollSnap() + 1)
    }
    sync()
    api.on("select", sync).on("reInit", sync)
    return () => {
      api.off("select", sync).off("reInit", sync)
    }
  }, [api])

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-2 px-12">
      <Carousel setApi={setApi} aria-label="Numbers" className="w-full">
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
      <p className="text-sm text-muted-foreground">
        Slide {current} of {count}
      </p>
    </div>
  )
}
