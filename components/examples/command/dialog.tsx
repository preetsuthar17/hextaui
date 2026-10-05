"use client"

import * as React from "react"
import {
  IconCalculator,
  IconCalendar,
  IconCheck,
  IconCreditCard,
  IconExternalLink,
  IconMoodSmile,
  IconPalette,
  IconPoint,
  IconSettings,
  IconUser,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPage,
  CommandSeparator,
  CommandShortcut,
  useCommandHotkey,
} from "@/components/ui/command"

export function CommandDialogDemo() {
  const [open, setOpen] = React.useState(false)
  const [last, setLast] = React.useState<string>()
  const [theme, setTheme] = React.useState("System")

  useCommandHotkey("mod+k", () => setOpen((value) => !value))

  const run = (action: string) => {
    setLast(action)
    setOpen(false)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open palette
        <CommandShortcut hotkey="mod+k" />
      </Button>
      <p className="text-sm text-muted-foreground">
        {last ? `Ran “${last}”.` : "Nothing run yet."} Theme: {theme}.
      </p>
      <CommandDialog open={open} onOpenChange={setOpen} preserveSearch>
        <Command highlight>
          <CommandInput placeholder="Type a command or search…" />
          <CommandList>
            <CommandEmpty>
              {(search) => `No results for “${search}”.`}
            </CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem
                shortcut="mod+shift+c"
                onSelect={() => run("Calendar")}
              >
                <IconCalendar />
                Calendar
              </CommandItem>
              <CommandItem onSelect={() => run("Search Emoji")}>
                <IconMoodSmile />
                Search Emoji
              </CommandItem>
              <CommandItem disabled>
                <IconCalculator />
                Calculator
              </CommandItem>
              <CommandItem page="theme" pageTitle="Theme">
                <IconPalette />
                Change theme…
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem shortcut="mod+p" onSelect={() => run("Profile")}>
                <IconUser />
                Profile
              </CommandItem>
              <CommandItem shortcut="mod+b" onSelect={() => run("Billing")}>
                <IconCreditCard />
                Billing
              </CommandItem>
              <CommandItem
                shortcut="mod+,"
                keywords={["preferences", "options"]}
                onSelect={() => run("Settings")}
              >
                <IconSettings />
                Settings
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Links">
              <CommandItem href="/docs" onSelect={() => setOpen(false)}>
                <IconExternalLink />
                All components
              </CommandItem>
            </CommandGroup>
            <CommandPage id="theme">
              <CommandGroup heading="Theme">
                {["Light", "Dark", "System"].map((option) => (
                  <CommandItem
                    key={option}
                    onSelect={() => {
                      setTheme(option)
                      run(`Theme: ${option}`)
                    }}
                  >
                    {option === theme ? <IconCheck /> : <IconPoint />}
                    {option}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandPage>
          </CommandList>
          <CommandFooter />
        </Command>
      </CommandDialog>
    </div>
  )
}
