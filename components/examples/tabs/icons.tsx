import { IconCode, IconGitPullRequest, IconMessage } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TabsIcons() {
  return (
    <Tabs defaultValue="code">
      <TabsList variant="line">
        <TabsTrigger value="code">
          <IconCode />
          Code
        </TabsTrigger>
        <TabsTrigger value="pulls">
          <IconGitPullRequest />
          Pull requests
          <Badge>12</Badge>
        </TabsTrigger>
        <TabsTrigger value="discussions">
          <IconMessage />
          Discussions
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
