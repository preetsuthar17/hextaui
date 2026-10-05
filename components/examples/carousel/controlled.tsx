"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel"

const slides = [1, 2, 3, 4, 5]

export function CarouselControlled() {
  const [index, setIndex] = React.useState(2)

  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {slides.map((value, position) => (
          <Button
            key={value}
            size="sm"
            variant={position === index ? "secondary" : "outline"}
            onClick={() => setIndex(position)}
          >
            {value}
          </Button>
        ))}
        <span className="text-sm text-muted-foreground">index = {index}</span>
      </div>
      <Carousel index={index} onIndexChange={setIndex} aria-label="Controlled">
        <CarouselContent>
          {slides.map((value) => (
            <CarouselItem key={value}>
              <div className="flex aspect-square items-center justify-center rounded-xl border bg-card p-6 text-4xl font-semibold">
                {value}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="mt-3 flex justify-center">
          <CarouselDots />
        </div>
      </Carousel>
    </div>
  )
}
