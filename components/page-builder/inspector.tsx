"use client"

import * as React from "react"
import {
  IconArrowDown,
  IconArrowUp,
  IconChevronRight,
  IconCopy,
  IconLock,
  IconPlus,
  IconTrash,
  IconX,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import Link from "@/components/site/link"
import type { PlacedSection } from "@/lib/page-builder/doc"
import {
  emptyItem,
  fieldLimit,
  type Field,
  type ListField,
  type ListItem,
  type Props,
  type ScalarField,
  type ScalarValue,
} from "@/lib/page-builder/fields"
import { getSection, sectionLabel } from "@/lib/page-builder/registry"

type InspectorProps = {
  placed: PlacedSection | null
  index: number
  count: number
  onChange: (
    key: string,
    patch: (props: Props) => Props,
    coalesce: string
  ) => void
  onShift: (key: string, by: number) => void
  onDuplicate: (key: string) => void
  onRemove: (key: string) => void
}

const labelClassName = "text-xs font-medium text-muted-foreground"

function ScalarInput({
  id,
  field,
  value,
  onChange,
}: {
  id: string
  field: ScalarField
  value: ScalarValue
  onChange: (value: ScalarValue) => void
}) {
  if (field.type === "toggle") {
    return (
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm">
          {field.label}
        </label>
        <Switch
          id={id}
          size="sm"
          checked={value === true}
          onCheckedChange={(checked) => onChange(checked)}
        />
      </div>
    )
  }

  const control =
    field.type === "select" ? (
      <NativeSelect
        id={id}
        size="sm"
        className="w-full"
        value={String(value)}
        onChange={(event) => onChange(event.currentTarget.value)}
      >
        {field.options.map((option) => (
          <NativeSelectOption key={option.value} value={option.value}>
            {option.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    ) : field.type === "textarea" ? (
      <Textarea
        id={id}
        minRows={2}
        maxRows={8}
        maxLength={fieldLimit(field)}
        value={String(value)}
        onChange={(event) => onChange(event.currentTarget.value)}
      />
    ) : (
      <Input
        id={id}
        size="sm"
        type={field.type === "url" ? "url" : "text"}
        inputMode={field.type === "url" ? "url" : undefined}
        spellCheck={field.type === "url" ? false : undefined}
        autoComplete="off"
        maxLength={fieldLimit(field)}
        placeholder={
          field.type === "url"
            ? (field.placeholder ?? "/path or https://…")
            : field.placeholder
        }
        value={String(value)}
        onChange={(event) => onChange(event.currentTarget.value)}
      />
    )

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={labelClassName}>
        {field.label}
      </label>
      {control}
    </div>
  )
}

function ListInput({
  id,
  field,
  items,
  onChange,
}: {
  id: string
  field: ListField
  items: ListItem[]
  onChange: (
    update: (items: ListItem[]) => ListItem[],
    coalesce: string
  ) => void
}) {
  const [open, setOpen] = React.useState<number | null>(null)

  return (
    <fieldset className="flex flex-col gap-2">
      <legend
        className={`${labelClassName} mb-1.5 flex w-full items-center justify-between`}
      >
        {field.label}
        <span className="tabular-nums">
          {items.length}/{field.max}
        </span>
      </legend>
      <ul className="flex flex-col overflow-hidden rounded-md ring-(length:--hairline) ring-border forced-colors:border">
        {items.map((item, index) => {
          const expanded = open === index
          const title =
            String(item[field.titleKey] ?? "").trim() ||
            `${field.itemLabel} ${index + 1}`
          const panelId = `${id}-${index}`
          return (
            <li key={index} className="border-b last:border-b-0">
              <div className="flex items-center gap-1 pe-1">
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => setOpen(expanded ? null : index)}
                  className="flex h-8 min-w-0 flex-1 cursor-pointer items-center gap-1.5 rounded-sm ps-2 text-start text-sm outline-none hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-focus-ring forced-colors:focus-visible:outline-2"
                >
                  <IconChevronRight
                    aria-hidden="true"
                    className="size-3.5 shrink-0 text-muted-foreground transition-transform duration-150 ease-out-quint aria-expanded:rotate-90 motion-reduce:transition-none data-open:rotate-90"
                    data-open={expanded ? "" : undefined}
                  />
                  <span className="truncate">{title}</span>
                </button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label={`Move ${title} up`}
                  disabled={index === 0}
                  onClick={() => {
                    onChange((current) => {
                      const next = [...current]
                      ;[next[index - 1], next[index]] = [
                        next[index],
                        next[index - 1],
                      ]
                      return next
                    }, "order")
                    setOpen(open === index ? index - 1 : open)
                  }}
                >
                  <IconArrowUp />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label={`Remove ${title}`}
                  disabled={items.length <= field.min}
                  onClick={() => {
                    onChange(
                      (current) => current.filter((_, at) => at !== index),
                      "remove"
                    )
                    setOpen(null)
                  }}
                >
                  <IconX />
                </Button>
              </div>
              {expanded ? (
                <div
                  id={panelId}
                  className="flex flex-col gap-3 border-t bg-muted/30 p-3"
                >
                  {field.item.map((sub) => (
                    <ScalarInput
                      key={sub.key}
                      id={`${panelId}-${sub.key}`}
                      field={sub}
                      value={item[sub.key] ?? ""}
                      onChange={(value) => {
                        onChange((current) => {
                          const next = [...current]
                          next[index] = { ...next[index], [sub.key]: value }
                          return next
                        }, `${index}.${sub.key}`)
                      }}
                    />
                  ))}
                </div>
              ) : null}
            </li>
          )
        })}
      </ul>
      {items.length < field.max ? (
        <Button
          variant="ghost"
          size="sm"
          className="self-start"
          onClick={() => {
            onChange(
              (current) => [
                ...current,
                {
                  ...emptyItem(field),
                  [field.titleKey]: `New ${field.itemLabel.toLowerCase()}`,
                },
              ],
              "add"
            )
            setOpen(items.length)
          }}
        >
          <IconPlus data-icon="inline-start" />
          Add {field.itemLabel.toLowerCase()}
        </Button>
      ) : null}
    </fieldset>
  )
}

function FieldInput({
  sectionKey,
  field,
  props,
  onChange,
}: {
  sectionKey: string
  field: Field
  props: Props
  onChange: InspectorProps["onChange"]
}) {
  const id = `pb-${sectionKey}-${field.key}`
  if (field.type === "list") {
    return (
      <ListInput
        id={id}
        field={field}
        items={(props[field.key] as ListItem[]) ?? []}
        onChange={(update, coalesce) =>
          onChange(
            sectionKey,
            (current) => ({
              ...current,
              [field.key]: update((current[field.key] as ListItem[]) ?? []),
            }),
            `${field.key}.${coalesce}`
          )
        }
      />
    )
  }
  return (
    <ScalarInput
      id={id}
      field={field}
      value={(props[field.key] as ScalarValue) ?? ""}
      onChange={(value) =>
        onChange(
          sectionKey,
          (current) => ({ ...current, [field.key]: value }),
          field.key
        )
      }
    />
  )
}

function Inspector({
  placed,
  index,
  count,
  onChange,
  onShift,
  onDuplicate,
  onRemove,
}: InspectorProps) {
  if (!placed) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-1 p-6 text-center">
        <p className="text-sm font-medium">Nothing selected</p>
        <p className="text-sm text-pretty text-muted-foreground">
          Click a section in the preview to edit its text and links.
        </p>
      </div>
    )
  }

  const section =
    placed.type === "section" ? getSection(placed.sectionId) : null
  const title = section
    ? sectionLabel(section)
    : `${placed.type === "pro" ? placed.title : ""} · Pro`

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center gap-1 border-b px-3 py-2">
        <h2 className="min-w-0 flex-1 truncate text-sm font-medium">{title}</h2>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Move section up"
          disabled={index <= 0}
          onClick={() => onShift(placed.key, -1)}
        >
          <IconArrowUp />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Move section down"
          disabled={index >= count - 1}
          onClick={() => onShift(placed.key, 1)}
        >
          <IconArrowDown />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Duplicate section"
          onClick={() => onDuplicate(placed.key)}
        >
          <IconCopy />
        </Button>
        <Button
          variant="ghost-destructive"
          size="icon-sm"
          aria-label="Delete section"
          onClick={() => onRemove(placed.key)}
        >
          <IconTrash />
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {placed.type === "pro" ? (
          <div className="flex flex-col gap-3 p-4 text-sm">
            <p className="flex items-center gap-2 font-medium">
              <IconLock
                aria-hidden="true"
                className="size-4 text-muted-foreground"
              />
              {placed.title} is a Pro block
            </p>
            <p className="text-pretty text-muted-foreground">
              It exports as a placeholder section and an install command. With
              HextaUI Pro, run{" "}
              <code className="font-mono text-xs text-foreground">
                npx shadcn@latest add @hextaui-pro/{placed.name}
              </code>{" "}
              and render the block in its place.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                nativeButton={false}
                render={<Link href="/pricing" />}
              >
                Unlock with Pro
              </Button>
              <Button
                size="sm"
                variant="outline"
                nativeButton={false}
                render={<Link href={`/blocks/${placed.name}`} />}
              >
                View block
              </Button>
            </div>
          </div>
        ) : section ? (
          <form
            className="flex flex-col gap-4 p-4"
            onSubmit={(event) => event.preventDefault()}
          >
            {section.fields.map((field) => (
              <FieldInput
                key={`${placed.key}-${field.key}`}
                sectionKey={placed.key}
                field={field}
                props={placed.props}
                onChange={onChange}
              />
            ))}
          </form>
        ) : null}
      </div>
    </div>
  )
}

export { Inspector }
