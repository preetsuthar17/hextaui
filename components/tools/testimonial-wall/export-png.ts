const fontCache = new Map<string, Promise<string | null>>()

function toDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

async function fetchDataUrl(url: string) {
  try {
    const response = await fetch(url, { mode: "cors", credentials: "omit" })
    if (!response.ok) return null
    return await toDataUrl(await response.blob())
  } catch {
    return null
  }
}

function cachedDataUrl(url: string) {
  let entry = fontCache.get(url)
  if (!entry) {
    entry = fetchDataUrl(url)
    fontCache.set(url, entry)
  }
  return entry
}

function familyNames(fontFamily: string) {
  return new Set(
    fontFamily.split(",").map((name) =>
      name
        .trim()
        .replace(/^["']|["']$/g, "")
        .toLowerCase()
    )
  )
}

async function embedFontFace(rule: CSSFontFaceRule, base: string) {
  let text = rule.cssText
  const urls = [...text.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)].map(
    (match) => match[1]
  )
  for (const url of new Set(urls)) {
    if (url.startsWith("data:")) continue
    const data = await cachedDataUrl(new URL(url, base).toString())
    if (!data) return ""
    text = text.split(url).join(data)
  }
  return text
}

function collectRules(
  rules: CSSRuleList,
  fonts: CSSFontFaceRule[],
  out: string[]
) {
  for (const rule of Array.from(rules)) {
    if (rule instanceof CSSFontFaceRule) {
      fonts.push(rule)
    } else {
      out.push(rule.cssText)
    }
  }
}

async function collectCss(families: Set<string>) {
  const fonts: CSSFontFaceRule[] = []
  const css: string[] = []
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList
    try {
      rules = sheet.cssRules
    } catch {
      continue
    }
    collectRules(rules, fonts, css)
  }
  const used = fonts.filter((rule) =>
    families.has(
      rule.style
        .getPropertyValue("font-family")
        .trim()
        .replace(/^["']|["']$/g, "")
        .toLowerCase()
    )
  )
  const embedded = await Promise.all(
    used.map((rule) =>
      embedFontFace(rule, rule.parentStyleSheet?.href ?? document.baseURI)
    )
  )
  return [...embedded, ...css].join("\n")
}

async function inlineImages(clone: HTMLElement) {
  await Promise.all(
    Array.from(clone.querySelectorAll("img")).map(async (image) => {
      const data = image.src ? await fetchDataUrl(image.src) : null
      if (data) {
        image.src = data
        image.removeAttribute("srcset")
      } else {
        image.remove()
      }
    })
  )
}

function escapeXml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.decoding = "sync"
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("The snapshot didn’t render."))
    image.src = src
  })
}

async function exportPng(
  node: HTMLElement,
  { dark, scale = 2 }: { dark: boolean; scale?: number }
) {
  const rect = node.getBoundingClientRect()
  const width = Math.ceil(rect.width)
  const height = Math.ceil(node.scrollHeight)
  const computed = getComputedStyle(node)
  const clone = node.cloneNode(true) as HTMLElement
  clone.style.width = `${width}px`
  clone.style.margin = "0"
  await inlineImages(clone)
  const css = await collectCss(familyNames(computed.fontFamily))

  const wrapper = document.createElement("div")
  wrapper.setAttribute("xmlns", "http://www.w3.org/1999/xhtml")
  wrapper.className = [
    ...Array.from(document.documentElement.classList).filter(
      (name) => name !== "dark" && name !== "light"
    ),
    ...(dark ? ["dark"] : []),
  ].join(" ")
  wrapper.setAttribute(
    "style",
    [
      `width:${width}px`,
      `font-family:${computed.fontFamily}`,
      `color:${computed.color}`,
      `font-size:${computed.fontSize}`,
      `line-height:${computed.lineHeight}`,
      "-webkit-font-smoothing:antialiased",
      "text-rendering:optimizeLegibility",
      `--hairline:${1 / scale}px`,
    ].join(";")
  )
  wrapper.append(clone)

  const markup = new XMLSerializer().serializeToString(wrapper)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><style>${escapeXml(css)}*,*::before,*::after{animation:none!important;transition:none!important}</style><foreignObject x="0" y="0" width="100%" height="100%">${markup}</foreignObject></svg>`
  const image = await loadImage(
    `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  )

  const canvas = document.createElement("canvas")
  canvas.width = width * scale
  canvas.height = height * scale
  const context = canvas.getContext("2d")
  if (!context) throw new Error("Canvas isn’t available.")
  context.scale(scale, scale)
  context.drawImage(image, 0, 0, width, height)
  await new Promise((resolve) => requestAnimationFrame(resolve))
  context.clearRect(0, 0, width, height)
  context.drawImage(image, 0, 0, width, height)

  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new Error("The PNG couldn’t be encoded.")),
      "image/png"
    )
  )
}

export { exportPng }
