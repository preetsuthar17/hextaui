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

function PeopleList() {
  return (
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
  )
}

export function ScrollAreaPeek() {
  return (
    <div className="grid w-full max-w-xl grid-cols-2 gap-4">
      <ScrollArea className="h-80 rounded-lg border">
        <PeopleList />
      </ScrollArea>
      <ScrollArea peek className="h-80 rounded-lg border">
        <PeopleList />
      </ScrollArea>
    </div>
  )
}
