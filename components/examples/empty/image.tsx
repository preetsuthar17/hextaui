import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function EmptyImage() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <img
            src="/preview/landscape.svg"
            alt=""
            width={160}
            height={100}
            className="h-24 w-40 rounded-lg object-cover"
          />
        </EmptyMedia>
        <EmptyTitle>No photos in this album</EmptyTitle>
        <EmptyDescription>
          Drop photos here or add them from your library.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm">
          Add photos
        </Button>
      </EmptyContent>
    </Empty>
  )
}
