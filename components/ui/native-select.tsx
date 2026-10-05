"use client"

import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { IconSelector } from "@tabler/icons-react"
import { cn } from "cn"

import { useComposedRef } from "@/hooks/use-composed-ref"
import { useInvalidShake } from "@/hooks/use-invalid-shake"
import { inputVariants } from "@/components/ui/input"

type NativeSelectSize = "sm" | "default" | "lg"

type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & {
  size?: NativeSelectSize
  htmlSize?: number
  shake?: boolean
}

function NativeSelect({
  className,
  size = "default",
  htmlSize,
  shake = true,
  ref,
  ...props
}: NativeSelectProps) {
  const [selectRef, setRef] = useComposedRef<HTMLSelectElement>(ref)
  useInvalidShake(selectRef, shake)

  return (
    <div
      data-slot="native-select-wrapper"
      data-size={size}
      className={cn(
        "group/native-select relative w-fit min-w-0 has-[select:disabled]:opacity-50",
        className
      )}
    >
      <InputPrimitive
        data-slot="native-select"
        data-size={size}
        className={cn(
          inputVariants({ size }),
          "cursor-pointer appearance-none truncate pe-8 disabled:opacity-100 has-[option[value='']:checked]:text-muted-foreground dark:scheme-dark pointer-coarse:pe-9 [&_optgroup]:bg-[Canvas] [&_optgroup]:text-[CanvasText] [&_option]:bg-[Canvas] [&_option]:text-[CanvasText]"
        )}
        render={<select ref={setRef} size={htmlSize} />}
        {...(props as InputPrimitive.Props)}
      />
      <IconSelector
        aria-hidden="true"
        data-slot="native-select-icon"
        className="pointer-events-none absolute end-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors duration-150 group-has-[select:focus-visible]/native-select:text-foreground motion-reduce:transition-none pointer-coarse:end-3 [@media(hover:hover)]:group-hover/native-select:not-group-has-[select:disabled]/native-select:text-foreground"
      />
    </div>
  )
}

function NativeSelectOption({
  className,
  ...props
}: React.ComponentProps<"option">) {
  return (
    <option
      data-slot="native-select-option"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }
export type { NativeSelectProps, NativeSelectSize }
