import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function DialogNoCloseButton() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        No close button
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>No close button</DialogTitle>
          <DialogDescription>
            Close it with Esc, by clicking outside, or by swiping down on a
            phone.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
