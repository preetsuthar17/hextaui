import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Input } from "@/components/ui/input"

export function InputWithButton() {
  return (
    <form className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex gap-2">
        <Input type="email" aria-label="Email" placeholder="you@example.com" />
        <Button type="submit">Subscribe</Button>
      </div>
      <ButtonGroup className="w-full">
        <Input type="search" aria-label="Search" placeholder="Search…" />
        <Button variant="outline">Search</Button>
      </ButtonGroup>
    </form>
  )
}
