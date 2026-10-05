import { IconInfoCircle, IconTerminal2 } from "@tabler/icons-react"

import {
  Alert,
  AlertAction,
  AlertClose,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function AlertActions() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <Alert variant="info">
        <IconInfoCircle />
        <AlertTitle>
          A new version of the dashboard is available with faster charts, saved
          filters and a redesigned sidebar
        </AlertTitle>
        <AlertDescription>
          Reloading keeps your current filters.
        </AlertDescription>
        <AlertAction>
          <Button size="xs">Reload</Button>
        </AlertAction>
      </Alert>
      <Alert>
        <IconTerminal2 />
        <AlertTitle>Message archived</AlertTitle>
        <AlertAction>
          <Button variant="secondary" size="xs">
            Undo
          </Button>
        </AlertAction>
        <AlertClose />
      </Alert>
    </div>
  )
}
