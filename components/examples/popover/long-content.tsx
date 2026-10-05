import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

export function PopoverLongContent() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          Unbroken text
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>
              Supercalifragilisticexpialidocious-project-archive-2026-final-v3
            </PopoverTitle>
            <PopoverDescription>
              https://example.com/a/really/long/url/without/any/spaces/at/all/in/it
              — مرحبا بالعالم — 日本語のテキスト 👩‍👩‍👧‍👦
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          Taller than the screen
        </PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Changelog</PopoverTitle>
          {Array.from({ length: 40 }, (_, index) => (
            <p key={index} className="text-sm text-muted-foreground">
              v1.{40 - index}.0 — fixes and improvements
            </p>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  )
}
