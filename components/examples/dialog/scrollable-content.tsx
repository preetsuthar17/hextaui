import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function DialogScrollableContent() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Release notes
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>What’s new</DialogTitle>
          <DialogDescription>Version 2.4.0</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            {Array.from({ length: 24 }, (_, index) => (
              <p key={index}>
                {index + 1}. Improved performance of the dashboard charts and
                fixed an issue where filters reset after navigation.
              </p>
            ))}
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}
