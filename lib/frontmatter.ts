function frontmatter(fields: Record<string, string>) {
  return [
    "---",
    ...Object.entries(fields).map(
      ([key, value]) => `${key}: ${JSON.stringify(value)}`
    ),
    "---",
  ].join("\n")
}

export { frontmatter }
