import {
  IconGitMerge,
  IconLock,
  IconPencil,
  IconTag,
} from "@tabler/icons-react"

import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"

export function MarkerEvents() {
  return (
    <ol className="flex w-full max-w-md flex-col gap-3">
      <Marker render={<li />}>
        <MarkerIcon>
          <IconTag />
        </MarkerIcon>
        <MarkerContent>
          Jun added the <a href="#">design</a> label
        </MarkerContent>
      </Marker>
      <Marker render={<li />}>
        <MarkerIcon>
          <IconPencil />
        </MarkerIcon>
        <MarkerContent>Mira renamed the pull request</MarkerContent>
      </Marker>
      <Marker render={<li />}>
        <MarkerIcon>
          <IconGitMerge className="text-success" />
        </MarkerIcon>
        <MarkerContent>Sol merged into main</MarkerContent>
      </Marker>
      <Marker render={<li />}>
        <MarkerIcon>
          <IconLock />
        </MarkerIcon>
        <MarkerContent>Conversation locked</MarkerContent>
      </Marker>
    </ol>
  )
}
