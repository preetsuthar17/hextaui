import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export function TabsOverflow() {
  return (
    <Tabs defaultValue="September" className="w-full max-w-sm">
      <TabsList variant="line">
        {months.map((month) => (
          <TabsTrigger key={month} value={month}>
            {month}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
