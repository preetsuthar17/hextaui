import {
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleX,
  IconInfoCircle,
  IconTerminal2,
} from "@tabler/icons-react"

import {
  Alert,
  AlertAction,
  AlertClose,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

const alerts = [
  {
    variant: "default",
    icon: IconTerminal2,
    title: "Heads up",
    description: "You can add components to your app using the CLI.",
  },
  {
    variant: "destructive",
    icon: IconCircleX,
    title: "Payment failed",
    description: "Your card was declined. Update your billing details.",
  },
  {
    variant: "success",
    icon: IconCircleCheck,
    title: "Changes saved",
    description: "Your profile is now visible to your team.",
  },
  {
    variant: "info",
    icon: IconInfoCircle,
    title: "New version available",
    description: "Reload the page to get the latest features.",
  },
  {
    variant: "warning",
    icon: IconAlertTriangle,
    title: "Trial ends in 3 days",
    description: "Add a payment method to keep your workspace active.",
  },
] as const

export function AlertSoft() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      {alerts.map(({ variant, icon: Icon, title, description }) => (
        <Alert key={variant} variant={variant} appearance="soft">
          <Icon />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{description}</AlertDescription>
        </Alert>
      ))}
      <Alert variant="success" appearance="soft">
        <IconCircleCheck />
        <AlertTitle>Message archived</AlertTitle>
        <AlertAction>
          <Button variant="ghost" size="xs">
            Undo
          </Button>
        </AlertAction>
        <AlertClose />
      </Alert>
    </div>
  )
}
