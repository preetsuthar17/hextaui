"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

export function ToastUpdate() {
  return (
    <Button
      variant="outline"
      onClick={() => {
        const id = toast.loading("Uploading 3 files…")
        setTimeout(() => toast.update(id, { title: "Uploading 2 of 3…" }), 900)
        setTimeout(
          () =>
            toast.update(id, {
              type: "success",
              title: "Upload complete",
              description: "3 files added to Photos.",
            }),
          1800
        )
      }}
    >
      Upload files
    </Button>
  )
}
