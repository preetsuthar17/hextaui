"use client"

import { useRouter } from "next/navigation"
import {
  IconAppWindow,
  IconBrightness,
  IconClick,
  IconCopy,
  IconDownload,
  IconNumbers,
} from "@tabler/icons-react"
import { useTheme } from "next-themes"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { toast } from "@/components/ui/toast"

const docs = [
  { slug: "installation", name: "Installation", icon: IconDownload },
  { slug: "button", name: "Button", icon: IconClick },
  { slug: "dialog", name: "Dialog", icon: IconAppWindow },
  { slug: "number-flow", name: "Number flow", icon: IconNumbers },
]

function CommandCard() {
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Command highlight label="Quick actions">
      <CommandInput placeholder="Search docs or run an action…" />
      <CommandList>
        <CommandEmpty>Nothing matches that.</CommandEmpty>
        <CommandGroup heading="Docs">
          {docs.map((item) => (
            <CommandItem
              key={item.slug}
              onSelect={() => router.push(`/docs/${item.slug}`)}
            >
              <item.icon />
              {item.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
            <IconBrightness />
            Toggle theme
            <CommandShortcut hotkey="d" />
          </CommandItem>
          <CommandItem
            onSelect={async () => {
              await navigator.clipboard.writeText(
                "pnpm dlx shadcn@latest add https://hextaui.com/r/button.json"
              )
              toast("Install command copied", {
                description: "Paste it in your terminal to add Button.",
              })
            }}
          >
            <IconCopy />
            Copy install command
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

export { CommandCard }
