import {
  IconExternalLink,
  IconInfoCircle,
  IconTerminal2,
} from "@tabler/icons-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function AlertRichContent() {
  return (
    <Alert className="max-w-lg">
      <IconInfoCircle />
      <AlertTitle render={<h3 />}>Rendered as an h3</AlertTitle>
      <AlertDescription>
        <p>
          Press <IconTerminal2 className="inline size-4 align-text-bottom" /> to
          open the terminal, or read the <a href="#">docs</a>.
        </p>
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<a href="#" />}
        >
          Open guide <IconExternalLink />
        </Button>
      </AlertDescription>
    </Alert>
  )
}
