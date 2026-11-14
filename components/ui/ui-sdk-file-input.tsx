"use client"

import * as React from "react"
import {
  IconAlertCircle,
  IconCode,
  IconFile,
  IconFileText,
  IconFileZip,
  IconMusic,
  IconPhoto,
  IconTable,
  IconUpload,
  IconVideo,
  IconX,
} from "@tabler/icons-react"
import * as FileInputPrimitive from "@ui-sdk/react/file-input"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button"

type ClassName<State> =
  string | ((state: State) => string | undefined) | undefined

function mergeClassName<State>(base: string, className: ClassName<State>) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}

type FileRejection = FileInputPrimitive.FileRejection
type FileRejectionReason = FileRejection["reasons"][number]

type FileInputRules = {
  accept?: string | readonly string[]
  maxFiles?: number
  maxSize?: number
  minSize?: number
  multiple?: boolean
}

type FileInputContextValue = {
  invalid: boolean
  rejected: FileRejection[]
  rules: FileInputRules
  clearRejected: () => void
}

const FileInputContext = React.createContext<FileInputContextValue>({
  invalid: false,
  rejected: [],
  rules: {},
  clearRejected: () => {},
})

const FileInputItemContext = React.createContext<File | null>(null)

function useFileInputRejections() {
  const { rejected, clearRejected } = React.useContext(FileInputContext)
  return { rejected, clear: clearRejected }
}

function useFileInputItemFile(part: string) {
  const file = React.useContext(FileInputItemContext)
  if (!file) {
    throw new Error(`${part} must be used inside <FileInputItem>.`)
  }
  return file
}

type FileInputProps = React.ComponentProps<
  typeof FileInputPrimitive.FileInput
> & {
  invalid?: boolean
}

function FileInput({
  className,
  invalid = false,
  accept,
  maxFiles,
  maxSize,
  minSize,
  multiple,
  directory,
  onReject,
  onValueChange,
  ...props
}: FileInputProps) {
  const [rejected, setRejected] = React.useState<FileRejection[]>([])
  const clearRejected = React.useCallback(() => setRejected([]), [])
  const context = React.useMemo(
    () => ({
      invalid,
      rejected,
      clearRejected,
      rules: {
        accept,
        maxFiles,
        maxSize,
        minSize,
        multiple: multiple || directory,
      },
    }),
    [
      invalid,
      rejected,
      clearRejected,
      accept,
      maxFiles,
      maxSize,
      minSize,
      multiple,
      directory,
    ]
  )

  return (
    <FileInputContext.Provider value={context}>
      <FileInputPrimitive.FileInput
        data-invalid={invalid ? "" : undefined}
        accept={accept}
        maxFiles={maxFiles}
        maxSize={maxSize}
        minSize={minSize}
        multiple={multiple}
        directory={directory}
        onValueChange={(value, details) => {
          if (details.reason === "reset" || details.added.length > 0) {
            setRejected(details.rejected)
          }
          onValueChange?.(value, details)
        }}
        onReject={(files, details) => {
          setRejected(files)
          onReject?.(files, details)
        }}
        className={mergeClassName(
          "group/file-input flex w-full min-w-0 flex-col gap-3",
          className
        )}
        {...props}
      />
    </FileInputContext.Provider>
  )
}

