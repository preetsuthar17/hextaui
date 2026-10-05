"use client"

import { IconDeviceFloppy } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

export function ButtonRtl() {
  return (
    <div dir="rtl" className="flex flex-wrap items-center justify-center gap-2">
      <Button
        feedback
        successLabel="تم الحفظ"
        errorLabel="فشل الحفظ"
        onClick={() => wait(900)}
      >
        <IconDeviceFloppy data-icon="inline-start" />
        حفظ
      </Button>
    </div>
  )
}
