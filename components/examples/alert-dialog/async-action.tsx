"use client"

import * as React from "react"
import { IconTrash } from "@tabler/icons-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function AlertDialogAsyncAction() {
  const [shouldFail, setShouldFail] = React.useState(false)
  const [attempts, setAttempts] = React.useState(0)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <AlertDialog onOpenChange={(open) => open && setAttempts(0)}>
        <AlertDialogTrigger render={<Button variant="destructive" />}>
          Delete project
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia variant="destructive">
              <IconTrash />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete “Acme website”?</AlertDialogTitle>
            <AlertDialogDescription>
              {attempts > 0
                ? `Deleting failed ${attempts} time${attempts > 1 ? "s" : ""}. Try again.`
                : "All deployments, domains and environment variables will be removed. This can’t be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={async () => {
                await wait(1500)
                if (shouldFail) {
                  setAttempts((count) => count + 1)
                  throw new Error("Request failed")
                }
              }}
            >
              Delete project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Button
        variant="ghost"
        size="sm"
        aria-pressed={shouldFail}
        onClick={() => setShouldFail(!shouldFail)}
      >
        Request will {shouldFail ? "fail" : "succeed"}
      </Button>
    </div>
  )
}
