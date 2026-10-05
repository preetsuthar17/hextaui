import { IconCircleCheck, IconInfoCircle } from "@tabler/icons-react"

import {
  Alert,
  AlertClose,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export function AlertPartialContent() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <Alert variant="success">
        <IconCircleCheck />
        <AlertTitle>Invite sent</AlertTitle>
        <AlertClose />
      </Alert>
      <Alert>
        <IconInfoCircle />
        <AlertDescription>
          Sessions expire after 30 days of inactivity.
        </AlertDescription>
      </Alert>
      <Alert>
        <AlertTitle>No icon</AlertTitle>
        <AlertDescription>The content starts at the padding.</AlertDescription>
      </Alert>
    </div>
  )
}
