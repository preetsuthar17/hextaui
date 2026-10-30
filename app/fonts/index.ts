import localFont from "next/font/local"

const Inter = localFont({
  src: "./inter-core.woff2",
  weight: "400 900",
  style: "normal",
  display: "swap",
  variable: "--font-inter",
  fallback: ["Inter Fallback"],
  adjustFontFallback: false,
  declarations: [
    { prop: "font-family", value: "Inter" },
    {
      prop: "unicode-range",
      value:
        "U+20-7E,U+A0,U+A5,U+A9,U+AB,U+B0,U+B7,U+BA-BB,U+BF-C2,U+C4,U+C7,U+C9-CA,U+CD,U+D6-D7,U+DA,U+DC,U+DF-E4,U+E7-EA,U+ED-EF,U+F1,U+F3-F6,U+F9-FC,U+131,U+153,U+2DA,U+308,U+2013-2014,U+2018-2019,U+201C-201E,U+2022,U+2026,U+203A,U+20AC,U+2191,U+2193,U+2212",
    },
  ],
})

const InterExtended = localFont({
  src: "./inter-extended.woff2",
  weight: "400 900",
  style: "normal",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [
    { prop: "font-family", value: "Inter" },
    {
      prop: "unicode-range",
      value:
        "U+A1-A4,U+A6-A8,U+AA,U+AC,U+AE-AF,U+B1-B6,U+B8-B9,U+BC-BE,U+C3,U+C5-C6,U+C8,U+CB-CC,U+CE-D5,U+D8-D9,U+DB,U+DD-DE,U+E5-E6,U+EB-EC,U+F0,U+F2,U+F7-F8,U+FD-130,U+132-148,U+14A-152,U+154-17F,U+300-301,U+303,U+323,U+1E6A-1E6B,U+2009,U+20B9",
    },
  ],
})

const fontMono = localFont({
  src: "./paper-mono-core.woff2",
  weight: "400 800",
  style: "normal",
  display: "swap",
  variable: "--font-paper-mono",
  fallback: ["ui-monospace", "Menlo", "Consolas", "monospace"],
  adjustFontFallback: false,
  declarations: [
    { prop: "font-family", value: "fontMono" },
    {
      prop: "unicode-range",
      value:
        "U+20-7E,U+A0,U+301,U+303,U+308,U+30A,U+30C,U+327,U+335-338,U+2013-2014,U+2018-2019,U+201C-201D,U+2022,U+2026,U+2212,U+2500,U+2502,U+2514,U+251C",
    },
  ],
})

const fontMonoExtended = localFont({
  src: "./paper-mono-extended.woff2",
  weight: "400 800",
  style: "normal",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [
    { prop: "font-family", value: "fontMono" },
    {
      prop: "unicode-range",
      value:
        "U+A1-AC,U+AE-113,U+116-12B,U+12E-137,U+139-148,U+14A-14D,U+150-17E,U+2DA,U+300,U+201E,U+203A,U+20AC,U+20B9,U+2190-2194,U+21B5,U+21E5,U+21E7,U+221E,U+2303,U+2318,U+2325,U+232B,U+250C,U+25CB,U+25CF,U+301C",
    },
  ],
})

export {
  Inter as fontSans,
  InterExtended as fontSansExtended,
  fontMono,
  fontMonoExtended,
}
