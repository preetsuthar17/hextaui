"use client"

import * as React from "react"
import type { VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { TrackedLink } from "@/components/site/tracked-link"
import { buttonVariants } from "@/components/ui/button"

function TrackedButtonLink({
  variant,
  size,
  className,
  ...props
}: React.ComponentProps<typeof TrackedLink> &
  VariantProps<typeof buttonVariants>) {
  return (
    <TrackedLink
      {...props}
      className={cn(buttonVariants({ variant, size }), className)}
    />
  )
}

export { TrackedButtonLink }
