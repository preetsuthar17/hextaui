import { IconCircleX, IconTerminal2 } from "@tabler/icons-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function AlertDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <Alert>
        <IconTerminal2 />
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>
          You can add components to your app using the CLI.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <IconCircleX />
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>
          Your card was declined. Update your billing details.
        </AlertDescription>
      </Alert>
    </div>
  )
}
