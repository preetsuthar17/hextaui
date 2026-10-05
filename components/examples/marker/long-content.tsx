import { IconAlertTriangle } from "@tabler/icons-react"

import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"

export function MarkerLongContent() {
  return (
    <div className="flex w-72 max-w-full flex-col gap-6">
      <Marker>
        <MarkerIcon>
          <IconAlertTriangle className="text-warning" />
        </MarkerIcon>
        <MarkerContent>
          Messages older than 90 days were archived to
          archive-2026-workspace-wide-retention-policy@example.com
        </MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerContent>
          A separator label that is long enough to wrap onto two lines
        </MarkerContent>
      </Marker>
    </div>
  )
}
