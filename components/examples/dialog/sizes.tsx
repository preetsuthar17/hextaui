import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const sizes = [
  { size: "sm", label: "Small" },
  { size: "default", label: "Default" },
  { size: "lg", label: "Large" },
] as const

export function DialogSizes() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {sizes.map(({ size, label }) => (
        <Dialog key={size}>
          <DialogTrigger render={<Button variant="outline" />}>
            {label}
          </DialogTrigger>
          <DialogContent size={size}>
            <DialogHeader>
              <DialogTitle>{label} dialog</DialogTitle>
              <DialogDescription>
                On phones every size becomes a full-width bottom sheet.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button />}>Done</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  )
}
