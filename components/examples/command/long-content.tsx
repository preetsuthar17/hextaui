import { IconFileText } from "@tabler/icons-react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"

export function CommandLongContent() {
  return (
    <Command className="w-full max-w-72">
      <CommandInput placeholder="Search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="A group heading that is long enough to wrap onto two lines">
          <CommandItem>
            <IconFileText />
            <span className="min-w-0 truncate">
              quarterly-planning-final-final-v2-reviewed-by-legal.pdf
            </span>
            <CommandShortcut>⌘⇧O</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <IconFileText />
            <span className="min-w-0 wrap-anywhere">
              averyveryverylongunbrokenfilenamethatshouldwrapinsteadofescaping.txt
            </span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
