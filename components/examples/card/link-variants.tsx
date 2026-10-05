import { IconArrowUpRight } from "@tabler/icons-react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardLink,
  CardTitle,
} from "@/components/ui/card"

export function CardLinkVariants() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      <Card size="sm">
        <CardHeader>
          <CardTitle>
            <CardLink href="#">
              Default <IconArrowUpRight className="inline size-4" />
            </CardLink>
          </CardTitle>
          <CardDescription>The shadow lifts on hover.</CardDescription>
        </CardHeader>
      </Card>
      <Card variant="outline" size="sm">
        <CardHeader>
          <CardTitle>
            <CardLink href="#">
              Outline <IconArrowUpRight className="inline size-4" />
            </CardLink>
          </CardTitle>
          <CardDescription>A soft fill on hover.</CardDescription>
        </CardHeader>
      </Card>
      <Card variant="muted" size="sm">
        <CardHeader>
          <CardTitle>
            <CardLink href="#">
              Muted <IconArrowUpRight className="inline size-4" />
            </CardLink>
          </CardTitle>
          <CardDescription>The fill deepens on hover.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
