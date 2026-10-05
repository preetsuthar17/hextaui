import { IconInfoCircle } from "@tabler/icons-react"

import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"

export function MarkerVariants() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Marker>
        <MarkerIcon>
          <IconInfoCircle />
        </MarkerIcon>
        <MarkerContent>Default: an icon and a short note.</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerContent>Separator</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerContent>Border: a heading for the section below</MarkerContent>
      </Marker>
    </div>
  )
}
