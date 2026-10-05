"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

export function ToastDedupe() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast.info("You're offline", {
          id: "offline",
          description: "Changes will sync when you reconnect.",
        })
      }
    >
      Go offline (click twice)
    </Button>
  )
}
