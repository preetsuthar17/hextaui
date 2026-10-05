import { IconMoodSad } from "@tabler/icons-react"

import { AspectRatio } from "@/components/ui/aspect-ratio"

export function AspectRatioBrokenImage() {
  return (
    <div className="grid w-full max-w-md grid-cols-2 gap-3">
      <AspectRatio ratio={4 / 3} className="rounded-lg">
        <img src="/preview/does-not-exist.jpg" alt="Team photo" />
      </AspectRatio>
      <AspectRatio
        ratio={4 / 3}
        className="rounded-lg"
        fallback={
          <span className="flex flex-col items-center gap-1 text-xs">
            <IconMoodSad />
            Couldn’t load
          </span>
        }
      >
        <img src="/preview/does-not-exist.jpg" alt="Team photo" />
      </AspectRatio>
    </div>
  )
}
