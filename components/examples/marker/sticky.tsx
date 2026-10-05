import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Marker, MarkerContent, MarkerTime } from "@/components/ui/marker"

const day = 24 * 60 * 60 * 1000

const days = [
  {
    date: new Date(Date.now() - 3 * day),
    messages: [
      "Kicking off the marker component today.",
      "Shadcn's version is a good base. Let's add sticky dates.",
      "Agreed, chats need them.",
    ],
  },
  {
    date: new Date(Date.now() - day),
    messages: [
      "Sticky dates work. They turn into a pill when they stick.",
      "Nice. Does it respect reduced motion?",
      "Yes, the pill just appears.",
    ],
  },
  {
    date: new Date(),
    messages: ["Docs are up.", "Shipping it.", "🎉"],
  },
]

export function MarkerSticky() {
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="Activity by day"
      className="h-80 w-full max-w-md overflow-y-auto overscroll-none rounded-xl border px-4 outline-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:outline-hidden"
    >
      {days.map((group) => (
        <section
          key={group.date.toDateString()}
          className="flex flex-col gap-3 py-3"
        >
          <Marker variant="separator" sticky>
            <MarkerContent>
              <MarkerTime date={group.date} />
            </MarkerContent>
          </Marker>
          {group.messages.map((message, index) => (
            <Bubble
              key={message}
              align={index % 2 === 0 ? "start" : "end"}
              variant={index % 2 === 0 ? "secondary" : "default"}
            >
              <BubbleContent>{message}</BubbleContent>
            </Bubble>
          ))}
        </section>
      ))}
    </div>
  )
}
