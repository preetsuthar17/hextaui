"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  createAlertDialogHandle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

const removeMember = createAlertDialogHandle<{ name: string }>()

export function AlertDialogDetachedTriggers() {
  return (
    <div className="flex flex-wrap gap-2">
      {["Olivia", "Liam"].map((name) => (
        <AlertDialogTrigger
          key={name}
          handle={removeMember}
          payload={{ name }}
          render={<Button variant="outline" />}
        >
          Remove {name}
        </AlertDialogTrigger>
      ))}
      <AlertDialog handle={removeMember}>
        {({ payload }) => (
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Remove {payload?.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                They’ll lose access to this workspace.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive">
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
      </AlertDialog>
    </div>
  )
}
