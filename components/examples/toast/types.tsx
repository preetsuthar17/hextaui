"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

export function ToastTypes() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button variant="outline" size="sm" onClick={() => toast("Draft saved")}>
        Default
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => toast.success("Payment received")}
      >
        Success
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          toast.error("Couldn't upload photo", {
            description: "The file is larger than 10 MB.",
          })
        }
      >
        Error
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => toast.warning("Storage almost full")}
      >
        Warning
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => toast.info("A new version is available")}
      >
        Info
      </Button>
    </div>
  )
}
