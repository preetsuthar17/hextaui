import { IconArrowRight, IconGitBranch } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"

export function ButtonWithIcon() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button variant="outline">
        <IconGitBranch data-icon="inline-start" />
        New branch
      </Button>
      <Button>
        Continue
        <IconArrowRight data-icon="inline-end" />
      </Button>
    </div>
  )
}
