import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

export function AvatarLayout() {
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex w-64 max-w-full items-center gap-2 rounded-lg border p-2 text-sm">
        <Avatar>
          <AvatarImage src="/preview/landscape.svg" alt="" />
          <AvatarFallback>AL</AvatarFallback>
        </Avatar>
        <span className="min-w-0 truncate">
          Supercalifragilisticexpialidocious-team-workspace-name
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Avatar className="size-20">
          <AvatarImage src="/preview/landscape.svg" alt="" />
          <AvatarFallback>KJ</AvatarFallback>
        </Avatar>
        <Avatar className="size-20" shape="square">
          <AvatarFallback>KJ</AvatarFallback>
          <AvatarBadge status="online" />
        </Avatar>
        <Avatar size="sm">
          <AvatarFallback>WWWWWWWW</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
