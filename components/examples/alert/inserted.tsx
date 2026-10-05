"use client"

import * as React from "react"
import { IconCircleX } from "@tabler/icons-react"

import {
  Alert,
  AlertClose,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function AlertInserted() {
  const [errors, setErrors] = React.useState<number[]>([])

  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <Button
        variant="outline"
        size="sm"
        className="self-start"
        onClick={() => setErrors([...errors, Date.now()])}
      >
        Submit form
      </Button>
      {errors.map((id) => (
        <Alert
          key={id}
          variant="destructive"
          onOpenChange={() =>
            setErrors((current) => current.filter((error) => error !== id))
          }
        >
          <IconCircleX />
          <AlertTitle>Email is already in use</AlertTitle>
          <AlertDescription>Try signing in instead.</AlertDescription>
          <AlertClose />
        </Alert>
      ))}
    </div>
  )
}
