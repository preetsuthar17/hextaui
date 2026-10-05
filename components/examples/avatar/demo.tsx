import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar"

export function AvatarDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      <Avatar size="xl">
        <AvatarImage src="/preview/landscape.svg" alt="" />
        <AvatarFallback>AL</AvatarFallback>
        <AvatarBadge status="online" />
      </Avatar>
      <Avatar size="xl" shape="square">
        <AvatarFallback>GH</AvatarFallback>
      </Avatar>
      <AvatarGroup size="lg" max={4}>
        <Avatar>
          <AvatarImage src="/preview/landscape.svg" alt="" />
          <AvatarFallback>AL</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>AT</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>GH</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>KJ</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>LT</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    </div>
  )
}
