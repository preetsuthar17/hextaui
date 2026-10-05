"use client"

import * as React from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function AlertDialogControlled() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button
        variant="outline"
        onClick={() => window.setTimeout(() => setOpen(true), 600)}
      >
        Open in 600ms
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Session expiring</AlertDialogTitle>
            <AlertDialogDescription>
              You’ve been inactive for a while. Stay signed in?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Sign out</AlertDialogCancel>
            <AlertDialogAction>Stay signed in</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
