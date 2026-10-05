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

export function ScrollAreaColoredSurface() {
  return (
    <div className="w-full max-w-sm rounded-xl bg-muted p-2">
      <ScrollArea className="h-56">
        <ul className="flex flex-col gap-1 p-2">
          {people.map((person) => (
            <li
              key={person.id}
              className="flex items-center justify-between gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-background"
            >
              <span className="truncate font-medium">
                {person.id}. {person.name}
              </span>
              <span className="text-muted-foreground">{person.role}</span>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  )
}
