"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cn } from "cn"

import { BubbleAlignContext } from "@/components/ui/bubble"

type MessageAlign = "start" | "end"

const MessageGroupContext = React.createContext<{ ready: boolean } | null>(null)

function dataAttributes(slot: string, extra?: Record<string, string>) {
  return { "data-slot": slot, ...extra } as Record<string, string>
}

function MessageGroup({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    setReady(true)
  }, [])

  const context = React.useMemo(() => ({ ready }), [ready])

  const element = useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      { className: cn("flex min-w-0 flex-col gap-4", className) },
      props,
      dataAttributes("message-group")
    ),
  })

  return (
    <MessageGroupContext.Provider value={context}>
      {element}
    </MessageGroupContext.Provider>
  )
}

type MessageProps = useRender.ComponentProps<"div"> & {
  align?: MessageAlign
  animated?: boolean
}

function Message({
  className,
  align = "start",
  animated = true,
  render,
  children,
  ...props
}: MessageProps) {
  const group = React.useContext(MessageGroupContext)
  const [entering] = React.useState(() => Boolean(animated && group?.ready))

  const element = useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      {
        className: cn(
          "group/message relative flex w-full min-w-0 items-end gap-2 text-sm data-entering:origin-bottom-left data-[align=end]:flex-row-reverse data-[align=end]:data-entering:origin-bottom-right data-entering:motion-safe:animate-message-in motion-reduce:data-entering:animate-in motion-reduce:data-entering:fade-in-0 rtl:data-entering:origin-bottom-right rtl:data-[align=end]:data-entering:origin-bottom-left",
          className
        ),
        children: (
          <BubbleAlignContext.Provider value={align}>
            {children}
          </BubbleAlignContext.Provider>
        ),
      },
      props,
      dataAttributes("message", {
        "data-align": align,
        ...(entering ? { "data-entering": "" } : {}),
      })
    ),
  })

  return element
}

function MessageAvatar({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      {
        className: cn(
          "flex w-fit min-w-8 shrink-0 items-center justify-center self-end overflow-hidden rounded-full group-has-[[data-slot=message-footer]]/message:mb-[calc(var(--spacing)*4+var(--spacing)*1.5)] [&>img]:size-8 [&>img]:object-cover [&>svg]:size-8 [&>svg]:rounded-full [&>svg]:bg-muted [&>svg]:p-2 [&>svg]:text-foreground",
          className
        ),
      },
      props,
      dataAttributes("message-avatar")
    ),
  })
}

function MessageContent({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      {
        className: cn(
          "flex w-full min-w-0 flex-col gap-1.5 wrap-break-word",
          className
        ),
      },
      props,
      dataAttributes("message-content")
    ),
  })
}

const metaClassName =
  "flex max-w-full min-w-0 items-center gap-1.5 px-3 text-xs font-medium text-muted-foreground group-has-[[data-variant=ghost]]/message:px-0 group-data-[align=start]/message:group-has-[[data-shape=tail]]/message:ps-[calc(var(--spacing)*4.5)] group-data-[align=end]/message:group-has-[[data-shape=tail]]/message:pe-[calc(var(--spacing)*4.5)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5"

function MessageHeader({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      {
        className: cn(
          metaClassName,
          "min-h-4 group-data-[align=end]/message:justify-end",
          className
        ),
      },
      props,
      dataAttributes("message-header")
    ),
  })
}

function MessageFooter({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      {
        className: cn(
          metaClassName,
          "h-4 overflow-hidden whitespace-nowrap group-data-[align=end]/message:justify-end",
          className
        ),
      },
      props,
      dataAttributes("message-footer")
    ),
  })
}

export {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
}
export type { MessageAlign, MessageProps }
