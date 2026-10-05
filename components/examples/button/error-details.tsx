"use client"

import { Button } from "@/components/ui/button"

export function ButtonErrorDetails() {
  return (
    <Button
      feedback
      variant="outline"
      errorLabel={(error) =>
        error instanceof Error ? error.message : "Failed"
      }
      onClick={async () => {
        await new Promise((resolve) => setTimeout(resolve, 700))
        throw new Error("Card declined")
      }}
    >
      Pay $24
    </Button>
  )
}
