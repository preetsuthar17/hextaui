"use client"

import * as React from "react"
import { IconX } from "@tabler/icons-react"
import * as TokenInputPrimitive from "@ui-sdk/react/token-input"
import * as TriggerMenuPrimitive from "@ui-sdk/react/trigger-menu"
import { cn } from "cn"

type ClassName<State> =
  string | ((state: State) => string | undefined) | undefined

function mergeClassName<State>(base: string, className: ClassName<State>) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

function renderDefaultToken(token: TokenInputPrimitive.Token) {
  return (
    <TokenInputToken>
      {token.label}
      <TokenInputTokenRemove />
    </TokenInputToken>
  )
}

function TokenInput({
  renderToken = renderDefaultToken,
  ...props
}: TokenInputPrimitive.TokenInputProps) {
  return <TokenInputPrimitive.TokenInput renderToken={renderToken} {...props} />
}

function TokenInputEditor({
  className,
  ...props
}: React.ComponentProps<typeof TokenInputPrimitive.TokenInputEditor>) {
  return (
    <TokenInputPrimitive.TokenInputEditor
      className={mergeClassName(
        "block max-h-60 min-h-16 w-full min-w-0 cursor-text overflow-y-auto rounded-md bg-transparent px-3 py-2 text-sm/6 wrap-break-word whitespace-pre-wrap text-foreground inset-ring-(length:--hairline) inset-ring-input transition-[color,background-color,box-shadow] duration-150 ease-out-cubic outline-none selection:bg-primary/20 focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:inset-ring-ring focus-visible:outline-hidden aria-invalid:inset-ring-destructive data-empty:before:pointer-events-none data-empty:before:text-muted-foreground data-empty:before:content-[attr(aria-placeholder)] data-readonly:cursor-default data-readonly:bg-muted/40 motion-reduce:transition-none dark:bg-input/30 dark:data-readonly:bg-input/20 forced-colors:border pointer-coarse:text-[max(16px,1rem)] data-disabled:cursor-not-allowed data-disabled:opacity-50 [@media(hover:hover)]:hover:not-focus-visible:not-data-disabled:not-data-readonly:inset-ring-ring/70",
        className
      )}
      {...props}
    />
  )
}

