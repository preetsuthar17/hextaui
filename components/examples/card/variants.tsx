import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function CardVariants() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Default</CardTitle>
          <CardDescription>Hairline ring and a soft shadow.</CardDescription>
        </CardHeader>
      </Card>
      <Card variant="outline">
        <CardHeader>
          <CardTitle>Outline</CardTitle>
          <CardDescription>Ring only, no fill, no shadow.</CardDescription>
        </CardHeader>
      </Card>
      <Card variant="muted">
        <CardHeader>
          <CardTitle>Muted</CardTitle>
          <CardDescription>Filled surface for quiet sections.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
