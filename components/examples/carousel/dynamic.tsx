"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselCounter,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel"

export function CarouselDynamic() {
  const [slides, setSlides] = React.useState([1, 2, 3])

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setSlides([...slides, slides.length + 1])}
        >
          Add slide
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={slides.length === 0}
          onClick={() => setSlides(slides.slice(0, -1))}
        >
          Remove slide
        </Button>
      </div>
      <Carousel aria-label="Dynamic">
        <CarouselContent>
          {slides.map((value) => (
            <CarouselItem key={value} className="basis-1/2">
              <div className="flex aspect-square items-center justify-center rounded-xl border bg-card p-6 text-4xl font-semibold">
                {value}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="mt-3 flex items-center justify-between">
          <CarouselCounter />
          <CarouselDots />
        </div>
      </Carousel>
    </div>
  )
}
