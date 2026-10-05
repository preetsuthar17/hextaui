import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const sizes = ["xs", "sm", "default", "lg", "xl"] as const
const shapes = ["circle", "square"] as const

export function AvatarSizes() {
  return (
    <div className="flex flex-col gap-4">
      {shapes.map((shape) => (
        <div key={shape} className="flex flex-wrap items-center gap-3">
          {sizes.map((size) => (
            <Avatar key={`photo-${size}`} size={size} shape={shape}>
              <AvatarImage src="/preview/landscape.svg" alt="" />
              <AvatarFallback>AL</AvatarFallback>
            </Avatar>
          ))}
          {sizes.map((size) => (
            <Avatar key={`initials-${size}`} size={size} shape={shape}>
              <AvatarFallback>LT</AvatarFallback>
            </Avatar>
          ))}
          {sizes.map((size) => (
            <Avatar key={`empty-${size}`} size={size} shape={shape}>
              <AvatarFallback />
            </Avatar>
          ))}
        </div>
      ))}
    </div>
  )
}
