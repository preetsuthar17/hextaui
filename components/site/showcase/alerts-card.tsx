"use client"

import * as React from "react"
import { IconAlertTriangle, IconInfoCircle } from "@tabler/icons-react"

import {
  Alert,
  AlertClose,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function AlertsCard() {
  const [round, setRound] = React.useState(0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notices</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" onClick={() => setRound(round + 1)}>
            Reset
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div key={round} className="flex flex-col gap-3">
          <Alert variant="info">
            <IconInfoCircle />
            <AlertTitle>Your trial ends in 3 days</AlertTitle>
            <AlertDescription>
              Upgrade to keep your projects and history.
            </AlertDescription>
            <AlertClose />
          </Alert>
          <Alert variant="warning">
            <IconAlertTriangle />
            <AlertTitle>Usage at 92%</AlertTitle>
            <AlertDescription>
              Builds pause when you hit the limit.
            </AlertDescription>
            <AlertClose />
          </Alert>
        </div>
      </CardContent>
    </Card>
  )
}

export { AlertsCard }
