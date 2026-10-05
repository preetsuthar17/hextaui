import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TabsDemo() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="rounded-xl border p-4 text-sm">
          <p className="font-medium">Overview</p>
          <p className="text-muted-foreground">
            Visitors are up 12% this week, mostly from search.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="analytics">
        <div className="rounded-xl border p-4 text-sm">
          <p className="font-medium">Analytics</p>
          <p className="text-muted-foreground">
            Average session length is 4m 12s across 18,240 visits.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="reports">
        <div className="rounded-xl border p-4 text-sm">
          <p className="font-medium">Reports</p>
          <p className="text-muted-foreground">
            Three scheduled reports go out on Monday.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  )
}
