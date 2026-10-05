import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const categories = [
  "All",
  "Design",
  "Engineering",
  "Marketing",
  "Sales",
  "Support",
  "Finance",
  "Legal",
  "Operations",
]

export function TabsOverflowSegmented() {
  return (
    <Tabs defaultValue="Finance" className="w-full max-w-xs">
      <TabsList>
        {categories.map((category) => (
          <TabsTrigger key={category} value={category}>
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
