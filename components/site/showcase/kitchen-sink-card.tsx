"use client"

import {
  IconArrowRight,
  IconChevronDown,
  IconSearch,
} from "@tabler/icons-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/toast"

function KitchenSinkCard() {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button>
              Button
              <IconArrowRight data-icon="inline-end" />
            </Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
          </div>
          <InputGroup>
            <InputGroupInput placeholder="Name" aria-label="Name" />
            <InputGroupAddon align="inline-end">
              <IconSearch />
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupTextarea placeholder="Message" aria-label="Message" />
          </InputGroup>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <Badge appearance="solid">Badge</Badge>
              <Badge>Outline</Badge>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroup
                aria-label="Density"
                defaultValue="comfortable"
                className="w-auto grid-flow-col"
              >
                <RadioGroupItem value="comfortable" aria-label="Comfortable" />
                <RadioGroupItem value="compact" aria-label="Compact" />
              </RadioGroup>
              <Checkbox defaultChecked aria-label="Remember me" />
              <Switch defaultChecked aria-label="Notifications" />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="outline" />}>
                Alert dialog
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this project?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Its pages and deploys are removed for everyone. This can’t
                    be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      toast("Project deleted")
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <ButtonGroup aria-label="Publish">
              <Button variant="outline">Button group</Button>
              <Button variant="outline" size="icon" aria-label="More options">
                <IconChevronDown />
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { KitchenSinkCard }
