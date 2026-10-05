import { ScrollArea } from "@/components/ui/scroll-area"

const names = [
  "Olivia Martin",
  "Jackson Lee",
  "Isabella Nguyen",
  "William Kim",
  "Sofia Davis",
  "Liam Patel",
  "Emma Garcia",
  "Noah Wilson",
]
const roles = ["Design", "Engineering", "Product", "Support"]

const people = Array.from({ length: 40 }, (_, index) => ({
  id: index + 1,
  name: names[index % names.length],
  role: roles[index % roles.length],
}))

export function ScrollAreaDemo() {
  return (
    <ScrollArea peek className="h-80 w-full max-w-sm rounded-lg border">
      <ul className="flex flex-col gap-1 p-2">
        {people.map((person) => (
          <li
            key={person.id}
            className="flex items-center justify-between gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-muted"
          >
            <span className="truncate font-medium">
              {person.id}. {person.name}
            </span>
            <span className="text-muted-foreground">{person.role}</span>
          </li>
        ))}
      </ul>
    </ScrollArea>
  )
}
