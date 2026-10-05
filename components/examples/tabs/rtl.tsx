import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TabsRtl() {
  return (
    <div dir="rtl" className="w-full max-w-sm">
      <Tabs defaultValue="account">
        <TabsList variant="line">
          <TabsTrigger value="account">الحساب</TabsTrigger>
          <TabsTrigger value="password">كلمة المرور</TabsTrigger>
          <TabsTrigger value="alerts">التنبيهات</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <p className="py-2 text-sm text-muted-foreground">إعدادات الحساب.</p>
        </TabsContent>
        <TabsContent value="password">
          <p className="py-2 text-sm text-muted-foreground">
            غيّر كلمة المرور.
          </p>
        </TabsContent>
        <TabsContent value="alerts">
          <p className="py-2 text-sm text-muted-foreground">إدارة التنبيهات.</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
