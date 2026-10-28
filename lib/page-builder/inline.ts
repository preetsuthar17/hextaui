import {
  fieldLimit,
  type ListItem,
  type Props,
  type ScalarField,
} from "@/lib/page-builder/fields"
import type { SectionDefinition } from "@/lib/page-builder/sections/shared"

type InlineField = { path: string; value: string; max: number; label: string }

function isInlineText(field: ScalarField) {
  return field.type === "text" || field.type === "textarea"
}

function inlineFields(section: SectionDefinition, props: Props) {
  const fields: InlineField[] = []
  for (const field of section.fields) {
    if (field.type === "list") {
      const items = Array.isArray(props[field.key])
        ? (props[field.key] as ListItem[])
        : []
      items.forEach((item, index) => {
        for (const sub of field.item) {
          const value = item[sub.key]
          if (!isInlineText(sub) || typeof value !== "string") continue
          if (!value.trim() || value.includes("\n")) continue
          fields.push({
            path: `${field.key}.${index}.${sub.key}`,
            value,
            max: fieldLimit(sub),
            label: `${field.itemLabel} ${index + 1} ${sub.label.toLowerCase()}`,
          })
        }
      })
      continue
    }
    const value = props[field.key]
    if (!isInlineText(field) || typeof value !== "string") continue
    if (!value.trim() || value.includes("\n")) continue
    fields.push({
      path: field.key,
      value,
      max: fieldLimit(field),
      label: field.label,
    })
  }
  return fields
}

function setPath(props: Props, path: string, value: string): Props {
  const [key, index, sub] = path.split(".")
  if (sub === undefined) return { ...props, [key]: value }
  const items = Array.isArray(props[key]) ? (props[key] as ListItem[]) : []
  const at = Number(index)
  if (!Number.isInteger(at) || !items[at]) return props
  const next = [...items]
  next[at] = { ...next[at], [sub]: value }
  return { ...props, [key]: next }
}

function cleanInline(value: string, max: number) {
  return value.replace(/\s+/g, " ").trimStart().slice(0, max)
}

export { cleanInline, inlineFields, setPath, type InlineField }
