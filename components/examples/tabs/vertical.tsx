import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const sections = [
  { value: "general", label: "General", text: "Name, avatar and language." },
  { value: "security", label: "Security", text: "Password and two-factor." },
  { value: "billing", label: "Billing", text: "Plan, invoices and payment." },
]

export function TabsVertical() {
  return (
    <Tabs
      defaultValue="general"
      orientation="vertical"
      className="w-full max-w-md"
    >
      <TabsList variant="line">
        {sections.map((section) => (
          <TabsTrigger key={section.value} value={section.value}>
            {section.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {sections.map((section) => (
        <TabsContent key={section.value} value={section.value}>
          <div className="flex flex-col gap-1 py-2 text-sm">
            <p className="font-medium">{section.label}</p>
            <p className="text-muted-foreground">{section.text}</p>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
