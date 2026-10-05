import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const tabs = ["Activity", "Pull requests", "Issues", "Settings"]

export function TabsLine() {
  return (
    <Tabs defaultValue="Activity" className="w-full max-w-md">
      <TabsList variant="line">
        {tabs.map((tab) => (
          <TabsTrigger key={tab} value={tab}>
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab} value={tab}>
          <p className="py-2 text-sm text-muted-foreground">
            {tab} for this repository.
          </p>
        </TabsContent>
      ))}
    </Tabs>
  )
}
