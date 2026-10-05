import {
  IconCalculator,
  IconCalendar,
  IconCreditCard,
  IconMoodSmile,
  IconSettings,
  IconUser,
} from "@tabler/icons-react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

export function CommandDemo() {
  return (
    <Command highlight className="w-full max-w-sm">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <IconCalendar />
            Calendar
          </CommandItem>
          <CommandItem>
            <IconMoodSmile />
            Search Emoji
          </CommandItem>
          <CommandItem disabled>
            <IconCalculator />
            Calculator
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem shortcut="mod+p">
            <IconUser />
            Profile
          </CommandItem>
          <CommandItem shortcut="mod+b">
            <IconCreditCard />
            Billing
          </CommandItem>
          <CommandItem shortcut="mod+,">
            <IconSettings />
            Settings
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
