import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

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

export function ScrollAreaSheet() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>
        Open members
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Members</SheetTitle>
        </SheetHeader>
        <div className="min-h-0 flex-1 px-4 pb-4">
          <ScrollArea peek className="h-full">
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
        </div>
      </SheetContent>
    </Sheet>
  )
}
