import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function DialogStickyFooter() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Terms of service
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Terms of service</DialogTitle>
          <DialogDescription>Last updated October 2026.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            {Array.from({ length: 20 }, (_, index) => (
              <p key={index}>
                {index + 1}. By using the service you agree to keep your account
                secure and to use it in line with these terms and any laws that
                apply to you.
              </p>
            ))}
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Decline
          </DialogClose>
          <DialogClose render={<Button />}>Accept</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