const fileInputDropzoneVariants = cva(
  "group/file-input-dropzone text-sm transition-[background-color,border-color,opacity,visibility] duration-150 ease-out-quint motion-reduce:transition-none",
  {
    variants: {
      variant: {
        default:
          "relative flex min-h-40 w-full min-w-0 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-input px-6 py-8 text-center group-data-invalid/file-input:border-destructive/70 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-dragging:border-ring data-dragging:bg-muted/50 data-drag-reject:border-destructive data-drag-reject:bg-destructive/5 dark:bg-input/10 dark:data-dragging:bg-input/30 dark:data-drag-reject:bg-destructive/10 forced-colors:data-dragging:border-[Highlight]",
        overlay:
          "pointer-events-none invisible fixed inset-0 z-50 m-0 flex flex-col items-center justify-center gap-1 bg-background/85 p-6 text-center opacity-0 backdrop-blur-sm before:pointer-events-none before:absolute before:inset-3 before:rounded-2xl before:border-2 before:border-dashed before:border-ring/60 data-dragging:visible data-dragging:opacity-100 data-drag-reject:before:border-destructive/70 forced-colors:bg-[Canvas]",
        composer:
          "relative flex w-full min-w-0 flex-col gap-2 rounded-2xl bg-card p-2 inset-ring-(length:--hairline) inset-ring-border transition-[background-color,box-shadow] group-data-invalid/file-input:inset-ring-destructive/70 has-[textarea:focus-visible]:ring-3 has-[textarea:focus-visible]:ring-focus-ring has-[textarea:focus-visible]:inset-ring-ring data-disabled:opacity-50 data-dragging:bg-muted/40 data-dragging:inset-ring-ring data-drag-reject:bg-destructive/5 data-drag-reject:inset-ring-destructive dark:bg-input/20 dark:data-dragging:bg-input/40 forced-colors:border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function FileInputDropzone({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof FileInputPrimitive.FileInputDropzone> &
  VariantProps<typeof fileInputDropzoneVariants>) {
  return (
    <FileInputPrimitive.FileInputDropzone
      data-variant={variant}
      className={mergeClassName(
        fileInputDropzoneVariants({ variant }),
        className
      )}
      {...props}
    />
  )
}

function FileInputDropzoneIcon({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      data-slot="file-input-dropzone-icon"
      className={cn(
        "relative z-10 mb-2 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-[translate,color,background-color] duration-200 ease-out-quint group-data-drag-accept/file-input-dropzone:bg-foreground group-data-drag-accept/file-input-dropzone:text-background group-data-drag-reject/file-input-dropzone:bg-destructive/10 group-data-drag-reject/file-input-dropzone:text-destructive motion-safe:group-data-drag-accept/file-input-dropzone:-translate-y-1 motion-reduce:transition-colors forced-colors:border [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {children ?? <IconUpload />}
    </div>
  )
}

function FileInputDropzoneTitle({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="file-input-dropzone-title"
      className={cn(
        "relative z-10 m-0 font-medium text-foreground text-balance",
        className
      )}
      {...props}
    />
  )
}

function FileInputDropzoneDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="file-input-dropzone-description"
      className={cn(
        "relative z-10 m-0 text-xs text-muted-foreground text-pretty",
        className
      )}
      {...props}
    />
  )
}

function FileInputTrigger({
  className,
  variant = "outline",
  size = "sm",
  shape,
  ...props
}: React.ComponentProps<typeof FileInputPrimitive.FileInputTrigger> &
  VariantProps<typeof buttonVariants>) {
  const { invalid } = React.useContext(FileInputContext)
  return (
    <FileInputPrimitive.FileInputTrigger
      aria-invalid={invalid || undefined}
      className={mergeClassName(
        cn(
          buttonVariants({ variant, size, shape }),
          "relative z-10 data-invalid:ring-3 data-invalid:ring-destructive/20 data-invalid:inset-ring-destructive"
        ),
        className
      )}
      {...props}
    />
  )
}

type FileInputListLayout = "list" | "grid" | "chips"

const FileInputListContext = React.createContext<FileInputListLayout>("list")

const fileInputListVariants = cva("w-full min-w-0 empty:hidden", {
  variants: {
    layout: {
      list: "flex flex-col gap-1.5",
      grid: "grid grid-cols-[repeat(auto-fill,minmax(--spacing(24),1fr))] gap-2",
      chips: "flex flex-row flex-wrap gap-1.5",
    },
  },
  defaultVariants: {
    layout: "list",
  },
})

function FileInputList({
  className,
  layout = "list",
  ...props
}: React.ComponentProps<typeof FileInputPrimitive.FileInputList> &
  VariantProps<typeof fileInputListVariants>) {
  const resolved = layout ?? "list"
  return (
    <FileInputListContext.Provider value={resolved}>
      <FileInputPrimitive.FileInputList
        data-layout={resolved}
        className={mergeClassName(
          fileInputListVariants({ layout: resolved }),
          className
        )}
        {...props}
      />
    </FileInputListContext.Provider>
  )
}

const fileInputItemVariants = cva(
  "group/file-input-item relative flex min-w-0 bg-card text-card-foreground inset-ring-(length:--hairline) inset-ring-border transition-[background-color,box-shadow] duration-150 ease-out-quint outline-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:inset-ring-ring data-disabled:opacity-50 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:animation-duration-200 motion-safe:ease-out-quint dark:bg-input/20 forced-colors:border",
  {
    variants: {
      layout: {
        list: "items-center gap-3 rounded-lg p-2 pe-1.5 text-sm motion-safe:slide-in-from-top-1",
        grid: "aspect-square overflow-hidden rounded-lg motion-safe:zoom-in-95",
        chips:
          "max-w-60 items-center gap-2 rounded-lg p-1 pe-1 text-xs motion-safe:zoom-in-95",
      },
    },
    defaultVariants: {
      layout: "list",
    },
  }
)

type FileInputItemProps = React.ComponentProps<
  typeof FileInputPrimitive.FileInputItem
>

function FileInputItemDefault({ layout }: { layout: FileInputListLayout }) {
  if (layout === "grid") {
    return (
      <>
        <FileInputItemPreview />
        <FileInputItemRemove />
      </>
    )
  }
  return (
    <>
      <FileInputItemPreview />
      <FileInputItemContent>
        <FileInputItemName />
        <FileInputItemSize />
      </FileInputItemContent>
      <FileInputItemRemove />
    </>
  )
}

function FileInputItem({ className, children, ...props }: FileInputItemProps) {
  const layout = React.useContext(FileInputListContext)
  return (
    <FileInputPrimitive.FileInputItem
      data-layout={layout}
      className={mergeClassName(fileInputItemVariants({ layout }), className)}
      {...props}
    >
      {(state) => (
        <FileInputItemContext.Provider value={state.file}>
          {typeof children === "function"
            ? children(state)
            : (children ?? <FileInputItemDefault layout={layout} />)}
        </FileInputItemContext.Provider>
      )}
    </FileInputPrimitive.FileInputItem>
  )
}

function fileIcon(file: File) {
  const type = file.type
  const name = file.name.toLowerCase()
  if (type.startsWith("image/")) return IconPhoto
  if (type.startsWith("video/")) return IconVideo
  if (type.startsWith("audio/")) return IconMusic
  if (/\.(zip|gz|tgz|rar|7z|tar)$/.test(name) || type.includes("zip")) {
    return IconFileZip
  }
  if (/\.(csv|tsv|xlsx?|numbers)$/.test(name)) return IconTable
  if (/\.(jsx?|tsx?|json|css|html?|py|rb|go|rs|sh|ya?ml|md)$/.test(name)) {
    return IconCode
  }
  if (type === "application/pdf" || type.startsWith("text/")) {
    return IconFileText
  }
  return IconFile
}

function useObjectUrl(file: File, enabled: boolean) {
  const [url, setUrl] = React.useState<{ file: File; url: string } | null>(
    null
  )
  React.useEffect(() => {
    if (!enabled) return
    const next = URL.createObjectURL(file)
    setUrl({ file, url: next })
    return () => URL.revokeObjectURL(next)
  }, [file, enabled])
  return url?.file === file ? url.url : undefined
}

function FileInputItemPreview({
  className,
  ...props
}: React.ComponentProps<"span">) {
  const file = useFileInputItemFile("FileInputItemPreview")
  const isImage =
    file.type.startsWith("image/") && file.type !== "image/svg+xml"
  const url = useObjectUrl(file, isImage)
  const [broken, setBroken] = React.useState<string | null>(null)
  const Icon = fileIcon(file)
  const shown = url && broken !== url ? url : undefined

  return (
    <span
      aria-hidden="true"
      data-slot="file-input-item-preview"
      data-kind={shown ? "image" : "icon"}
      className={cn(
        "relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-muted-foreground after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:inset-ring-(length:--hairline) after:inset-ring-foreground/10 group-data-[layout=chips]/file-input-item:size-8 group-data-[layout=chips]/file-input-item:rounded-md group-data-[layout=grid]/file-input-item:size-full group-data-[layout=grid]/file-input-item:rounded-none group-data-[layout=grid]/file-input-item:after:hidden [&_svg]:size-4.5 [&_svg]:shrink-0 group-data-[layout=grid]/file-input-item:[&_svg]:size-6",
        className
      )}
      {...props}
    >
      {shown ? (
        <img
          src={shown}
          alt=""
          draggable={false}
          onError={() => setBroken(shown)}
          className="size-full max-w-none object-cover"
        />
      ) : (
        <Icon />
      )}
    </span>
  )
}

function FileInputItemContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="file-input-item-content"
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-0.5 leading-tight",
        className
      )}
      {...props}
    />
  )
}

