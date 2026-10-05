import { Badge, BadgeDot } from "@/components/ui/badge"

export function BadgeVariants() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Badge>
          <BadgeDot />
          Draft
        </Badge>
        <Badge variant="success">
          <BadgeDot />
          Paid
        </Badge>
        <Badge variant="info">
          <BadgeDot />
          Syncing
        </Badge>
        <Badge variant="warning">
          <BadgeDot />
          Pending
        </Badge>
        <Badge variant="destructive">
          <BadgeDot />
          Failed
        </Badge>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Badge appearance="solid">Draft</Badge>
        <Badge appearance="solid" variant="success">
          Paid
        </Badge>
        <Badge appearance="solid" variant="info">
          Syncing
        </Badge>
        <Badge appearance="solid" variant="warning">
          Pending
        </Badge>
        <Badge appearance="solid" variant="destructive">
          Failed
        </Badge>
      </div>
    </div>
  )
}
