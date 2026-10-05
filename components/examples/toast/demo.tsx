"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

export function ToastDemo() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast("Event created", {
          description: "Sunday, December 3 at 9:00 AM",
          action: { label: "Undo", onClick: () => toast("Event removed") },
        })
      }
    >
      Show toast
    </Button>
  )
}
