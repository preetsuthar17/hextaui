"use client"

import * as React from "react"
import { IconCircleCheck } from "@tabler/icons-react"

import {
  Alert,
  AlertClose,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function AlertControlled() {
  const [open, setOpen] = React.useState(true)

  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <Button
        variant="outline"
        size="sm"
        className="self-start"
        onClick={() => setOpen(!open)}
      >
        {open ? "Hide" : "Show"} alert
      </Button>
      <Alert variant="success" open={open} onOpenChange={setOpen}>
        <IconCircleCheck />
        <AlertTitle>Deployment complete</AlertTitle>
        <AlertDescription>
          Your changes are live on production.
        </AlertDescription>
        <AlertClose />
      </Alert>
      <p className="text-sm text-muted-foreground">Content below slides up.</p>
    </div>
  )
}
