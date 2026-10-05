import { IconDotsVertical } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function CardDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Team plan</CardTitle>
        <CardDescription>
          Billed monthly. Renews on October 28, 2026.
        </CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon-sm" aria-label="More options">
            <IconDotsVertical />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>
          12 of 20 seats used. Invite teammates or remove inactive members to
          free up seats.
        </p>
      </CardContent>
      <CardFooter>
        <Button>Manage seats</Button>
        <Button variant="outline">View invoices</Button>
      </CardFooter>
    </Card>
  )
}