function splitFileName(name: string) {
  if (/[\u0590-\u08ff\ufb1d-\ufdff\ufe70-\ufefc]/.test(name)) return null
  const dot = name.lastIndexOf(".")
  if (dot <= 0 || dot === name.length - 1 || name.length - dot > 8) {
    return null
  }
  return { base: name.slice(0, dot), extension: name.slice(dot) }
}

function FileInputItemName({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  const file = useFileInputItemFile("FileInputItemName")
  const name = children ?? FileInputPrimitive.relativePath(file)
  const parts = typeof name === "string" ? splitFileName(name) : null

  return (
    <span
      data-slot="file-input-item-name"
      title={typeof name === "string" ? name : undefined}
      dir="auto"
      className={cn(
        "max-w-full min-w-0 font-medium group-data-[layout=chips]/file-input-item:text-xs",
        parts ? "flex" : "block truncate",
        className
      )}
      {...props}
    >
      {parts ? (
        <>
          <span className="min-w-0 truncate">{parts.base}</span>
          <span className="shrink-0">{parts.extension}</span>
        </>
      ) : (
        name
      )}
    </span>
  )
}

function FileInputItemSize({
  className,
  locale,
  ...props
}: React.ComponentProps<"span"> & { locale?: string }) {
  const file = useFileInputItemFile("FileInputItemSize")
  return (
    <span
      data-slot="file-input-item-size"
      className={cn("text-xs text-muted-foreground tabular-nums", className)}
      {...props}
    >
      {FileInputPrimitive.formatFileSize(file.size, locale)}
    </span>
  )
}

function FileInputItemRemove({
  className,
  children,
  ...props
}: React.ComponentProps<typeof FileInputPrimitive.FileInputItemRemove>) {
  return (
    <FileInputPrimitive.FileInputItemRemove
      className={mergeClassName(
        "relative inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-[color,background-color] duration-150 ease-out-quint outline-none after:absolute after:-inset-1 hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50 pointer-coarse:after:-inset-2 group-data-[layout=chips]/file-input-item:size-6 group-data-[layout=grid]/file-input-item:absolute group-data-[layout=grid]/file-input-item:end-1.5 group-data-[layout=grid]/file-input-item:top-1.5 group-data-[layout=grid]/file-input-item:size-6 group-data-[layout=grid]/file-input-item:rounded-full group-data-[layout=grid]/file-input-item:bg-background/80 group-data-[layout=grid]/file-input-item:text-foreground group-data-[layout=grid]/file-input-item:backdrop-blur-sm group-data-[layout=grid]/file-input-item:hover:bg-background dark:hover:bg-muted/60 forced-colors:group-data-[layout=grid]/file-input-item:bg-[Canvas] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 group-data-[layout=chips]/file-input-item:[&_svg]:size-3.5 group-data-[layout=grid]/file-input-item:[&_svg]:size-3.5",
        className
      )}
      {...props}
    >
      {children ?? <IconX aria-hidden="true" />}
    </FileInputPrimitive.FileInputItemRemove>
  )
}

function plural(count: number, one: string, other: string) {
  return count === 1 ? one : other
}

function defaultReasonLabel(reason: FileRejectionReason, rules: FileInputRules) {
  switch (reason) {
    case "file-type":
      return "This file type isn’t accepted"
    case "file-too-large":
      return rules.maxSize === undefined
        ? "Too large"
        : `Larger than ${FileInputPrimitive.formatFileSize(rules.maxSize)}`
    case "file-too-small":
      return rules.minSize === undefined
        ? "Too small"
        : `Smaller than ${FileInputPrimitive.formatFileSize(rules.minSize)}`
    case "too-many-files":
      return rules.multiple && rules.maxFiles !== undefined
        ? `Over the limit of ${rules.maxFiles} ${plural(rules.maxFiles, "file", "files")}`
        : "Only one file at a time"
    default:
      return reason
  }
}

type FileInputRejectionsProps = Omit<
  React.ComponentProps<"ul">,
  "children"
> & {
  getReasonLabel?: (
    reason: FileRejectionReason,
    rules: FileInputRules,
    rejection: FileRejection
  ) => string
}

function FileInputRejections({
  className,
  getReasonLabel = defaultReasonLabel,
  ...props
}: FileInputRejectionsProps) {
  const { rejected, rules } = React.useContext(FileInputContext)
  if (rejected.length === 0) return null

  return (
    <ul
      data-slot="file-input-rejections"
      className={cn(
        "m-0 flex w-full min-w-0 list-none flex-col gap-1 p-0 text-sm",
        className
      )}
      {...props}
    >
      {rejected.map((rejection, index) => (
        <li
          key={`${rejection.file.name}-${index}`}
          data-slot="file-input-rejection"
          className="flex min-w-0 items-start gap-2 text-destructive motion-safe:animate-in motion-safe:fade-in-0 motion-safe:animation-duration-200"
        >
          <IconAlertCircle
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0"
          />
          <span className="min-w-0">
            <span
              dir="auto"
              className="font-medium [overflow-wrap:anywhere]"
            >
              {rejection.file.name}
            </span>
            <span className="text-destructive/80">
              {": "}
              {rejection.reasons
                .map((reason) => getReasonLabel(reason, rules, rejection))
                .join(", ")}
            </span>
          </span>
        </li>
      ))}
    </ul>
  )
}

const createFileInputController = FileInputPrimitive.createFileInputController
const formatFileSize = FileInputPrimitive.formatFileSize
const relativePath = FileInputPrimitive.relativePath

export {
  FileInput,
  FileInputDropzone,
  FileInputDropzoneIcon,
  FileInputDropzoneTitle,
  FileInputDropzoneDescription,
  FileInputTrigger,
  FileInputList,
  FileInputItem,
  FileInputItemPreview,
  FileInputItemContent,
  FileInputItemName,
  FileInputItemSize,
  FileInputItemRemove,
  FileInputRejections,
  createFileInputController,
  fileInputDropzoneVariants,
  fileInputItemVariants,
  fileInputListVariants,
  formatFileSize,
  relativePath,
  useFileInputRejections,
}
export type { FileInputProps, FileInputRules, FileRejection }
export type {
  FileInputController,
  FileInputValueChangeDetails,
} from "@ui-sdk/react/file-input"
