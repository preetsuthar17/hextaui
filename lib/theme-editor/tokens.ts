const tokenNames = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "success",
  "success-foreground",
  "info",
  "info-foreground",
  "warning",
  "warning-foreground",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
] as const

type TokenName = (typeof tokenNames)[number]

type TokenGroup = { title: string; tokens: TokenName[] }

const tokenGroups: TokenGroup[] = [
  {
    title: "Base",
    tokens: ["background", "foreground", "border", "input", "ring"],
  },
  {
    title: "Primary",
    tokens: ["primary", "primary-foreground"],
  },
  {
    title: "Secondary and accent",
    tokens: [
      "secondary",
      "secondary-foreground",
      "accent",
      "accent-foreground",
    ],
  },
  {
    title: "Muted",
    tokens: ["muted", "muted-foreground"],
  },
  {
    title: "Surfaces",
    tokens: ["card", "card-foreground", "popover", "popover-foreground"],
  },
  {
    title: "Status",
    tokens: [
      "destructive",
      "destructive-foreground",
      "success",
      "success-foreground",
      "info",
      "info-foreground",
      "warning",
      "warning-foreground",
    ],
  },
  {
    title: "Charts",
    tokens: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"],
  },
  {
    title: "Sidebar",
    tokens: [
      "sidebar",
      "sidebar-foreground",
      "sidebar-primary",
      "sidebar-primary-foreground",
      "sidebar-accent",
      "sidebar-accent-foreground",
      "sidebar-border",
      "sidebar-ring",
    ],
  },
]

type ContrastPair = {
  foreground: TokenName
  background: TokenName
  minimum: number
  kind?: "text" | "ui"
}

const contrastPairs: ContrastPair[] = [
  { foreground: "foreground", background: "background", minimum: 4.5 },
  { foreground: "card-foreground", background: "card", minimum: 4.5 },
  { foreground: "popover-foreground", background: "popover", minimum: 4.5 },
  { foreground: "primary-foreground", background: "primary", minimum: 4.5 },
  {
    foreground: "secondary-foreground",
    background: "secondary",
    minimum: 4.5,
  },
  { foreground: "muted-foreground", background: "background", minimum: 4.5 },
  { foreground: "muted-foreground", background: "muted", minimum: 4.5 },
  { foreground: "accent-foreground", background: "accent", minimum: 4.5 },
  {
    foreground: "destructive-foreground",
    background: "destructive",
    minimum: 4.5,
  },
  { foreground: "success-foreground", background: "success", minimum: 4.5 },
  { foreground: "info-foreground", background: "info", minimum: 4.5 },
  { foreground: "warning-foreground", background: "warning", minimum: 4.5 },
  { foreground: "sidebar-foreground", background: "sidebar", minimum: 4.5 },
  {
    foreground: "sidebar-primary-foreground",
    background: "sidebar-primary",
    minimum: 4.5,
  },
  {
    foreground: "sidebar-accent-foreground",
    background: "sidebar-accent",
    minimum: 4.5,
  },
]

const reportPairs: ContrastPair[] = [
  ...contrastPairs,
  { foreground: "foreground", background: "card", minimum: 4.5 },
  { foreground: "foreground", background: "muted", minimum: 4.5 },
  { foreground: "muted-foreground", background: "card", minimum: 4.5 },
  { foreground: "muted-foreground", background: "secondary", minimum: 4.5 },
  { foreground: "destructive", background: "background", minimum: 4.5 },
  { foreground: "success", background: "background", minimum: 4.5 },
  { foreground: "info", background: "background", minimum: 4.5 },
  { foreground: "warning", background: "background", minimum: 4.5 },
  { foreground: "primary", background: "background", minimum: 3, kind: "ui" },
  { foreground: "ring", background: "background", minimum: 3, kind: "ui" },
  { foreground: "sidebar-primary", background: "sidebar", minimum: 3, kind: "ui" },
  { foreground: "chart-1", background: "card", minimum: 3, kind: "ui" },
  { foreground: "chart-2", background: "card", minimum: 3, kind: "ui" },
  { foreground: "chart-3", background: "card", minimum: 3, kind: "ui" },
  { foreground: "chart-4", background: "card", minimum: 3, kind: "ui" },
  { foreground: "chart-5", background: "card", minimum: 3, kind: "ui" },
]

function tokenLabel(name: TokenName) {
  const label = name.replace(/-/g, " ")
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export {
  contrastPairs,
  reportPairs,
  tokenGroups,
  tokenLabel,
  tokenNames,
  type ContrastPair,
  type TokenGroup,
  type TokenName,
}
