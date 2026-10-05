import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TabsDisabled() {
  return (
    <Tabs defaultValue="day">
      <TabsList>
        <TabsTrigger value="day">Day</TabsTrigger>
        <TabsTrigger value="week">Week</TabsTrigger>
        <TabsTrigger value="month" disabled>
          Month
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
