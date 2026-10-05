"use client"

import * as React from "react"
import { IconAlertTriangle } from "@tabler/icons-react"

import {
  Alert,
  AlertClose,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export function AlertCancelDismiss() {
  const [confirmed, setConfirmed] = React.useState(false)

  return (
    <Alert variant="warning" className="max-w-lg">
      <IconAlertTriangle />
      <AlertTitle>Unsaved changes</AlertTitle>
      <AlertDescription>
        {confirmed
          ? "Click dismiss again to close."
          : "The first click is cancelled with event.preventDefault()."}
      </AlertDescription>
      <AlertClose
        onClick={(event) => {
          if (!confirmed) {
            event.preventDefault()
            setConfirmed(true)
          }
        }}
      />
    </Alert>
  )
}
