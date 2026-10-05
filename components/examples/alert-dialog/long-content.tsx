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

const sections = Array.from({ length: 12 }, (_, index) => index + 1)

export function AlertDialogLongContent() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline" />}>
        Review terms
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Accept the updated terms?</AlertDialogTitle>
          <AlertDialogDescription render={<div />}>
            {sections.map((section) => (
              <p key={section}>
                Section {section}. We may update these terms from time to time.
                Continued use of the service after changes take effect means you
                accept the new terms. Read the <a href="#">full policy</a> for
                details.
              </p>
            ))}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Decline</AlertDialogCancel>
          <AlertDialogAction>Accept</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
