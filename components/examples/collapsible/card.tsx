import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  CollapsibleTriggerIcon,
} from "@/components/ui/collapsible"

export function CollapsibleCard() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Choose where alerts are sent.</CardDescription>
      </CardHeader>
      <CardContent>
        <Collapsible className="flex flex-col gap-3">
          <CollapsibleTrigger
            render={<Button variant="outline" />}
            className="justify-between"
          >
            Advanced settings
            <CollapsibleTriggerIcon data-icon="inline-end" />
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col gap-2 text-sm text-muted-foreground">
            <p>Send a webhook to your endpoint for every alert.</p>
            <p>Retry failed deliveries up to five times with backoff.</p>
            <p>Group alerts that arrive within 30 seconds.</p>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
