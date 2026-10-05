import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

export function PopoverRtl() {
  return (
    <div dir="rtl" className="flex flex-wrap justify-center gap-2">
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          الأبعاد
        </PopoverTrigger>
        <PopoverContent align="start">
          <PopoverHeader>
            <PopoverTitle>الأبعاد</PopoverTitle>
            <PopoverDescription>اضبط أبعاد الطبقة.</PopoverDescription>
          </PopoverHeader>
          <div className="flex justify-end">
            <PopoverClose render={<Button size="sm" />}>تطبيق</PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          inline-end
        </PopoverTrigger>
        <PopoverContent side="inline-end" className="w-48">
          <PopoverTitle>يفتح نحو النهاية</PopoverTitle>
        </PopoverContent>
      </Popover>
    </div>
  )
}
