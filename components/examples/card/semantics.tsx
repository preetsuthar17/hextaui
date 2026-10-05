import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function CardSemantics() {
  return (
    <Card render={<article />} className="w-full max-w-sm">
      <CardHeader render={<header />}>
        <CardTitle render={<h3 />}>Rendered as an article</CardTitle>
        <CardDescription render={<p />}>
          Every part accepts render for real semantics.
        </CardDescription>
      </CardHeader>
      <CardFooter render={<footer />}>
        <Button variant="outline">Read more</Button>
      </CardFooter>
    </Card>
  )
}
