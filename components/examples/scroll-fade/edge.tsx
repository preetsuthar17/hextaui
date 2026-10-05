"use client"

const messages = Array.from({ length: 16 }, (_, index) => ({
  id: index,
  text: index % 3 === 0 ? "Sounds good, ship it." : "Pushed the fix to main.",
}))

export function ScrollFadeEdge() {
  return (
    <div className="w-full max-w-xs rounded-xl bg-muted">
      <ul
        ref={(node) => {
          if (node) {
            node.scrollTop = node.scrollHeight
          }
        }}
        tabIndex={0}
        aria-label="Messages"
        className="flex h-64 scroll-fade-t flex-col gap-2 overflow-y-auto rounded-xl p-3 text-sm outline-none scroll-fade-t-16 focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden"
      >
        {messages.map((message) => (
          <li
            key={message.id}
            className="w-fit max-w-[80%] shrink-0 rounded-2xl bg-background px-3 py-2 even:self-end even:bg-primary even:text-primary-foreground"
          >
            {message.text}
          </li>
        ))}
      </ul>
    </div>
  )
}
