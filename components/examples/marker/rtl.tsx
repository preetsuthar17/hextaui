import { IconUserPlus } from "@tabler/icons-react"

import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"

export function MarkerRtl() {
  return (
    <div dir="rtl" className="flex w-full max-w-md flex-col gap-4">
      <Marker variant="separator">
        <MarkerContent>اليوم</MarkerContent>
      </Marker>
      <Marker>
        <MarkerIcon>
          <IconUserPlus />
        </MarkerIcon>
        <MarkerContent>أضافت ميرا جون إلى المحادثة</MarkerContent>
      </Marker>
    </div>
  )
}
