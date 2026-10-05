import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function DialogCustomCloseButton() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>Share</DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <Field>
            <FieldLabel>Link</FieldLabel>
            <Input
              defaultValue="https://hextaui.com/docs/installation"
              readOnly
            />
          </Field>
        </DialogBody>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  )
}
