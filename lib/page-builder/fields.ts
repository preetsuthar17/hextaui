type ScalarValue = string | boolean

type ListItem = Record<string, ScalarValue>

type FieldValue = ScalarValue | ListItem[]

type Props = Record<string, FieldValue>

type Option = { value: string; label: string }

type ScalarField =
  | {
      key: string
      label: string
      type: "text" | "textarea" | "url"
      max?: number
      placeholder?: string
    }
  | { key: string; label: string; type: "select"; options: Option[] }
  | { key: string; label: string; type: "toggle" }

type ListField = {
  key: string
  label: string
  type: "list"
  itemLabel: string
  titleKey: string
  min: number
  max: number
  item: ScalarField[]
}

type Field = ScalarField | ListField

const textLimits = { text: 120, url: 300, textarea: 600 } as const

function fieldLimit(field: ScalarField) {
  if (field.type === "select" || field.type === "toggle") return 0
  return field.max ?? textLimits[field.type]
}

function cleanScalar(field: ScalarField, value: unknown): ScalarValue | null {
  if (field.type === "toggle") return typeof value === "boolean" ? value : null
  if (typeof value !== "string") return null
  if (field.type === "select") {
    return field.options.some((option) => option.value === value) ? value : null
  }
  const text = value.replace(
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g,
    ""
  )
  const limited = text.slice(0, fieldLimit(field))
  if (field.type === "url" && limited && !isSafeUrl(limited)) return null
  return limited
}

function isSafeUrl(value: string) {
  return (
    /^(https?:\/\/|mailto:|\/|#)/i.test(value.trim()) || value.trim() === ""
  )
}

function cleanItem(fields: ScalarField[], value: unknown, fallback: ListItem) {
  const source = typeof value === "object" && value !== null ? value : {}
  const item: ListItem = {}
  for (const field of fields) {
    const cleaned = cleanScalar(field, (source as ListItem)[field.key])
    item[field.key] = cleaned ?? fallback[field.key] ?? emptyScalar(field)
  }
  return item
}

function emptyScalar(field: ScalarField): ScalarValue {
  if (field.type === "toggle") return false
  if (field.type === "select") return field.options[0]?.value ?? ""
  return ""
}

function emptyItem(field: ListField): ListItem {
  return Object.fromEntries(
    field.item.map((sub) => [sub.key, emptyScalar(sub)])
  )
}

function cleanProps(fields: Field[], value: unknown, defaults: Props): Props {
  const source =
    typeof value === "object" && value !== null && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {}
  const props: Props = {}
  for (const field of fields) {
    const raw = source[field.key]
    const fallback = defaults[field.key]
    if (field.type === "list") {
      const list = Array.isArray(raw) ? raw : (fallback as ListItem[])
      const defaultsList = (fallback as ListItem[]) ?? []
      props[field.key] = list
        .slice(0, field.max)
        .map((item, index) =>
          cleanItem(field.item, item, defaultsList[index] ?? emptyItem(field))
        )
      continue
    }
    const cleaned = raw === undefined ? null : cleanScalar(field, raw)
    props[field.key] =
      cleaned ?? (fallback as ScalarValue) ?? emptyScalar(field)
  }
  return props
}

function diffProps(fields: Field[], props: Props, defaults: Props) {
  const diff: Props = {}
  for (const field of fields) {
    const value = props[field.key]
    if (JSON.stringify(value) !== JSON.stringify(defaults[field.key])) {
      diff[field.key] = value
    }
  }
  return diff
}

export {
  cleanProps,
  diffProps,
  emptyItem,
  fieldLimit,
  isSafeUrl,
  type Field,
  type FieldValue,
  type ListField,
  type ListItem,
  type Option,
  type Props,
  type ScalarField,
  type ScalarValue,
}
