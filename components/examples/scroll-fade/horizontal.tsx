const topics = [
  "All",
  "Design",
  "Engineering",
  "Product",
  "Research",
  "Marketing",
  "Sales",
  "Support",
  "Operations",
  "Finance",
]

export function ScrollFadeHorizontal() {
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="Topics"
      className="no-scrollbar flex w-full max-w-sm scroll-fade-x gap-2 overflow-x-auto rounded-md outline-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden"
    >
      {topics.map((topic) => (
        <span
          key={topic}
          className="shrink-0 rounded-full bg-muted px-3 py-1.5 text-sm"
        >
          {topic}
        </span>
      ))}
    </div>
  )
}
