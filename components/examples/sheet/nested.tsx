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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function SheetNested() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>
        Workspace settings
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Workspace settings</SheetTitle>
          <SheetDescription>
            Manage members and the danger zone.
          </SheetDescription>
        </SheetHeader>
        <SheetBody>
          <div className="flex flex-col items-start gap-2">
            <Sheet>
              <SheetTrigger render={<Button variant="outline" />}>
                Manage members
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Members</SheetTitle>
                  <SheetDescription>
                    The parent sheet steps back while this one is open.
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="destructive" />}>
                Delete workspace
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete workspace?</AlertDialogTitle>
                  <AlertDialogDescription>
                    All projects in this workspace will be removed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction variant="destructive">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </SheetBody>
      </SheetContent>
    </Sheet>
  )
}
