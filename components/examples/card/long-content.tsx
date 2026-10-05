import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function CardLongContent() {
  return (
    <Card size="sm" className="w-72 max-w-full">
      <CardHeader>
        <CardTitle>
          Supercalifragilisticexpialidocious_unbroken_title_that_never_ends
        </CardTitle>
        <CardDescription>
          https://example.com/a/very/long/path/that/keeps/going/and/going?with=query
        </CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>👩‍👩‍👧‍👦 你好世界，这是一个很长的中文句子用于测试换行</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline">Cancel</Button>
        <Button>Continue</Button>
      </CardFooter>
    </Card>
  )
}
