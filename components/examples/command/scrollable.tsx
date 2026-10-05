import { IconFileText } from "@tabler/icons-react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

const documents = Array.from({ length: 60 }, (_, index) => ({
  id: index + 1,
  title: `Document ${String(index + 1).padStart(2, "0")}`,
}))

export function CommandScrollable() {
  return (
    <Command className="w-full max-w-sm">
      <CommandInput placeholder="Search 60 documents…" />
      <CommandList>
        <CommandEmpty>No documents match.</CommandEmpty>
        <CommandGroup heading="Documents">
          {documents.map((doc) => (
            <CommandItem key={doc.id}>
              <IconFileText />
              {doc.title}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
