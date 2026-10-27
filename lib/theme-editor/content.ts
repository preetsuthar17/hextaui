import { themePresets } from "@/lib/theme-editor/presets"
import { tokenNames } from "@/lib/theme-editor/tokens"

const themeEditorTitle = "Theme editor for shadcn/ui"

const themeEditorDescription =
  "Free shadcn/ui theme editor. Start from a preset, a brand color or an image, check contrast in light and dark, then copy the CSS or install it with the CLI."

const themeEditorLead =
  "Pick a preset, a brand color or an image, and every shadcn/ui token follows in light and dark mode. Edit any color, watch real components update, then copy the CSS or install it with one command."

const themeEditorSteps = [
  {
    title: "Start from a preset, a color or an image",
    body: `Choose one of ${themePresets.length} presets, or pick one brand color and the editor builds the whole palette for both modes. Drop in a logo or screenshot and it picks the brand color for you, in your browser.`,
  },
  {
    title: "Tune every token",
    body: `All ${tokenNames.length} shadcn/ui color tokens are editable, from background and primary to the five chart colors and the sidebar. Type hex, rgb(), hsl() or oklch(), or use the color picker.`,
  },
  {
    title: "Check contrast as you go",
    body: "Each text color shows its WCAG contrast ratio against its surface, with the APCA value on hover. Pairs below 4.5:1 are listed at the top, so you can fix them before you ship.",
  },
  {
    title: "Export or share",
    body: "Copy Tailwind v4 CSS with the @theme inline mapping, copy JSON, or install the theme with the shadcn CLI. The share link holds the whole theme, so there is nothing to save.",
  },
]

const themeEditorFaq = [
  {
    question: "Is the theme editor free?",
    answer:
      "Yes. It is free, needs no account, and runs in your browser. The themes you make are yours to use in any project.",
  },
  {
    question: "Does it work with any shadcn/ui project?",
    answer:
      "Yes. The export uses the standard shadcn/ui CSS variables in OKLCH, so it works with the shadcn/ui components you already have, with HextaUI components, and with any other library built on the same tokens.",
  },
  {
    question: "How does the one-color generator keep text readable?",
    answer:
      "It builds every surface first, then moves each text color lighter or darker until it reaches a WCAG contrast ratio of at least 4.5:1 on its surface. Colors that fall outside sRGB are brought back into range so the hex values match.",
  },
  {
    question: "How do I install a theme with the shadcn CLI?",
    answer:
      "Open Export and copy the command. It runs npx shadcn@latest add with a link to your theme, and the CLI writes the light and dark variables into your CSS file.",
  },
  {
    question: "Can I import a theme I already have?",
    answer:
      "Yes. Paste the :root and .dark blocks from your globals.css, a tweakcn export, or an older shadcn/ui theme written in HSL. Tokens you leave out keep their current values.",
  },
  {
    question: "Is my image uploaded anywhere?",
    answer:
      "No. The image is read on a small canvas in your browser to find its main colors, and it never leaves your device.",
  },
]

export {
  themeEditorDescription,
  themeEditorFaq,
  themeEditorLead,
  themeEditorSteps,
  themeEditorTitle,
}
