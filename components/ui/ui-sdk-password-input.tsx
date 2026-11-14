"use client"

import * as React from "react"
import { IconArrowBigUpLine, IconEye, IconEyeOff } from "@tabler/icons-react"
import * as PasswordInputPrimitive from "@ui-sdk/react/password-input"
import { cn } from "cn"

type ClassName<State> =
  string | ((state: State) => string | undefined) | undefined

function mergeClassName<State>(base: string, className: ClassName<State>) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

type PasswordInputState = PasswordInputPrimitive.PasswordInputState
type PasswordStrength = 0 | 1 | 2 | 3 | 4

type PasswordInputContextValue = {
  value: string
  invalid: boolean
  state: PasswordInputState | null
}

const PasswordInputContext = React.createContext<PasswordInputContextValue>({
  value: "",
  invalid: false,
  state: null,
})

type PasswordInputProps = React.ComponentProps<
  typeof PasswordInputPrimitive.PasswordInput
> & {
  invalid?: boolean
}

function PasswordInput({
  className,
  children,
  invalid = false,
  value,
  defaultValue,
  onValueChange,
  ...props
}: PasswordInputProps) {
  const [tracked, setTracked] = React.useState(defaultValue ?? "")
  const current = value ?? tracked

  return (
    <PasswordInputPrimitive.PasswordInput
      data-invalid={invalid ? "" : undefined}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next, details) => {
        setTracked(next)
        onValueChange?.(next, details)
      }}
      className={mergeClassName(
        "group/password-input flex w-full min-w-0 flex-col",
        className
      )}
      {...props}
    >
      {(state) => (
        <PasswordInputContext.Provider
          value={{ value: current, invalid, state }}
        >
          {typeof children === "function" ? children(state) : children}
        </PasswordInputContext.Provider>
      )}
    </PasswordInputPrimitive.PasswordInput>
  )
}

function PasswordInputGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="password-input-group"
      className={cn(
        "flex h-9 w-full min-w-0 items-center gap-1 rounded-md bg-transparent pe-1 text-sm text-foreground inset-ring-(length:--hairline) inset-ring-input transition-[background-color,box-shadow] duration-150 ease-out-cubic group-data-disabled/password-input:cursor-not-allowed group-data-disabled/password-input:opacity-50 group-data-invalid/password-input:inset-ring-destructive group-data-readonly/password-input:bg-muted/40 has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-focus-ring has-[input:focus-visible]:inset-ring-ring has-[input:user-invalid]:inset-ring-destructive group-data-invalid/password-input:has-[input:focus-visible]:ring-destructive/20 group-data-invalid/password-input:has-[input:focus-visible]:inset-ring-destructive motion-reduce:transition-none dark:bg-input/30 dark:group-data-readonly/password-input:bg-input/20 forced-colors:border pointer-coarse:h-10 [@media(hover:hover)]:hover:not-has-[input:focus-visible]:not-group-data-disabled/password-input:not-group-data-invalid/password-input:inset-ring-ring/70",
        className
      )}
      {...props}
    />
  )
}

function PasswordInputControl({
  className,
  ...props
}: React.ComponentProps<typeof PasswordInputPrimitive.PasswordInputControl>) {
  const { invalid } = React.useContext(PasswordInputContext)
  return (
    <PasswordInputPrimitive.PasswordInputControl
      aria-invalid={invalid || undefined}
      className={mergeClassName(
        "h-full w-full min-w-0 flex-1 bg-transparent ps-3 outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed not-data-visible:not-placeholder-shown:tracking-wider pointer-coarse:text-touch [&::-ms-reveal]:hidden",
        className
      )}
      {...props}
    />
  )
}

function PasswordInputToggle({
  className,
  children,
  "aria-label": ariaLabel = "Show password",
  ...props
}: React.ComponentProps<typeof PasswordInputPrimitive.PasswordInputToggle>) {
  return (
    <PasswordInputPrimitive.PasswordInputToggle
      aria-label={ariaLabel}
      className={mergeClassName(
        "group/password-input-toggle relative inline-flex size-7 shrink-0 items-center justify-center rounded-[calc(var(--radius-md)-var(--spacing))] text-muted-foreground transition-[color,background-color,box-shadow] duration-150 ease-out-quint outline-none after:absolute after:-inset-1 hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-focus-ring disabled:pointer-events-none data-visible:text-foreground pointer-coarse:after:-inset-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {children ?? (
        <span aria-hidden="true" className="relative size-4">
          <IconEye className="absolute inset-0 transition-[opacity,scale] duration-200 ease-out-quint group-data-visible/password-input-toggle:scale-75 group-data-visible/password-input-toggle:opacity-0 motion-reduce:transition-none" />
          <IconEyeOff className="absolute inset-0 scale-75 opacity-0 transition-[opacity,scale] duration-200 ease-out-quint group-data-visible/password-input-toggle:scale-100 group-data-visible/password-input-toggle:opacity-100 motion-reduce:transition-none" />
        </span>
      )}
    </PasswordInputPrimitive.PasswordInputToggle>
  )
}

