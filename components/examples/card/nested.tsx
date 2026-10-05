import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardLink,
  CardTitle,
} from "@/components/ui/card"

export function CardNested() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Usage</CardTitle>
        <CardDescription>This billing period.</CardDescription>
      </CardHeader>
      <CardContent>
        <Card variant="muted" size="sm">
          <CardHeader>
            <CardTitle>Build minutes</CardTitle>
            <CardDescription>1,240 of 3,000 used</CardDescription>
          </CardHeader>
        </Card>
        <Card variant="outline" size="sm">
          <CardHeader>
            <CardTitle>
              <CardLink href="#">Bandwidth</CardLink>
            </CardTitle>
            <CardDescription>84 GB of 100 GB used</CardDescription>
          </CardHeader>
        </Card>
      </CardContent>
    </Card>
  )
}
