"use client"

import { Button } from "@/components/ui/button"

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

const variants = [
  "default",
  "outline",
  "secondary",
  "ghost",
  "destructive",
  "link",
] as const

export function ButtonVariantsFeedback() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {variants.map((variant) => (
        <Button
          key={variant}
          feedback
          variant={variant}
          onClick={() => wait(900)}
        >
          {variant}
        </Button>
      ))}
    </div>
  )
}
