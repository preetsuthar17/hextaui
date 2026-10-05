import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function CardMedia() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <Card>
        <img
          src="/preview/landscape.svg"
          alt="Mountain landscape"
          className="aspect-video w-full object-cover"
        />
        <CardHeader>
          <CardTitle>Media first</CardTitle>
          <CardDescription>
            The image runs edge to edge and inherits the card corners.
          </CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Media last</CardTitle>
          <CardDescription>Bottom padding drops for the image.</CardDescription>
        </CardHeader>
        <img
          src="/preview/landscape.svg"
          alt="Mountain landscape"
          className="aspect-video w-full object-cover"
        />
      </Card>
    </div>
  )
}