function PasswordInputCapsLock({
  className,
  children = "Caps Lock is on",
  ...props
}: React.ComponentProps<"div">) {
  const { state } = React.useContext(PasswordInputContext)
  const active = !!state?.capsLock

  return (
    <div
      data-slot="password-input-capslock"
      data-active={active ? "" : undefined}
      className={cn(
        "grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-200 ease-out-quint data-active:grid-rows-[1fr] data-active:opacity-100 motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      <div className="min-h-0 overflow-hidden">
        <p
          aria-hidden="true"
          className="m-0 flex items-center gap-1.5 pt-1.5 text-xs text-muted-foreground"
        >
          <IconArrowBigUpLine className="size-3.5 shrink-0 text-warning" />
          {children}
        </p>
      </div>
      <span role="status" className="sr-only">
        {active ? children : null}
      </span>
    </div>
  )
}

const commonPasswords =
  /^(password|passw0rd|qwerty|letmein|welcome|admin|iloveyou|monkey|dragon|abc123|111111|123123|123456|1234567|12345678|123456789)/i

function scorePassword(password: string): PasswordStrength {
  if (!password) return 0
  let pool = 0
  if (/[a-z]/.test(password)) pool += 26
  if (/[A-Z]/.test(password)) pool += 26
  if (/\d/.test(password)) pool += 10
  if (/[^a-zA-Z\d]/.test(password)) pool += 33
  const characters = [...password]
  const unique = new Set(characters).size
  let runs = 0
  for (let index = 1; index < characters.length; index++) {
    const step =
      (characters[index].codePointAt(0) ?? 0) -
      (characters[index - 1].codePointAt(0) ?? 0)
    if (step === 1 || step === -1 || step === 0) runs++
  }
  const effective = Math.max(
    1,
    Math.min(characters.length, unique * 2) - runs * 0.5
  )
  const bits = effective * Math.log2(Math.max(pool, 10))
  if (commonPasswords.test(password) || characters.length < 8) {
    return bits < 28 ? 1 : 2
  }
  if (bits < 36) return 1
  if (bits < 50) return 2
  if (bits < 70) return 3
  return 4
}

const defaultStrengthLabels = ["", "Weak", "Fair", "Good", "Strong"] as const

type PasswordInputStrengthProps = Omit<
  React.ComponentProps<"div">,
  "children"
> & {
  getStrength?: (password: string) => PasswordStrength
  labels?: readonly [string, string, string, string, string]
  label?: string
}

function PasswordInputStrength({
  className,
  getStrength = scorePassword,
  labels = defaultStrengthLabels,
  label = "Password strength",
  ...props
}: PasswordInputStrengthProps) {
  const { value } = React.useContext(PasswordInputContext)
  const score = getStrength(value)

  return (
    <div
      data-slot="password-input-strength"
      data-score={score}
      className={cn(
        "group/password-input-strength flex items-center gap-3 pt-2 [--strength-color:var(--color-muted-foreground)] data-[score='1']:[--strength-color:var(--color-destructive)] data-[score='2']:[--strength-color:var(--color-warning)] data-[score='3']:[--strength-color:var(--color-success)] data-[score='4']:[--strength-color:var(--color-success)]",
        className
      )}
      {...props}
    >
      <div
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuenow={score}
        aria-valuetext={labels[score] || undefined}
        className="grid flex-1 grid-cols-4 gap-1"
      >
        {[1, 2, 3, 4].map((step) => (
          <span
            key={step}
            data-active={score >= step ? "" : undefined}
            className="group/strength-step h-1 overflow-hidden rounded-full bg-muted forced-colors:border"
          >
            <span
              className={cn(
                "block h-full origin-left scale-x-0 rounded-full bg-(--strength-color) transition-[scale,background-color] duration-300 ease-out-quint group-data-[score='4']/password-input-strength:bg-success group-data-active/strength-step:scale-x-100 motion-reduce:transition-none rtl:origin-right forced-colors:bg-[CanvasText]",
                step === 2 && "motion-safe:group-data-active/strength-step:delay-50",
                step === 3 && "motion-safe:group-data-active/strength-step:delay-100",
                step === 4 && "motion-safe:group-data-active/strength-step:delay-150"
              )}
            />
          </span>
        ))}
      </div>
      <span
        aria-hidden="true"
        className="min-w-12 text-end text-xs text-muted-foreground"
      >
        {labels[score]}
      </span>
    </div>
  )
}

function usePasswordInputValue() {
  return React.useContext(PasswordInputContext).value
}

const createPasswordInputController =
  PasswordInputPrimitive.createPasswordInputController

export {
  PasswordInput,
  PasswordInputGroup,
  PasswordInputControl,
  PasswordInputToggle,
  PasswordInputCapsLock,
  PasswordInputStrength,
  createPasswordInputController,
  scorePassword,
  usePasswordInputValue,
}
export type { PasswordInputProps, PasswordInputStrengthProps, PasswordStrength }
export type {
  PasswordInputController,
  PasswordInputState,
} from "@ui-sdk/react/password-input"
