"use client"

import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

import { useAutosize } from "@/hooks/use-autosize"
import { useComposedRef } from "@/hooks/use-composed-ref"
import { useInvalidShake } from "@/hooks/use-invalid-shake"
import { inputVariants } from "@/components/ui/input"

function clampRows(value: number | undefined, fallback: number) {
  const rows = Math.floor(Number(value))
  return Number.isFinite(rows) ? Math.min(100, Math.max(1, rows)) : fallback
}

type TextareaProps = Omit<React.ComponentProps<"textarea">, "rows"> & {
  autoResize?: boolean
  minRows?: number
  maxRows?: number
  submitOnShortcut?: boolean
  shake?: boolean
}

function Textarea({
  className,
  autoResize = true,
  minRows = 3,
  maxRows = 10,
  submitOnShortcut = false,
  shake = true,
  onKeyDown,
  ref,
  ...props
}: TextareaProps) {
  const [textareaRef, setRef] = useComposedRef<HTMLTextAreaElement>(ref)
  const min = clampRows(minRows, 3)
  const max = Math.max(min, clampRows(maxRows, 10))

  React.useLayoutEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) {
      return
    }
    textarea.style.setProperty("--textarea-min-rows", String(min))
    textarea.style.setProperty("--textarea-max-rows", String(max))
  }, [textareaRef, min, max])

  useAutosize(textareaRef, autoResize, props.value)
  useInvalidShake(textareaRef, shake)

  return (
    <InputPrimitive
      data-slot="textarea"
      data-autoresize={autoResize ? "" : undefined}
      render={<textarea ref={setRef} rows={min} />}
      className={cn(
        inputVariants({ size: null }),
        "block min-h-[calc(var(--textarea-min-rows,3)*1lh+1rem)] px-3 py-2 leading-5 wrap-break-word not-data-autoresize:resize-y data-autoresize:max-h-[calc(var(--textarea-max-rows,10)*1lh+1rem)] data-autoresize:resize-none data-autoresize:overflow-y-hidden",
        className
      )}
      onKeyDown={(event) => {
        const keyEvent =
          event as unknown as React.KeyboardEvent<HTMLTextAreaElement>
        onKeyDown?.(keyEvent)
        if (
          submitOnShortcut &&
          !keyEvent.defaultPrevented &&
          keyEvent.key === "Enter" &&
          (keyEvent.metaKey || keyEvent.ctrlKey) &&
          !keyEvent.nativeEvent.isComposing
        ) {
          const form = keyEvent.currentTarget.form
          if (form) {
            keyEvent.preventDefault()
            form.requestSubmit()
          }
        }
      }}
      {...(props as InputPrimitive.Props)}
    />
  )
}

export { Textarea }
export type { TextareaProps }
