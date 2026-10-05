import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function CardSizes() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Default</CardTitle>
          <CardDescription>Spacing and radius scale together.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Deploys run on every push to main.</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline">Configure</Button>
        </CardFooter>
      </Card>
      <Card size="sm">
        <CardHeader>
          <CardTitle>Small</CardTitle>
          <CardDescription>Spacing and radius scale together.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Deploys run on every push to main.</p>
        </CardContent>
        <CardFooter>
          <Button size="sm" variant="outline">
            Configure
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