function TokenInputToken({
  className,
  ...props
}: React.ComponentProps<typeof TokenInputPrimitive.TokenInputToken>) {
  return (
    <TokenInputPrimitive.TokenInputToken
      className={mergeClassName(
        "mx-px inline-flex max-w-full items-center gap-1 rounded-sm bg-muted ps-1.5 pe-0.5 align-bottom text-sm/6 font-medium whitespace-nowrap text-foreground transition-[background-color,box-shadow,opacity] duration-150 ease-out-cubic select-none not-has-data-[slot=token-input-token-remove]:pe-1.5 data-pending:text-muted-foreground data-unresolved:bg-transparent data-unresolved:inset-ring-(length:--hairline) data-unresolved:inset-ring-warning data-[selected]:bg-primary data-[selected]:text-primary-foreground motion-safe:data-pending:animate-pulse motion-reduce:transition-none dark:bg-input/60 forced-colors:border forced-colors:data-[selected]:border-[Highlight] [&_svg]:pointer-events-none [&_svg]:shrink-0 data-[selected]:[&_svg]:text-primary-foreground/70 [&_svg:not([class*='size-'])]:size-3.5 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function TokenInputTokenRemove({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TokenInputPrimitive.TokenInputTokenRemove>) {
  return (
    <TokenInputPrimitive.TokenInputTokenRemove
      className={mergeClassName(
        "relative inline-flex size-5 shrink-0 cursor-default items-center justify-center rounded-[max(calc(var(--radius-sm)*0.5),calc(var(--radius-sm)-var(--spacing)*0.5))] text-muted-foreground transition-[color,background-color] duration-150 ease-out-cubic before:absolute before:-inset-1 data-readonly:hidden motion-reduce:transition-none pointer-coarse:before:-inset-2.5 data-disabled:hidden [@media(hover:hover)]:hover:bg-foreground/10 [@media(hover:hover)]:hover:text-foreground",
        className
      )}
      {...props}
    >
      {children ?? <IconX aria-hidden="true" className="size-3" />}
    </TokenInputPrimitive.TokenInputTokenRemove>
  )
}

function TriggerMenu(props: TriggerMenuPrimitive.TriggerMenuProps) {
  return <TriggerMenuPrimitive.TriggerMenu {...props} />
}

function TriggerMenuContent({
  className,
  sideOffset = 6,
  align = "start",
  collisionPadding = 8,
  ...props
}: React.ComponentProps<typeof TriggerMenuPrimitive.TriggerMenuContent>) {
  return (
    <TriggerMenuPrimitive.TriggerMenuContent
      sideOffset={sideOffset}
      align={align}
      collisionPadding={collisionPadding}
      className={mergeClassName(
        "m-0 flex max-h-[min(var(--available-height),18rem)] w-60 max-w-(--available-width) origin-(--transform-origin) flex-col overflow-hidden rounded-lg border-0 bg-popover p-0 text-popover-foreground shadow-md ring-(length:--hairline) ring-foreground/10 transition-[opacity,scale] duration-150 ease-out-quint outline-none [--trigger-menu-item-radius:max(calc(var(--radius-sm)*0.5),calc(var(--radius-lg)-0.25rem))] data-ending-style:opacity-0 data-ending-style:duration-100 data-starting-style:opacity-0 motion-safe:data-ending-style:scale-96 motion-safe:data-starting-style:scale-96 motion-reduce:transition-opacity forced-colors:border",
        className
      )}
      {...props}
    />
  )
}

function TriggerMenuList({
  className,
  ...props
}: React.ComponentProps<typeof TriggerMenuPrimitive.TriggerMenuList>) {
  return (
    <TriggerMenuPrimitive.TriggerMenuList
      className={mergeClassName(
        "min-h-0 scroll-py-1 overflow-y-auto overscroll-contain p-1 outline-none empty:hidden aria-busy:opacity-60 motion-safe:transition-opacity",
        className
      )}
      {...props}
    />
  )
}

function TriggerMenuItem<T = string>({
  className,
  ...props
}: React.ComponentProps<typeof TriggerMenuPrimitive.TriggerMenuItem<T>>) {
  return (
    <TriggerMenuPrimitive.TriggerMenuItem<T>
      className={mergeClassName(
        "relative flex min-h-8 w-full cursor-default items-center gap-2 rounded-(--trigger-menu-item-radius) px-2 py-1.5 text-start text-sm wrap-anywhere outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground forced-colors:data-highlighted:outline-2 forced-colors:data-highlighted:-outline-offset-2 forced-colors:data-highlighted:outline-solid pointer-coarse:min-h-11 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function TriggerMenuItemIcon({
  className,
  ...props
}: React.ComponentProps<typeof TriggerMenuPrimitive.TriggerMenuItemIcon>) {
  return (
    <TriggerMenuPrimitive.TriggerMenuItemIcon
      className={mergeClassName(
        "flex size-4 shrink-0 items-center justify-center text-muted-foreground data-mirror:rtl:-scale-x-100",
        className
      )}
      {...props}
    />
  )
}

function TriggerMenuEmpty({
  className,
  ...props
}: React.ComponentProps<typeof TriggerMenuPrimitive.TriggerMenuEmpty>) {
  return (
    <TriggerMenuPrimitive.TriggerMenuEmpty
      className={mergeClassName(
        "shrink-0 px-3 py-5 text-center text-sm text-balance wrap-anywhere text-muted-foreground not-data-empty:not-data-loading:hidden",
        className
      )}
      {...props}
    />
  )
}

function TriggerMenuGroup({
  className,
  ...props
}: React.ComponentProps<typeof TriggerMenuPrimitive.TriggerMenuGroup>) {
  return (
    <TriggerMenuPrimitive.TriggerMenuGroup
      className={mergeClassName("not-first:mt-1", className)}
      {...props}
    />
  )
}

function TriggerMenuGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof TriggerMenuPrimitive.TriggerMenuGroupLabel>) {
  return (
    <TriggerMenuPrimitive.TriggerMenuGroupLabel
      className={mergeClassName(
        "px-2 pt-1.5 pb-1 text-xs font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function TriggerMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof TriggerMenuPrimitive.TriggerMenuSeparator>) {
  return (
    <TriggerMenuPrimitive.TriggerMenuSeparator
      className={mergeClassName("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function TriggerMenuHint({
  className,
  ...props
}: React.ComponentProps<typeof TriggerMenuPrimitive.TriggerMenuHint>) {
  return (
    <TriggerMenuPrimitive.TriggerMenuHint
      className={mergeClassName(
        "pointer-events-none text-sm/6 whitespace-pre text-muted-foreground/70 select-none pointer-coarse:text-[max(16px,1rem)]",
        className
      )}
      {...props}
    />
  )
}

function TriggerMenuStatus({
  className,
  ...props
}: React.ComponentProps<typeof TriggerMenuPrimitive.TriggerMenuStatus>) {
  return (
    <TriggerMenuPrimitive.TriggerMenuStatus
      className={mergeClassName("sr-only", className)}
      {...props}
    />
  )
}

const createTokenInputController =
  TokenInputPrimitive.createTokenInputController
const fromText = TokenInputPrimitive.fromText
const toLabel = TokenInputPrimitive.toLabel
const toText = TokenInputPrimitive.toText

type TokenInputProps = TokenInputPrimitive.TokenInputProps
type TokenInputValue = TokenInputPrimitive.TokenInputValue
type Token = TokenInputPrimitive.Token
type TokenCodec = TokenInputPrimitive.TokenCodec
type TokenDeletion = TokenInputPrimitive.TokenDeletion
type TriggerMenuDataItem<T = string> =
  TriggerMenuPrimitive.TriggerMenuDataItem<T>

export {
  TokenInput,
  TokenInputEditor,
  TokenInputToken,
  TokenInputTokenRemove,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuEmpty,
  TriggerMenuGroup,
  TriggerMenuGroupLabel,
  TriggerMenuHint,
  TriggerMenuItem,
  TriggerMenuItemIcon,
  TriggerMenuList,
  TriggerMenuSeparator,
  TriggerMenuStatus,
  createTokenInputController,
  fromText,
  toLabel,
  toText,
}
export type {
  Token,
  TokenCodec,
  TokenDeletion,
  TokenInputProps,
  TokenInputValue,
  TriggerMenuDataItem,
}
