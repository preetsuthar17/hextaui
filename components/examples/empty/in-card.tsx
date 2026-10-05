import { IconChartBar } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function EmptyInCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
        <CardDescription>Last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <Empty variant="muted" size="sm">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconChartBar />
            </EmptyMedia>
            <EmptyTitle>No data yet</EmptyTitle>
            <EmptyDescription>
              Charts appear after your first sale.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" size="sm">
              Connect a store
            </Button>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  )
}
