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
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

export function DrawerConfirm() {
  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline" />}>
        Photo options
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>IMG_2048.heic</DrawerTitle>
          <DrawerDescription>Taken on October 3, 2026.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose render={<Button variant="outline" />}>Share</DrawerClose>
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="destructive" />}>
              Delete photo
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete “IMG_2048.heic”?</AlertDialogTitle>
                <AlertDialogDescription>
                  It will be removed from all your devices.
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
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
