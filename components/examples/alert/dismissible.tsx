"use client"

import * as React from "react"
import { IconInfoCircle } from "@tabler/icons-react"

import {
  Alert,
  AlertClose,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function AlertDismissible() {
  const [key, setKey] = React.useState(0)

  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <Alert key={key} variant="info">
        <IconInfoCircle />
        <AlertTitle>We’ve updated our terms</AlertTitle>
        <AlertDescription>
          Read the <a href="#">new terms</a> before your next billing date.
        </AlertDescription>
        <AlertClose />
      </Alert>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => setKey(key + 1)}>
          Reset
        </Button>
        <Button variant="outline" size="sm">
          Next focusable
        </Button>
      </div>
    </div>
  )
}
