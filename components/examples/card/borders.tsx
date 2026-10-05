import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function CardBorders() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="border-b">
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Choose what you hear about.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Mentions, replies and deploy failures are on.</p>
      </CardContent>
      <CardFooter className="border-t">
        <Button variant="outline">Reset</Button>
        <Button className="ms-auto">Save</Button>
      </CardFooter>
    </Card>
  )
}
