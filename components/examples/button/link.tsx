import { IconArrowUpRight } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"

export function ButtonLink() {
  return (
    <Button variant="outline" nativeButton={false} render={<a href="#" />}>
      Read the docs
      <IconArrowUpRight data-icon="inline-end" />
    </Button>
  )
}
