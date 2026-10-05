import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function DialogRtl() {
  return (
    <div dir="rtl">
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          تعديل الملف الشخصي
        </DialogTrigger>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>تعديل الملف الشخصي</DialogTitle>
            <DialogDescription>
              قم بإجراء تغييرات على ملفك الشخصي هنا. انقر على حفظ عند الانتهاء.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <FieldGroup>
              <Field>
                <FieldLabel>الاسم</FieldLabel>
                <Input defaultValue="ليلى أحمد" />
              </Field>
              <Field>
                <FieldLabel>اسم المستخدم</FieldLabel>
                <Input defaultValue="@layla" dir="ltr" />
              </Field>
            </FieldGroup>
          </DialogBody>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              إلغاء
            </DialogClose>
            <DialogClose render={<Button />}>حفظ التغييرات</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
