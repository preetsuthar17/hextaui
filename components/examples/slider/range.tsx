"use client"

import { Slider, SliderLabel, SliderValue } from "@/components/ui/slider"

export function SliderRange() {
  return (
    <Slider
      defaultValue={[200, 800]}
      max={1000}
      step={10}
      minStepsBetweenValues={10}
      draggableRange
      format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
      getAriaLabel={(index) =>
        index === 0 ? "Minimum price" : "Maximum price"
      }
      className="max-w-xs"
    >
      <SliderLabel>Price</SliderLabel>
      <SliderValue />
    </Slider>
  )
}
