"use client"

import { DirectionProvider } from "@base-ui/react/direction-provider"

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "@/components/ui/combobox"
import { Label } from "@/components/ui/label"

const cities = ["القاهرة", "الرياض", "دبي", "بيروت", "عمّان", "الدوحة"]

export function ComboboxRtl() {
  return (
    <DirectionProvider direction="rtl">
      <div dir="rtl" className="flex w-full max-w-xs flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="combobox-rtl">المدينة</Label>
          <Combobox items={cities} defaultValue={cities[2]}>
            <ComboboxInput
              id="combobox-rtl"
              placeholder="اختر مدينة"
              showClear
            />
            <ComboboxContent>
              <ComboboxEmpty>لا توجد نتائج.</ComboboxEmpty>
              <ComboboxList>
                {(item: string) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="combobox-rtl-chips">المدن</Label>
          <Combobox items={cities} multiple defaultValue={[cities[0]]}>
            <ComboboxChips>
              <ComboboxValue>
                {(values: string[]) => (
                  <>
                    {values.map((value) => (
                      <ComboboxChip key={value}>{value}</ComboboxChip>
                    ))}
                    <ComboboxChipsInput id="combobox-rtl-chips" />
                  </>
                )}
              </ComboboxValue>
            </ComboboxChips>
            <ComboboxContent>
              <ComboboxList>
                {(item: string) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </div>
    </DirectionProvider>
  )
}
