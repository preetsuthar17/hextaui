import {
  Timeline,
  TimelineConnector,
  TimelineDescription,
  TimelineItem,
  TimelineMarker,
  TimelineTime,
  TimelineTitle,
} from "@/components/ui/ui-sdk-timeline"

const events = [
  {
    title: "تم النشر",
    dateTime: "2026-11-10T14:32",
    time: "اليوم، 2:32 م",
    description: "الإصدار 2.4.1 متاح الآن في كل المناطق.",
  },
  {
    title: "نجحت الفحوصات",
    dateTime: "2026-11-10T14:20",
    time: "اليوم، 2:20 م",
    description: "اجتاز 312 اختبارًا.",
  },
  {
    title: "تم دمج الطلب",
    dateTime: "2026-11-10T13:58",
    time: "اليوم، 1:58 م",
    description: "دمجت آدا التغييرات في الفرع الرئيسي.",
  },
]

function UiSdkTimelineRtl() {
  return (
    <div dir="rtl" lang="ar" className="w-full max-w-sm">
      <Timeline aria-label="النشاط">
        {events.map((event) => (
          <TimelineItem key={event.title}>
            <TimelineMarker />
            <TimelineConnector />
            <TimelineTitle>{event.title}</TimelineTitle>
            <TimelineTime dateTime={event.dateTime}>{event.time}</TimelineTime>
            <TimelineDescription>{event.description}</TimelineDescription>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  )
}

export { UiSdkTimelineRtl }
